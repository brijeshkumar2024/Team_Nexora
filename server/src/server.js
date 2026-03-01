import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const start = async () => {
  try {
    await connectDB(env.mongoUri);
    const server = app.listen(env.port, () => {
      logger.info(`Nexora API listening on port ${env.port}`);
    });

    process.on("unhandledRejection", (error) => {
      logger.error("Unhandled promise rejection", { error: error?.message || error });
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught exception", { error: error?.message || error });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

start();
