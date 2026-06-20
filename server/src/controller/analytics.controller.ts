import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import mongoose from "mongoose";
import { Request, Response, NextFunction} from "express";

export const getSummary = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id
  if(!userId) return next(new errorHandler("Unauthorized", 401))
  const result = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
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

  const balance = totalIncome - totalExpense;

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance,
    },
  });
});

export const getCategory = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const result = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(String(userId)),
        type: "expense",
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        amount: "$total",
      },
    },
    {
      $sort: { amount: -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMonthlyData = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const year = req.query.year as unknown as number;

  const result = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(String(userId)),
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = months.map((month, index) => ({
    month,
    income: 0,
    expense: 0,
  }));

  result.forEach((item) => {
    const monthIndex = item._id.month - 1;
    const type = item._id.type;

    (data as any)[monthIndex][type] = item.total;
  });

  res.status(200).json({
    success: true,
    data,
  });
});

export const getInsights = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const highestExpense = await Transaction.findOne({
    userId: new mongoose.Types.ObjectId(String(userId)),
    type: "expense",
  }).sort({ amount: -1 });

  const monthlyExpense = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(String(userId)),
        type: "expense",
        date: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const weeklyExpense = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(String(userId)),
        type: "expense",
        date: { $gte: startOfWeek },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      highestExpense,
      monthlyExpense: monthlyExpense[0]?.total || 0,
      weeklyExpense: weeklyExpense[0]?.total || 0,
    },
  });
});

export const getAlerts = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) return next(new errorHandler("Unauthorized", 401));

  const user = await User.findById(userId);
  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const monthlyBudget = user.monthlyBudget || 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const monthlyExpense = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(String(userId)),
        type: "expense",
        date: { $gte: startOfMonth },
      },
    },
    {
      $group: { _id: null, total: { $sum: "$amount" } },
    },
  ]);

  const totalMonthly = monthlyExpense[0]?.total || 0;

  const weeklyExpense = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(String(userId)),
        type: "expense",
        date: { $gte: startOfWeek },
      },
    },
    {
      $group: { _id: null, total: { $sum: "$amount" } },
    },
  ]);

  const totalWeekly = weeklyExpense[0]?.total || 0;

  const alerts = [];

  // Monthly alert
  if (monthlyBudget && totalMonthly > monthlyBudget) {
    alerts.push({
      type: "monthly",
      message: `You exceeded your monthly budget by ₹${totalMonthly - monthlyBudget}`,
    });
  }

  if (monthlyBudget) {
    const weeklyBudget = monthlyBudget / 4;

    if (totalWeekly > weeklyBudget) {
      alerts.push({
        type: "weekly",
        message: "You are overspending this week",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: alerts,
  });
});