const jwt = require('jsonwebtoken');
const db = require('../db/connection'); // Changed from 'pool' to 'db' to match your connection file

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

    // FIX: Use the correct column names that exist in your database
    // Your token has 'id', not 'adminId'
    const adminId = decoded.id || decoded.adminId;
    
    const result = await db.query(
      'SELECT id, email, username FROM admins WHERE id = $1',
      [adminId]
    );

    // Handle different result formats
    const users = result.rows || result;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Account not found or deactivated.' });
    }

    req.admin = users[0];
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { requireAuth };