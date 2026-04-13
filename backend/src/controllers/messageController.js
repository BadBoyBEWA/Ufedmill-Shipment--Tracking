const pool = require('../db/connection');

// GET /api/messages/conversations (Admin only)
// Lists unique tracking_ids that have messages
async function getConversations(req, res) {
  try {
    const result = await pool.query(
      `SELECT tracking_id, MAX(created_at) as last_message_at, 
              COUNT(*) FILTER (WHERE is_read = false AND sender_type = 'user') as unread_count
       FROM messages 
       GROUP BY tracking_id 
       ORDER BY last_message_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// GET /api/messages/:tracking_id
async function getMessages(req, res) {
  try {
    const { tracking_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM messages WHERE tracking_id = $1 ORDER BY created_at ASC`,
      [tracking_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /api/messages
async function sendMessage(req, res) {
  try {
    const { tracking_id, content, sender_type } = req.body;
    
    if (!tracking_id || !content || !sender_type) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const result = await pool.query(
      `INSERT INTO messages (tracking_id, content, sender_type) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [tracking_id, content, sender_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// PUT /api/messages/:tracking_id/read (Admin only)
async function markAsRead(req, res) {
  try {
    const { tracking_id } = req.params;
    await pool.query(
      `UPDATE messages SET is_read = true 
       WHERE tracking_id = $1 AND sender_type = 'user'`,
      [tracking_id]
    );
    res.json({ message: 'Messages marked as read.' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getConversations, getMessages, sendMessage, markAsRead };
