/**
 * Generates a unique tracking ID in the format TRK-XXXXXX
 * where XXXXXX is 6 uppercase alphanumeric characters
 */
function generateTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRK-${suffix}`;
}

module.exports = { generateTrackingId };
