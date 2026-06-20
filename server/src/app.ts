import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/config.js";
import userRoutes from "./routes/user.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import debtRoutes from "./routes/debt.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app: Express = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/debts", debtRoutes);

app.use(errorMiddleware);

export default app;