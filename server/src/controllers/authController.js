import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (userId, role) =>
  jwt.sign(
    {
      sub: userId,
      role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken(user._id, user.role);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    message: "Current user fetched",
    data: req.user
  });
});
