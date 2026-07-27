import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addDebt,
  deleteDebt,
  getDebts,
  logPayment,
  markDebtAsPaid,
} from "../controller/debt.controller.js";
import { debtSchema } from "../validators/debt.validator.js";

const router = express.Router();

router.post("/", isAuthenticated, validate(debtSchema), addDebt);
router.get("/", isAuthenticated, getDebts);
router.post("/:id/payments", isAuthenticated, logPayment);
router.patch("/:id/pay", isAuthenticated, markDebtAsPaid);
router.delete("/:id", isAuthenticated, deleteDebt);

export default router;