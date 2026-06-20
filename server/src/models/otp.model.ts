import mongoose, { Document, Schema } from "mongoose";

export interface otpModel extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  otp_hash: string;
  otp_expires_at: Date;
}

const otpSchema = new Schema<otpModel>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  otp_hash: {
    type: String,
    required: true,
  },

  otp_expires_at: {
    type: Date,
    required: true,
  },

}, { timestamps: true });

export default mongoose.model<otpModel>("Otp", otpSchema);