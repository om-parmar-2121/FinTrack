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
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER,
};

if (!config.MONGODB_URL) {
  throw new Error("MONGODB_URL missing in .env");
}

if (!config.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in .env");
}

if (!config.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID missing in .env");
}

if (!config.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET missing in .env");
}

if (!config.GOOGLE_REFRESH_TOKEN) {
  throw new Error("GOOGLE_REFRESH_TOKEN missing in .env");
}

if (!config.GOOGLE_USER) {
  throw new Error("GOOGLE_USER missing in .env");
}

export default config;