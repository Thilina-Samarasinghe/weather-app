const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/auth.middleware');
const { getStats } = require('../cache/cacheManager');

/**
 * GET /api/cache/status
 * Protected: Requires valid Auth0 JWT Bearer token.
 * Debug endpoint — shows cache HIT/MISS stats and current keys.
 *
 * Response example:
 * {
 *   "raw":       { hits: 10, misses: 2, keys: ["raw_2172797", ...] },
 *   "processed": { hits: 5,  misses: 1, keys: ["all_cities_processed"] }
 * }
 */
router.get('/status', checkJwt, (req, res) => {
  const stats = getStats();
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    cache: stats,
  });
});

module.exports = router;
