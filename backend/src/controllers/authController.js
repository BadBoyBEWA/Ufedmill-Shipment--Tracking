require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db/connection');

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query user - works with both pg and neon
    const result = await db.query(
      'SELECT id, email, username, password_hash FROM admins WHERE email = $1',
      [email]
    );

    // Handle different result formats (pg uses .rows, neon might return array directly)
    const users = result.rows || result;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in database
    await db.query(
      'INSERT INTO refresh_tokens (token, admin_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    res.json({
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Request password reset
// @route   POST /api/admin/forgot-password
// @access  Public
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find admin by email
    const result = await db.query(
      'SELECT id, email, username FROM admins WHERE email = $1',
      [email]
    );

    const users = result.rows || result;

    if (users.length === 0) {
      // For security, don't reveal that email doesn't exist
      return res.status(200).json({
        message: 'If an account exists with that email, you will receive password reset instructions.'
      });
    }

    const admin = users[0];

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Store token in database
    await db.query(
      'UPDATE admins SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, admin.id]
    );

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`);

    res.status(200).json({
      message: 'If an account exists with that email, you will receive password reset instructions.'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

// @desc    Reset password
// @route   POST /api/admin/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Find admin with valid token
    const result = await db.query(
      `SELECT id, email FROM admins 
       WHERE reset_password_token = $1 
       AND reset_password_expires > NOW()`,
      [token]
    );

    const users = result.rows || result;

    if (users.length === 0) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    const admin = users[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await db.query(
      `UPDATE admins 
       SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL 
       WHERE id = $2`,
      [hashedPassword, admin.id]
    );

    // Invalidate all existing refresh tokens for this user
    await db.query(
      'DELETE FROM refresh_tokens WHERE admin_id = $1',
      [admin.id]
    );

    res.status(200).json({
      message: 'Password has been reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// @desc    Refresh access token
// @route   POST /api/admin/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token exists in database
    const result = await db.query(
      'SELECT admin_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    const tokens = result.rows || result;

    if (tokens.length === 0) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Verify JWT
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Get user info
    const userResult = await db.query(
      'SELECT id, email, username FROM admins WHERE id = $1',
      [decoded.id]
    );

    const users = userResult.rows || userResult;

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// @desc    Logout
// @route   POST /api/admin/logout
// @access  Private
// @desc    Logout
// @route   POST /api/admin/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Optional: Also delete all refresh tokens for this admin
    if (req.admin && req.admin.id) {
      await db.query('DELETE FROM refresh_tokens WHERE admin_id = $1', [req.admin.id]);
    } else if (refreshToken) {
      await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// @desc    Get current user
// @route   GET /api/admin/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    // Your requireAuth middleware attaches the admin to req.admin
    const admin = req.admin;
    
    if (!admin) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    res.json({
      id: admin.id,
      email: admin.email,
      username: admin.username
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  login,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  logout,
  getCurrentUser
};