import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { getSmtpStatus, verifySmtpConnection } from "./services/emailService.js";

const start = async () => {
  try {
    await connectDB(env.mongoUri);
    const smtpStatus = getSmtpStatus();
    if (!smtpStatus.configured) {
      logger.warn("SMTP is not fully configured. Contact emails will fail.", {
        missing: smtpStatus.missing
      });
    } else {
      const smtpVerification = await verifySmtpConnection();
      if (smtpVerification.ok) {
        logger.info("SMTP connection verified");
      } else {
        logger.error("SMTP verification failed", {
          reason: smtpVerification.reason,
          code: smtpVerification.code,
          response: smtpVerification.response,
          error: smtpVerification.message
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
