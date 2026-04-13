const express = require('express');
const router = express.Router();
const {
  list, getOne, create, update, remove, bulkUpdate, publicTrack,
} = require('../controllers/shipmentController');
const { requireAuth } = require('../middleware/auth');
const {
  createShipmentValidation,
  updateShipmentValidation,
  bulkUpdateValidation,
} = require('../middleware/validation');

// PUBLIC — must be before /:id to avoid route collision
router.get('/track/:reference', publicTrack);

// PROTECTED
router.get('/', requireAuth, list);
router.get('/:id', requireAuth, getOne);
router.post('/', requireAuth, createShipmentValidation, create);
router.put('/:id', requireAuth, updateShipmentValidation, update);
router.delete('/:id', requireAuth, remove);
router.post('/bulk', requireAuth, bulkUpdateValidation, bulkUpdate);

module.exports = router;
