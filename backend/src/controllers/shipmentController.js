const pool = require('../db/connection');
const { generateTrackingId } = require('../utils/generateTrackingId');
const { calculateDeliveryDate, getShippingPrice } = require('../utils/calculateDeliveryDate');

const VALID_STATUSES = ['in_transit', 'store', 'shipped', 'delivered'];

async function logActivity(adminId, action, resourceId, details = {}) {
  try {
    await pool.query(
      `INSERT INTO admin_activity_log (admin_id, action, resource_type, resource_id, details)
       VALUES ($1, $2, 'shipment', $3, $4)`,
      [adminId, action, resourceId, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Activity log error:', err);
  }
}

// GET /api/shipments
async function list(req, res) {
  try {
    const { page = 1, limit = 20, search = '', status = '', type = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (search) {
      conditions.push(
        `(tracking_id ILIKE $${paramIdx} OR reference_number ILIKE $${paramIdx} OR origin_address ILIKE $${paramIdx} OR destination_address ILIKE $${paramIdx} OR sender_name ILIKE $${paramIdx} OR receiver_name ILIKE $${paramIdx})`
      );
      params.push(`%${search}%`);
      paramIdx++;
    }

    if (status) {
      conditions.push(`status = $${paramIdx}`);
      params.push(status);
      paramIdx++;
    }

    if (type) {
      conditions.push(`shipping_type = $${paramIdx}`);
      params.push(type);
      paramIdx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM shipments ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const dataParams = [...params, parseInt(limit), offset];
    const dataResult = await pool.query(
      `SELECT * FROM shipments ${where} ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      dataParams
    );

    res.json({
      shipments: dataResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('List shipments error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// GET /api/shipments/:id
async function getOne(req, res) {
  try {
    const result = await pool.query('SELECT * FROM shipments WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get shipment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /api/shipments
async function create(req, res) {
  try {
    const {
      reference_number,
      shipping_type,
      origin_address,
      destination_address,
      status = 'in_transit',
      estimated_delivery_date,
      price: customPrice,
      sender_name,
      receiver_name,
    } = req.body;

    // Generate unique tracking ID (retry on collision)
    let tracking_id;
    let attempts = 0;
    do {
      tracking_id = generateTrackingId();
      const existing = await pool.query('SELECT id FROM shipments WHERE tracking_id = $1', [tracking_id]);
      if (existing.rows.length === 0) break;
      attempts++;
    } while (attempts < 5);

    const price = customPrice !== undefined ? customPrice : getShippingPrice(shipping_type);
    const eta = estimated_delivery_date || calculateDeliveryDate(shipping_type);

    const initialHistory = JSON.stringify([
      {
        status,
        timestamp: new Date().toISOString(),
        location: 'Origin Facility',
      },
    ]);

    const result = await pool.query(
      `INSERT INTO shipments
        (tracking_id, reference_number, shipping_type, price, origin_address, destination_address, status, status_history, estimated_delivery_date, created_by, sender_name, receiver_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        tracking_id,
        reference_number || null,
        shipping_type,
        price,
        origin_address,
        destination_address,
        status,
        initialHistory,
        eta,
        req.admin.id,
        sender_name || null,
        receiver_name || null,
      ]
    );

    await logActivity(req.admin.id, 'CREATE_SHIPMENT', result.rows[0].id, { tracking_id, shipping_type });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create shipment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// PUT /api/shipments/:id
async function update(req, res) {
  try {
    const { id } = req.params;
    const {
      reference_number,
      shipping_type,
      price,
      origin_address,
      destination_address,
      status,
      estimated_delivery_date,
      status_location,
      sender_name,
      receiver_name,
    } = req.body;

    // Fetch current shipment
    const current = await pool.query('SELECT * FROM shipments WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }

    const shipment = current.rows[0];
    let statusHistory = shipment.status_history || [];

    // Append to history if status changed
    if (status && status !== shipment.status) {
      statusHistory = [
        ...statusHistory,
        {
          status,
          timestamp: new Date().toISOString(),
          location: status_location || null,
        },
      ];
    }

    const result = await pool.query(
      `UPDATE shipments SET
        reference_number = COALESCE($1, reference_number),
        shipping_type = COALESCE($2, shipping_type),
        price = COALESCE($3, price),
        origin_address = COALESCE($4, origin_address),
        destination_address = COALESCE($5, destination_address),
        status = COALESCE($6, status),
        status_history = $7,
        estimated_delivery_date = COALESCE($8, estimated_delivery_date),
        sender_name = COALESCE($9, sender_name),
        receiver_name = COALESCE($10, receiver_name)
       WHERE id = $11
       RETURNING *`,
      [
        reference_number,
        shipping_type,
        price,
        origin_address,
        destination_address,
        status,
        JSON.stringify(statusHistory),
        estimated_delivery_date,
        sender_name,
        receiver_name,
        id,
      ]
    );

    await logActivity(req.admin.id, 'UPDATE_SHIPMENT', id, { changes: req.body });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update shipment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// DELETE /api/shipments/:id
async function remove(req, res) {
  try {
    const result = await pool.query('DELETE FROM shipments WHERE id = $1 RETURNING id, tracking_id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }

    await logActivity(req.admin.id, 'DELETE_SHIPMENT', req.params.id, { tracking_id: result.rows[0].tracking_id });

    res.json({ message: 'Shipment deleted.', id: result.rows[0].id });
  } catch (err) {
    console.error('Delete shipment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /api/shipments/bulk
async function bulkUpdate(req, res) {
  const { ids, status } = req.body;

  // Validation already done by middleware, but double-check here
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No shipment IDs provided.' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const timestamp = new Date().toISOString();

    // Update each shipment and append to history
    for (const id of ids) {
      const current = await client.query('SELECT status, status_history FROM shipments WHERE id = $1', [id]);
      if (current.rows.length === 0) continue;

      const shipment = current.rows[0];
      // Only update if status is actually changing
      if (shipment.status === status) continue;

      const history = [
        ...(shipment.status_history || []),
        { status, timestamp, location: null },
      ];

      await client.query(
        `UPDATE shipments SET status = $1, status_history = $2 WHERE id = $3`,
        [status, JSON.stringify(history), id]
      );
    }

    await client.query('COMMIT');

    await logActivity(req.admin.id, 'BULK_UPDATE_SHIPMENTS', null, { ids, status, count: ids.length });

    res.json({ message: `Updated ${ids.length} shipment(s) to "${status}".` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
}

// GET /api/shipments/track/:reference — PUBLIC (no auth)
async function publicTrack(req, res) {
  try {
    const { reference } = req.params;

    const result = await pool.query(
      `SELECT * FROM shipments
       WHERE tracking_id = $1 OR reference_number = $1
       LIMIT 1`,
      [reference]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found. Please check your tracking number.' });
    }

    // Return shipment (exclude internal fields)
    const shipment = result.rows[0];
    res.json({
      id: shipment.id,
      tracking_id: shipment.tracking_id,
      reference_number: shipment.reference_number,
      shipping_type: shipment.shipping_type,
      origin_address: shipment.origin_address,
      destination_address: shipment.destination_address,
      status: shipment.status,
      status_history: shipment.status_history,
      estimated_delivery_date: shipment.estimated_delivery_date,
      created_at: shipment.created_at,
      updated_at: shipment.updated_at,
    });
  } catch (err) {
    console.error('Public track error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { list, getOne, create, update, remove, bulkUpdate, publicTrack };
