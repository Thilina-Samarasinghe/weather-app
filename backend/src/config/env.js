require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  owm: {
    apiKey: process.env.OWM_API_KEY,
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  },
  auth0: {
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
  },
  cache: {
    ttlSeconds: 300, // 5 minutes
  },
};

// Validate required env vars on startup
const required = ['OWM_API_KEY', 'AUTH0_AUDIENCE', 'AUTH0_ISSUER_BASE_URL'];
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

module.exports = config;
