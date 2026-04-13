const { body, validationResult } = require('express-validator');

/**
 * Runs validation and returns errors if any exist.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed.',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validate,
];

const VALID_STATUSES = ['in_transit', 'store', 'shipped', 'delivered'];
const VALID_TYPES = ['express', 'air', 'ocean', 'road', 'rail', 'eco'];

const createShipmentValidation = [
  body('shipping_type').isIn(VALID_TYPES).withMessage(`Shipping type must be one of: ${VALID_TYPES.join(', ')}`),
  body('origin_address').trim().notEmpty().withMessage('Origin address is required.'),
  body('destination_address').trim().notEmpty().withMessage('Destination address is required.'),
  body('status').optional().isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('reference_number').optional().trim(),
  body('price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  validate,
];

const updateShipmentValidation = [
  body('shipping_type').optional().isIn(VALID_TYPES).withMessage(`Invalid shipping type.`),
  body('origin_address').optional().trim().notEmpty().withMessage('Origin address cannot be empty.'),
  body('destination_address').optional().trim().notEmpty().withMessage('Destination address cannot be empty.'),
  body('status').optional().isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('reference_number').optional().trim(),
  body('price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  validate,
];

const bulkUpdateValidation = [
  body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array.'),
  body('ids.*').isUUID().withMessage('Each id must be a valid UUID.'),
  body('status').isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  validate,
];

module.exports = {
  loginValidation,
  createShipmentValidation,
  updateShipmentValidation,
  bulkUpdateValidation,
  VALID_STATUSES,
  VALID_TYPES,
};
