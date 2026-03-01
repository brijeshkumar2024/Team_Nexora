import { validationResult } from "express-validator";
import { AppError } from "../utils/appError.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError("Validation failed", 422, errors.array());
  }
  next();
};
