import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const required = ["MONGO_URI", "JWT_SECRET"];
const normalizeOrigin = (value) => value.trim().replace(/\/+$/, "");
const readEnv = (key, fallback = "") => {
  const value = process.env[key];
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
};
const readNumber = (key, fallback) => {
  const raw = readEnv(key, "");
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? fallback : parsed;
};
const readBoolean = (key, fallback = false) => {
  const raw = readEnv(key, "").toLowerCase();
  if (["true", "1", "yes"].includes(raw)) return true;
  if (["false", "0", "no"].includes(raw)) return false;
  return fallback;
};

required.forEach((key) => {
  if (!readEnv(key)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: readEnv("NODE_ENV", "development"),
  port: readNumber("PORT", 5000),
  mongoUri: readEnv("MONGO_URI"),
  clientUrl: normalizeOrigin(readEnv("CLIENT_URL", "http://localhost:5173")),
  jwtSecret: readEnv("JWT_SECRET"),
  jwtExpiresIn: readEnv("JWT_EXPIRES_IN", "7d"),
  adminEmail: readEnv("ADMIN_EMAIL"),
  adminPassword: readEnv("ADMIN_PASSWORD"),
  smtpHost: readEnv("SMTP_HOST"),
  smtpPort: readNumber("SMTP_PORT", 587),
  smtpSecure: readBoolean("SMTP_SECURE", false),
  smtpUser: readEnv("SMTP_USER"),
  smtpPass: readEnv("SMTP_PASS"),
  resendApiKey: readEnv("RESEND_API_KEY"),
  resendApiBaseUrl: readEnv("RESEND_API_BASE_URL", "https://api.resend.com"),
  mailFromName: readEnv("MAIL_FROM_NAME", "Team Nexora"),
  mailFromEmail: readEnv("MAIL_FROM_EMAIL"),
  contactReceiverEmail: readEnv("CONTACT_RECEIVER_EMAIL", "ceo.nexora2025@gmail.com")
};
