const { auth } = require('express-oauth2-jwt-bearer');
const config = require('../config/env');

/**
 * Auth0 JWT Validation Middleware
 *
 * Validates the Bearer token on every protected route.
 * - Checks token signature (RS256)
 * - Validates audience matches our API identifier
 * - Validates issuer matches our Auth0 tenant
 *
 * If invalid → 401 Unauthorized
 * If valid   → calls next()
 */
const checkJwt = auth({
  audience: config.auth0.audience,
  issuerBaseURL: config.auth0.issuerBaseUrl,
  tokenSigningAlg: 'RS256',
});

module.exports = checkJwt;
