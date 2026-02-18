const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/auth.middleware');
const { getWeatherData } = require('../controllers/weather.controller');

/**
 * GET /api/weather
 * Protected: Requires valid Auth0 JWT Bearer token.
 * Returns ranked list of cities with Comfort Index scores.
 */
router.get('/', checkJwt, getWeatherData);

module.exports = router;
