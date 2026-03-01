import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
});
