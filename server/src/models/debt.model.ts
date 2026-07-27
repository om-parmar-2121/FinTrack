import mongoose, { Document, Schema } from "mongoose";

export interface IPayment {
  amount: number;
  note?: string;
  date: Date;
}

export interface IDebt extends Document {
  userId: mongoose.Types.ObjectId;
  type: "borrowed" | "lent";
  personName: string;
  amount: number;
  paidAmount: number;
  note?: string;
  deadline: Date;
  status: "pending" | "partial" | "paid";
  payments: IPayment[];
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
}, { _id: true });

const debtSchema = new Schema<IDebt>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["borrowed", "lent"],
    required: true,
  },

  personName: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  paidAmount: {
    type: Number,
    default: 0,
  },

  note: {
    type: String,
  },

  deadline: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },

  payments: {
    type: [paymentSchema],
    default: [],
  },

}, { timestamps: true });

export default mongoose.model<IDebt>("Debt", debtSchema);