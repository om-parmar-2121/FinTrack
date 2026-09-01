import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/config.js";
import userRoutes from "./routes/user.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import debtRoutes from "./routes/debt.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import cron from "node-cron";
import otpModel from "./models/otp.model.js";

const app: Express = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/ping", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/debts", debtRoutes);

app.get("/ping", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Clean up expired OTPs every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    const result = await otpModel.deleteMany({ otp_expires_at: { $lt: new Date() } });
    if (result.deletedCount > 0) {
      console.log(`[Cron] Cleaned up ${result.deletedCount} expired OTPs`);
    }
  } catch (error) {
    console.error("[Cron] Failed to clean up expired OTPs:", error);
  }
});

app.use(errorMiddleware);

export default app;