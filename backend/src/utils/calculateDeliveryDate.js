const SHIPPING_TYPES = {
  express: { name: 'Express Delivery', minDays: 1, maxDays: 2, price: 49.99 },
  air:     { name: 'Air Freight',       minDays: 2, maxDays: 4, price: 34.99 },
  ocean:   { name: 'Ocean Freight',     minDays: 14, maxDays: 30, price: 12.99 },
  road:    { name: 'Road Freight',      minDays: 3, maxDays: 7, price: 19.99 },
  rail:    { name: 'Rail Freight',      minDays: 5, maxDays: 10, price: 15.99 },
  eco:     { name: 'Eco Shipping',      minDays: 5, maxDays: 10, price: null },
};

/**
 * Calculates estimated delivery date based on shipping type.
 * Uses the midpoint between min and max days.
 * @param {string} shippingType - key from SHIPPING_TYPES
 * @param {Date} [fromDate] - start date (defaults to now)
 * @returns {Date} estimated delivery date
 */
function calculateDeliveryDate(shippingType, fromDate = new Date()) {
  const config = SHIPPING_TYPES[shippingType];
  if (!config) return null;

  const avgDays = Math.ceil((config.minDays + config.maxDays) / 2);
  const delivery = new Date(fromDate);
  delivery.setDate(delivery.getDate() + avgDays);
  return delivery;
}

/**
 * Gets the price for a shipping type.
 * @param {string} shippingType
 * @returns {number|null}
 */
function getShippingPrice(shippingType) {
  return SHIPPING_TYPES[shippingType]?.price ?? null;
}

module.exports = { SHIPPING_TYPES, calculateDeliveryDate, getShippingPrice };
