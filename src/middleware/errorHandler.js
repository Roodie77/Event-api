function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate key error',
    });
  }

  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: status === 500 ? 'Internal server error' : err.message,
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  return res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
