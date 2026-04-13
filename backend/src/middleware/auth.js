const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

/**
 * Middleware to protect admin routes.
 * Verifies the Bearer JWT in the Authorization header.
 * Attaches the admin record to req.admin on success.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired.', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Fetch admin from DB to ensure account is still active
    const result = await pool.query(
      'SELECT id, email, full_name, role, is_active FROM admins WHERE id = $1',
      [decoded.adminId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ error: 'Account not found or deactivated.' });
    }

    req.admin = result.rows[0];
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { requireAuth };
