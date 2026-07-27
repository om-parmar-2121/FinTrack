import mongoose from "mongoose";
import Debt from "../models/debt.model.js";
import Transaction from "../models/transaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import { NextFunction, Request, Response } from "express";

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
		paidAmount: 0,
		status: "pending",
		payments: [],
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

export const logPayment = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
	const { amount, note } = req.body;

	if (!amount || amount <= 0) {
		return next(new errorHandler("Payment amount must be greater than 0", 400));
	}

	const debt = await Debt.findOne({
		_id: req.params.id,
		userId: new mongoose.Types.ObjectId(req.user?._id),
	});

	if (!debt) {
		return next(new errorHandler("Debt not found", 404));
	}

	if (debt.status === "paid") {
		return next(new errorHandler("This debt is already fully paid", 400));
	}

	const remaining = debt.amount - debt.paidAmount;
	const paymentAmount = Math.min(amount, remaining);

	// Add payment record to the payments array
	debt.payments.push({
		amount: paymentAmount,
		note: note || "",
		date: new Date(),
	});

	debt.paidAmount += paymentAmount;

	// Update status based on paid amount
	if (debt.paidAmount >= debt.amount) {
		debt.status = "paid";
		debt.paidAmount = debt.amount; // Cap at total
	} else {
		debt.status = "partial";
	}

	await debt.save();

	// Create a linked transaction for cash flow accuracy
	// borrowed -> paying EMI is an "expense" for the user
	// lent -> receiving repayment is "income" for the user
	try {
		await Transaction.create({
			userId: new mongoose.Types.ObjectId(req.user?._id),
			type: debt.type === "borrowed" ? "expense" : "income",
			amount: paymentAmount,
			category: debt.type === "borrowed" ? "bills" : "other",
			note: note
				? `[Debt: ${debt.personName}] ${note}`
				: `[Debt repayment: ${debt.personName}]`,
			date: new Date(),
		});
	} catch (txErr) {
		// Non-fatal: payment is saved even if transaction linking fails
		console.error("Failed to create linked transaction:", txErr);
	}

	res.status(200).json({
		success: true,
		message: "Payment logged successfully",
		data: debt,
	});
});

export const markDebtAsPaid = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
	const debt = await Debt.findOneAndUpdate(
		{ _id: req.params.id, userId: new mongoose.Types.ObjectId(req.user?._id) },
		{ status: "paid", paidAmount: undefined }, // Will be set below
		{ new: true },
	);

	if (!debt) {
		return next(new errorHandler("Debt not found", 404));
	}

	// Mark as fully paid
	debt.paidAmount = debt.amount;
	debt.status = "paid";
	await debt.save();

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
