import { mongo } from "mongoose";
import Debt from "../models/debt.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const addDebt = asyncHandler(async (
	req: Request,
	res: Response
) => {
	const { type, personName, amount, deadline, note } = req.body;

	const debt = await Debt.create({
		userId: new mongoose.Types.ObjectId(req.user?._id),
		type,
		personName,
		amount,
		deadline,
		note,
	});

	res.status(201).json({
		success: true,
		message: "Debt added",
		data: debt,
	});
});

export const getDebts = asyncHandler(async (
  req: Request,
  res: Response
) => {
	const { type, status, due } = req.query;

	const filter: any = { userId: new mongoose.Types.ObjectId(req.user?._id)};

	if (type) filter.type = type;
	if (status) filter.status = status;

	if (due === "overdue") {
		filter.deadline = { $lt: new Date() };
		filter.status = "pending";
	}

	if (due === "soon") {
		const now = new Date();
		const soon = new Date();
		soon.setDate(soon.getDate() + 7);
		filter.deadline = { $gte: now, $lte: soon };
		filter.status = "pending";
	}

	const debts = await Debt.find(filter).sort({ deadline: 1, createdAt: -1 });

	res.status(200).json({
		success: true,
		data: debts,
	});
});

export const markDebtAsPaid = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
	const debt = await Debt.findOneAndUpdate(
		{ _id: req.params.id, userId: new mongoose.Types.ObjectId(req.user?._id) },
		{ status: "paid" },
		{ new: true },
	);

	if (!debt) {
		return next(new errorHandler("Debt not found", 404));
	}

	res.status(200).json({
		success: true,
		message: "Debt marked as paid",
		data: debt,
	});
});

export const deleteDebt = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
	const debt = await Debt.findOneAndDelete({
		_id: req.params.id,
		userId: new mongoose.Types.ObjectId(req.user?._id),
	});

	if (!debt) {
		return next(new errorHandler("Debt not found", 404));
	}

	res.status(200).json({
		success: true,
		message: "Debt deleted",
	});
});
