const axios = require('axios');
const config = require('../config/env');
const cache = require('../cache/cacheManager');
const { computeComfortIndex } = require('./comfortIndex.service');

/**
 * Fetches weather data for a single city.
 * Uses raw cache to avoid redundant API calls.
 *
 * @param {number} cityId - OWM city ID
 * @returns {{ data: Object, cacheHit: boolean }}
 */
async function fetchWeatherForCity(cityId) {
  const cached = cache.getRaw(cityId);

  if (cached) {
    return { data: cached, cacheHit: true };
  }

  const response = await axios.get(config.owm.baseUrl, {
    params: {
      id: cityId,
      appid: config.owm.apiKey,
    },
    timeout: 8000,
  });

  cache.setRaw(cityId, response.data);
  return { data: response.data, cacheHit: false };
}

/**
 * Fetches weather for all cities, computes comfort scores,
 * sorts by score, assigns ranks.
 *
 * @param {number[]} cityIds - Array of OWM city IDs
 * @returns {{ cities: Object[], processedCacheHit: boolean }}
 */
async function fetchAllCitiesWeather(cityIds) {
  // Check processed cache first
  const processedCached = cache.getProcessed();
  if (processedCached) {
    return { cities: processedCached, processedCacheHit: true };
  }

  // Fetch all cities in parallel
  const results = await Promise.allSettled(
    cityIds.map((id) => fetchWeatherForCity(id))
  );

  const cities = [];

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`⚠️  Failed to fetch city ID ${cityIds[index]}: ${result.reason.message}`);
      return;
    }

    const { data, cacheHit } = result.value;
    const comfort = computeComfortIndex(data);

    cities.push({
      id:          data.id,
      name:        data.name,
      country:     data.sys.country,
      description: data.weather[0].description,
      icon:        data.weather[0].icon,
      temperature: comfort.inputs.tempCelsius,
      humidity:    comfort.inputs.humidity,
      windSpeed:   comfort.inputs.windSpeed,
      cloudiness:  comfort.inputs.cloudiness,
      visibility:  comfort.inputs.visibility,
      pressure:    data.main.pressure,
      feelsLike:   Math.round((data.main.feels_like - 273.15) * 10) / 10,
      comfortScore:comfort.score,
      breakdown:   comfort.breakdown,
      weights:     comfort.weights,
      rawCacheHit: cacheHit,
    });
  });

  // Sort descending by comfort score (Most Comfortable → Least)
  cities.sort((a, b) => b.comfortScore - a.comfortScore);

  // Assign rank positions
  cities.forEach((city, index) => {
    city.rank = index + 1;
  });

  // Cache the processed result
  cache.setProcessed(cities);

  return { cities, processedCacheHit: false };
}

module.exports = { fetchAllCitiesWeather };
