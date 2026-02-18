const NodeCache = require('node-cache');
const config = require('../config/env');

/**
 * TWO-LAYER CACHING STRATEGY
 *
 * Layer 1 — rawCache:
 *   Stores raw OpenWeatherMap API responses per city.
 *   Key pattern: raw_<cityId>
 *   TTL: 5 minutes
 *   Purpose: Avoids hammering the OWM API on repeated requests.
 *
 * Layer 2 — processedCache:
 *   Stores the fully computed + sorted + ranked city list.
 *   Key: "all_cities_processed"
 *   TTL: 5 minutes
 *   Purpose: Skips re-computation of Comfort Index on every request.
 */

const rawCache = new NodeCache({
  stdTTL: config.cache.ttlSeconds,
  checkperiod: 60,
  useClones: false,
});

const processedCache = new NodeCache({
  stdTTL: config.cache.ttlSeconds,
  checkperiod: 60,
  useClones: false,
});

// ─── Raw Cache ────────────────────────────────────────────────
const getRaw = (cityId) => rawCache.get(`raw_${cityId}`);
const setRaw = (cityId, data) => rawCache.set(`raw_${cityId}`, data);

// ─── Processed Cache ──────────────────────────────────────────
const PROCESSED_KEY = 'all_cities_processed';
const getProcessed = () => processedCache.get(PROCESSED_KEY);
const setProcessed = (data) => processedCache.set(PROCESSED_KEY, data);

// ─── Debug Stats ──────────────────────────────────────────────
const getStats = () => {
  const rawStats = rawCache.getStats();
  const processedStats = processedCache.getStats();

  return {
    raw: {
      hits: rawStats.hits,
      misses: rawStats.misses,
      keys: rawCache.keys(),
      keysCount: rawCache.keys().length,
      ttlSeconds: config.cache.ttlSeconds,
    },
    processed: {
      hits: processedStats.hits,
      misses: processedStats.misses,
      keys: processedCache.keys(),
      keysCount: processedCache.keys().length,
      ttlSeconds: config.cache.ttlSeconds,
    },
  };
};

module.exports = { getRaw, setRaw, getProcessed, setProcessed, getStats };
