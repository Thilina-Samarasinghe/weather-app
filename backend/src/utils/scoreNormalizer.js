/**
 * scoreNormalizer.js
 *
 * Utility functions to clamp and normalize raw parameter scores
 * into a consistent 0–100 range. Used by comfortIndex.service.js.
 */

/**
 * Clamps a value between min and max.
 */
const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

/**
 * Normalizes a value to 0–100 using linear interpolation.
 * @param {number} value - The raw value
 * @param {number} min   - The minimum expected raw value
 * @param {number} max   - The maximum expected raw value
 */
const normalize = (value, min, max) => {
  if (max === min) return 100;
  return clamp(((value - min) / (max - min)) * 100);
};

/**
 * Scores a value based on distance from an ideal "sweet spot".
 * Perfect score at ideal, drops off on both sides.
 *
 * @param {number} value      - The raw value
 * @param {number} idealLow   - Lower bound of ideal range
 * @param {number} idealHigh  - Upper bound of ideal range
 * @param {number} penaltyPerUnit - Points deducted per unit outside ideal
 */
const scoreFromIdealRange = (value, idealLow, idealHigh, penaltyPerUnit) => {
  if (value >= idealLow && value <= idealHigh) return 100;
  const deviation = value < idealLow ? idealLow - value : value - idealHigh;
  return clamp(100 - deviation * penaltyPerUnit);
};

module.exports = { clamp, normalize, scoreFromIdealRange };
