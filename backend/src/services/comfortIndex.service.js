/**
 * ============================================================
 * COMFORT INDEX SERVICE
 * ============================================================
 *
 * Computes a Comfort Index Score (0–100) for a city based on
 * real weather data from OpenWeatherMap.
 *
 * ── FORMULA DESIGN ──────────────────────────────────────────
 *
 * Five parameters are scored individually (each 0–100),
 * then combined using a weighted average:
 *
 *   ComfortScore = (T×0.35) + (H×0.25) + (W×0.20) + (C×0.10) + (V×0.10)
 *
 *   T = Temperature Score  (weight: 35%)
 *   H = Humidity Score     (weight: 25%)
 *   W = Wind Speed Score   (weight: 20%)
 *   C = Cloudiness Score   (weight: 10%)
 *   V = Visibility Score   (weight: 10%)
 *
 * ── PARAMETER REASONING ─────────────────────────────────────
 *
 * Temperature (35%): The single most impactful factor. Humans
 *   perceive comfort strongly through ambient temperature.
 *   Ideal range: 18–24°C (pleasant, not too hot/cold).
 *
 * Humidity (25%): High humidity makes heat feel unbearable;
 *   low humidity causes dryness. Ideal: 40–60%.
 *
 * Wind (20%): A gentle breeze enhances comfort; strong winds
 *   are disruptive. Ideal: 1–5 m/s.
 *
 * Cloudiness (10%): Partial clouds (~20–40%) are most
 *   pleasant outdoors — provides some shade without gloom.
 *
 * Visibility (10%): High visibility indicates clean air.
 *   Capped at 10,000m (OWM maximum).
 *
 * ── TRADE-OFFS ──────────────────────────────────────────────
 *
 * Dew point (not directly available in OWM free tier) would
 * ideally replace or supplement humidity as it better captures
 * perceived mugginess. Omitted due to API limitations.
 *
 * Pressure is excluded because its comfort impact is highly
 * individual and harder to score universally.
 * ============================================================
 */

const { scoreFromIdealRange, normalize } = require('../utils/scoreNormalizer');

// ── Individual Parameter Scorers ──────────────────────────────

/**
 * Temperature (Kelvin → Celsius): Ideal 18–24°C
 * Penalty: 3.5 points per °C outside ideal range
 */
function scoreTemperature(tempKelvin) {
  const tempC = tempKelvin - 273.15;
  return scoreFromIdealRange(tempC, 18, 24, 3.5);
}

/**
 * Humidity (%): Ideal 40–60%
 * Penalty: 2.5 points per % outside ideal range
 */
function scoreHumidity(humidity) {
  return scoreFromIdealRange(humidity, 40, 60, 2.5);
}

/**
 * Wind Speed (m/s): Ideal 1–5 m/s
 * < 1 m/s is stagnant (score: 60), > 5 m/s: -10 per m/s
 */
function scoreWindSpeed(windSpeed) {
  if (windSpeed >= 1 && windSpeed <= 5) return 100;
  if (windSpeed < 1) return 60;
  return scoreFromIdealRange(windSpeed, 1, 5, 10);
}

/**
 * Cloudiness (%): Ideal 20–40%
 * Penalty: 0.8 points per % outside ideal range
 */
function scoreCloudiness(cloudiness) {
  return scoreFromIdealRange(cloudiness, 20, 40, 0.8);
}

/**
 * Visibility (m): 0–10000m, fully linear.
 * 10000m = 100 points, 0m = 0 points
 */
function scoreVisibility(visibility) {
  return normalize(visibility, 0, 10000);
}

// ── Main Exported Function ────────────────────────────────────

/**
 * Computes the Comfort Index for a single city's weather data.
 *
 * @param {Object} weatherData - Raw OWM API response
 * @returns {Object} { score, breakdown, inputs }
 */
function computeComfortIndex(weatherData) {
  const tempKelvin = weatherData.main.temp;
  const humidity   = weatherData.main.humidity;
  const windSpeed  = weatherData.wind.speed;
  const cloudiness = weatherData.clouds.all;
  const visibility = weatherData.visibility ?? 10000;

  const scores = {
    temperature: Math.round(scoreTemperature(tempKelvin) * 10) / 10,
    humidity:    Math.round(scoreHumidity(humidity) * 10) / 10,
    wind:        Math.round(scoreWindSpeed(windSpeed) * 10) / 10,
    cloudiness:  Math.round(scoreCloudiness(cloudiness) * 10) / 10,
    visibility:  Math.round(scoreVisibility(visibility) * 10) / 10,
  };

  const weights = {
    temperature: 0.35,
    humidity:    0.25,
    wind:        0.20,
    cloudiness:  0.10,
    visibility:  0.10,
  };

  const rawScore =
    scores.temperature * weights.temperature +
    scores.humidity    * weights.humidity    +
    scores.wind        * weights.wind        +
    scores.cloudiness  * weights.cloudiness  +
    scores.visibility  * weights.visibility;

  return {
    score: Math.round(rawScore * 10) / 10,
    breakdown: scores,
    weights,
    inputs: {
      tempCelsius:  Math.round((tempKelvin - 273.15) * 10) / 10,
      tempKelvin,
      humidity,
      windSpeed,
      cloudiness,
      visibility,
    },
  };
}

module.exports = { computeComfortIndex };
