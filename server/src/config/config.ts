import "dotenv/config";

const normalizeOrigin = (url: string) => (url || "").replace(/\/+$/, "");

const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URL: process.env.MONGODB_URL,
  COOKIE_EXPIRES: process.env.COOKIE_EXPIRES || 7,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES || "7d",
  CLIENT_URL: normalizeOrigin(
    process.env.CLIENT_URL || "http://localhost:5173",
  ),
  // Mailjet credentials for OTP email delivery
  MAILJET_API_KEY: process.env.MAILJET_API_KEY,
  MAILJET_SECRET_KEY: process.env.MAILJET_SECRET_KEY,
  MAILJET_SENDER_EMAIL: process.env.MAILJET_SENDER_EMAIL,
};

if (!config.MONGODB_URL) {
  throw new Error("MONGODB_URL missing in .env");
}

if (!config.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in .env");
}

if (!config.MAILJET_API_KEY) {
  throw new Error("MAILJET_API_KEY missing in .env");
}

if (!config.MAILJET_SECRET_KEY) {
  throw new Error("MAILJET_SECRET_KEY missing in .env");
}

if (!config.MAILJET_SENDER_EMAIL) {
  throw new Error("MAILJET_SENDER_EMAIL missing in .env");
}

export default config;