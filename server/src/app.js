import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { xss } from "express-xss-sanitizer";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 250,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(limiter);

if (env.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    environment: env.nodeEnv
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    environment: env.nodeEnv
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
