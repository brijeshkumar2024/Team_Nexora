import mongoose from "mongoose";
import { logger } from "./logger.js";

export const connectDB = async (mongoUri) => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    throw error;
  }
};
