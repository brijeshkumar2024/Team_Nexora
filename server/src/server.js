import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { getEmailStatus, verifyEmailConnection } from "./services/emailService.js";

const start = async () => {
  try {
    await connectDB(env.mongoUri);
    const emailStatus = getEmailStatus();
    if (!emailStatus.configured) {
      logger.warn("Email provider is not fully configured. Contact emails will fail.", {
        provider: emailStatus.provider,
        missing: emailStatus.missing
      });
    } else {
      const emailVerification = await verifyEmailConnection();
      if (emailVerification.ok) {
        logger.info("Email provider connection verified", {
          provider: emailVerification.provider
        });
      } else {
        logger.error("Email provider verification failed", {
          provider: emailVerification.provider || emailStatus.provider,
          reason: emailVerification.reason,
          code: emailVerification.code,
          response: emailVerification.response,
          error: emailVerification.message
        });
      }
    }

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
