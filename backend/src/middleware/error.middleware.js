/**
 * Global Error Handler Middleware
 *
 * Catches all errors thrown by route handlers.
 * Returns consistent error response format.
 */
function errorMiddleware(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Auth0 JWT errors
  if (err.status === 401 || err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing token',
    });
  }

  // Axios / OWM API errors
  if (err.isAxiosError) {
    const status = err.response?.status || 502;
    return res.status(status).json({
      success: false,
      error: 'Failed to fetch weather data from OpenWeatherMap',
      details: err.response?.data?.message || err.message,
    });
  }

  // Generic fallback
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

module.exports = errorMiddleware;
