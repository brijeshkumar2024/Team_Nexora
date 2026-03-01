import { sendError } from "../utils/apiResponse.js";
import { logger } from "../config/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    logger.error("Request failed", {
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message,
      stack: err.stack
    });
  } else {
    logger.warn("Request validation/authorization error", {
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message
    });
  }

  return sendError(res, {
    statusCode,
    message,
    errors: err.errors || (process.env.NODE_ENV === "production" ? null : err.stack)
  });
};
