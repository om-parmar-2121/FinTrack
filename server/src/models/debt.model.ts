import mongoose, { Document, Schema } from "mongoose";

export interface IDebt extends Document {
  userId: mongoose.Types.ObjectId;
  type: "borrowed" | "lent";
  personName: string;
  amount: number;
  note?: string;
  deadline: Date;
  status: "pending" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

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

  note: {
    type: String,
  },

  deadline: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

}, { timestamps: true });

export default mongoose.model<IDebt>("Debt", debtSchema);