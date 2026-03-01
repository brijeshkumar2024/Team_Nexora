export const sendSuccess = (res, { statusCode = 200, message = "OK", data = null, meta = null } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
};

export const sendError = (res, { statusCode = 500, message = "Internal server error", errors = null } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
