import mongoose, { Document, Schema } from "mongoose";

export interface UserS extends Document {
  name: string;
  email: string;
  password: string;
  monthlyBudget: number;
  savingGoal: number;
  verified: boolean;
}

const userSchema = new Schema<UserS>({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  monthlyBudget: {
    type: Number,
    default: 0,
  },

  savingGoal: {
    type: Number,
    default: 0,
  },

  verified: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

export default mongoose.model<UserS>("User", userSchema);