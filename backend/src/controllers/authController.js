const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db/connection');
const { sendPasswordResetEmail } = require('../utils/emailService');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

function generateAccessToken(adminId) {
  return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(adminId) {
  return jwt.sign({ adminId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

async function logActivity(adminId, action, resourceType = null, resourceId = null, details = {}) {
  try {
    await pool.query(
      `INSERT INTO admin_activity_log (admin_id, action, resource_type, resource_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [adminId, action, resourceType, resourceId, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Activity log error:', err);
  }
}

// POST /api/admin/login
async function login(req, res) {
  const { email, password, rememberMe } = req.body;

  try {
    // Fetch admin
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const admin = result.rows[0];

    // Check lockout
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(admin.locked_until) - new Date()) / 60000);
      return res.status(429).json({
        error: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      const newAttempts = admin.failed_login_attempts + 1;
      let lockedUntil = null;

      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      }

      await pool.query(
        `UPDATE admins SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3`,
        [newAttempts, lockedUntil, admin.id]
      );

      if (lockedUntil) {
        return res.status(429).json({
          error: `Too many failed attempts. Account locked for ${LOCKOUT_DURATION_MINUTES} minutes.`,
        });
      }

      return res.status(401).json({
        error: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - newAttempts} attempt(s) remaining.`,
      });
    }

    // Reset failed attempts and update last login
    await pool.query(
      `UPDATE admins SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1`,
      [admin.id]
    );

    // Issue tokens
    const accessToken = generateAccessToken(admin.id);
    const refreshToken = generateRefreshToken(admin.id);

    // Store refresh token in DB
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await pool.query(
      `INSERT INTO admin_sessions (admin_id, refresh_token, expires_at) VALUES ($1, $2, $3)`,
      [admin.id, refreshToken, refreshExpiry]
    );

    // Log activity
    await logActivity(admin.id, 'LOGIN', 'admin', admin.id, { email: admin.email });

    // Set HTTP-only cookie for refresh token
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.json({
      accessToken,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /api/admin/logout
async function logout(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await pool.query('DELETE FROM admin_sessions WHERE refresh_token = $1', [refreshToken]);
      if (req.admin) {
        await logActivity(req.admin.id, 'LOGOUT', 'admin', req.admin.id);
      }
    }

    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /api/admin/refresh
async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided.' });
    }

    // Verify the token signature first
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    // Verify it exists in DB and hasn't expired
    const sessionResult = await pool.query(
      `SELECT * FROM admin_sessions WHERE refresh_token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Session not found or expired.' });
    }

    // Check admin is still active
    const adminResult = await pool.query(
      'SELECT id, email, full_name, role, is_active FROM admins WHERE id = $1',
      [decoded.adminId]
    );

    if (adminResult.rows.length === 0 || !adminResult.rows[0].is_active) {
      return res.status(401).json({ error: 'Account not found or deactivated.' });
    }

    // Issue new access token
    const newAccessToken = generateAccessToken(decoded.adminId);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /api/admin/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;
  console.log(`[DEBUG] Forgot password request for: ${email}`);

  try {
    const adminResult = await pool.query('SELECT id, email FROM admins WHERE email = $1', [email]);
    if (adminResult.rows.length === 0) {
      console.log(`[DEBUG] Email not found in database: ${email}`);
      // Don't reveal if email doesn't exist for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const admin = adminResult.rows[0];
    console.log(`[DEBUG] Admin found: ${admin.id}. Generating token...`);
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      `UPDATE admins SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3`,
      [token, expiry, admin.id]
    );

    console.log(`[DEBUG] Sending reset email to: ${admin.email}`);
    await sendPasswordResetEmail(admin.email, token);

    console.log(`[DEBUG] Flow completed for: ${email}`);
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request.' });
  }
}


async function resetPassword(req, res) {
  const { token, password } = req.body;
  console.log(`[DEBUG] Reset password attempt with token: ${token}`);

  try {
    const adminResult = await pool.query(
      `SELECT id FROM admins WHERE reset_password_token = $1 AND reset_password_expires > NOW()`,
      [token]
    );

    if (adminResult.rows.length === 0) {
      console.log(`[DEBUG] Invalid or expired token: ${token}`);
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    const admin = adminResult.rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `UPDATE admins SET 
        password_hash = $1, 
        reset_password_token = NULL, 
        reset_password_expires = NULL,
        failed_login_attempts = 0,
        locked_until = NULL 
       WHERE id = $2`,
      [passwordHash, admin.id]
    );

    await logActivity(admin.id, 'PASSWORD_RESET', 'admin', admin.id);

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
}

// GET /api/admin/me
async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role FROM admins WHERE id = $1',
      [req.admin.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ admin: result.rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { login, logout, refresh, getMe, forgotPassword, resetPassword };
