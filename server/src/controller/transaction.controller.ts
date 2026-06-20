import { Request, Response, NextFunction } from "express";
import Transaction from "../models/transaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import mongoose from "mongoose";

const getCurrentBalance = async (userId: any, excludeTransactionId?: any): Promise<number> => {
  const match: any = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (excludeTransactionId) {
    match._id = { $ne: new mongoose.Types.ObjectId(excludeTransactionId) };
  }

  const result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  result.forEach((item) => {
    if (item._id === "income") totalIncome = item.total;
    if (item._id === "expense") totalExpense = item.total;
  });

  return totalIncome - totalExpense;
};

export const addTransaction = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const { type, amount, category, note, date } = req.body;

  if (type === "expense") {
    const currentBalance = await getCurrentBalance(String(userId));

    if (amount > currentBalance) {
      return next(
        new errorHandler("Expense cannot exceed current balance", 400),
      );
    }
  }

  const transaction = await Transaction.create({
    userId: new mongoose.Types.ObjectId(String(userId)),
    type,
    amount,
    category,
    note,
    date,
  });

  res.status(201).json({
    success: true,
    message: "Transaction added",
    data: transaction,
  });
});

export const getTransactions = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const { type, category, startDate, endDate } = req.query;

  const filter: any = { userId: new mongoose.Types.ObjectId(String(userId)) };

  if (type) filter.type = type;
  if (category) filter.category = category;

  const start = startDate ? new Date(startDate as string) : null;
  const end = endDate ? new Date(endDate as string) : null;

  if (start || end) {
    const dateFilter: any = {};
    if (start && !isNaN(start.getTime())) {
      dateFilter.$gte = start;
    }
    if (end && !isNaN(end.getTime())) {
      dateFilter.$lte = end;
    }
    filter.date = dateFilter;
  }

  const transactions = await Transaction.find(filter).sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: transactions,
  });
});

export const updateTransaction = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const existingTransaction = await Transaction.findOne({
    _id: req.params.id,
    userId: new mongoose.Types.ObjectId(String(userId)),
  });

  if (!existingTransaction) {
    return next(new errorHandler("Transaction not found", 404));
  }

  const updatedType = req.body.type ?? existingTransaction.type;
  const updatedAmount = req.body.amount ?? existingTransaction.amount;

  if (updatedType === "expense") {
    const currentBalance = await getCurrentBalance(String(userId), req.params.id);

    if (updatedAmount > currentBalance) {
      return next(
        new errorHandler("Expense cannot exceed current balance", 400),
      );
    }
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: new mongoose.Types.ObjectId(String(userId)) },
    req.body,
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Transaction updated",
    data: transaction,
  });
});

export const deleteTransaction = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: new mongoose.Types.ObjectId(String(userId)),
  });

  if (!transaction) {
    return next(new errorHandler("Transaction not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Transaction deleted",
  });
});