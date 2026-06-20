import mongoose, { Document, Schema } from "mongoose";

export interface Trans extends Document {
  userId: mongoose.Types.ObjectId,
  type: 'income' | 'expense',
  amount: number,
  category: string,
  note?: string,
  date: Date,
}

const transactionSchema = new Schema<Trans>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: ["food", "travel", "bills", "shopping", "other", "salary"],
    required: function (this: Trans) {
      return this.type === "expense";
    },
  },

  note: {
    type: String,
  },

  date: {
    type: Date,
    required: true,
  },

}, { timestamps: true });

export default mongoose.model<Trans>("Transaction", transactionSchema);