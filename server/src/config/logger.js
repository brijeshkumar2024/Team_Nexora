import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";

const logsDir = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf((info) => {
    const { level, message, timestamp, stack, ...meta } = info;
    const metaText = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level}: ${stack || message}${metaText}`;
  })
);

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  defaultMeta: { service: "nexora-api" },
  transports: [
    new transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error"
    }),
    new transports.File({
      filename: path.join(logsDir, "combined.log")
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: consoleFormat
    })
  );
}
