const path = require('path');
const { fetchAllCitiesWeather } = require('../services/weather.service');

// Load cities.json from backend root
const citiesData = require(path.join(__dirname, '../../cities.json'));
const cityIds = citiesData.map((c) => c.CityCode);

/**
 * GET /api/weather
 * Returns all cities with comfort scores and rankings.
 * Protected by Auth0 JWT middleware.
 */
async function getWeatherData(req, res, next) {
  try {
    const { cities, processedCacheHit } = await fetchAllCitiesWeather(cityIds);

    return res.json({
      success: true,
      cacheHit: processedCacheHit,
      count: cities.length,
      lastUpdated: new Date().toISOString(),
      data: cities,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getWeatherData };
