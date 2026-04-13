const pool = require('../db/connection');

// GET /api/dashboard/stats
async function getStats(req, res) {
  try {
    const { status } = req.query;
    let recentQuery = `SELECT id, tracking_id, reference_number, shipping_type, origin_address, destination_address, status, estimated_delivery_date, sender_name, created_at
                       FROM shipments`;
    const recentParams = [];
    
    if (status && status !== 'all') {
      recentQuery += ` WHERE status = $1`;
      recentParams.push(status);
    }
    recentQuery += ` ORDER BY created_at DESC LIMIT 10`;

    const [totalResult, byStatusResult, byTypeResult, recentResult, activityResult, unreadResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM shipments'),
      pool.query(`SELECT status, COUNT(*) as count FROM shipments GROUP BY status`),
      pool.query(`SELECT shipping_type, COUNT(*) as count FROM shipments GROUP BY shipping_type`),
      pool.query(recentQuery, recentParams),
      pool.query(
        `SELECT a.id, a.action, a.resource_type, a.details, a.created_at, ad.full_name as admin_name
         FROM admin_activity_log a
         LEFT JOIN admins ad ON a.admin_id = ad.id
         ORDER BY a.created_at DESC LIMIT 10`
      ),
      pool.query('SELECT COUNT(*) as count FROM messages WHERE is_read = false AND sender_type = \'user\''),
    ]);

    const byStatus = {
      in_transit: 0,
      store: 0,
      shipped: 0,
      delivered: 0,
    };

    byStatusResult.rows.forEach((row) => {
      if (byStatus.hasOwnProperty(row.status)) {
        byStatus[row.status] = parseInt(row.count);
      }
    });

    const byType = {};
    byTypeResult.rows.forEach((row) => {
      byType[row.shipping_type] = parseInt(row.count);
    });

    res.json({
      total: parseInt(totalResult.rows[0].total),
      byStatus,
      byType,
      recentShipments: recentResult.rows,
      activities: activityResult.rows,
      unreadMessages: parseInt(unreadResult.rows[0].count),
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getStats };
