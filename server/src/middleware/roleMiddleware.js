import { AppError } from "../utils/appError.js";

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError("Forbidden", 403);
  }
  next();
};
