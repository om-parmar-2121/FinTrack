import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validate, validateQuery } from "../middleware/validate.middleware.js";
import { dateRangeSchema } from "../validators/analytics.validator.js";
import { transactionSchema } from "../validators/transaction.validator.js";

import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../controller/transaction.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, validate(transactionSchema), addTransaction);
router.get("/", isAuthenticated, validateQuery(dateRangeSchema.partial()), getTransactions);
router.put("/:id", isAuthenticated, validate(transactionSchema), updateTransaction);
router.delete("/:id", isAuthenticated, deleteTransaction);

export default router;