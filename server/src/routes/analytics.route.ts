import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validateQuery } from "../middleware/validate.middleware.js";
import { monthlySchema } from "../validators/analytics.validator.js";
import {
  getAlerts,
  getCategory,
  getInsights,
  getMonthlyData,
  getSummary,
} from "../controller/analytics.controller.js";

const router = express.Router();
router.get("/summary", isAuthenticated, getSummary);
router.get("/categories", isAuthenticated, getCategory);
router.get("/monthly", isAuthenticated, validateQuery(monthlySchema), getMonthlyData);
router.get("/insights", isAuthenticated, getInsights);
router.get("/alerts", isAuthenticated, getAlerts);

export default router;