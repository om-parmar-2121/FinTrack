import env from "../config/config.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import { Request, Response, NextFunction, CookieOptions } from "express";
import { sendEmail } from "../services/email.service.js";
import otpModel from "../models/otp.model.js";
import { generateOTP, getOtpHtml } from "../utils/utils.js";
import crypto from "crypto";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: Number(env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
};

export const signup = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, monthlyBudget, savingGoal } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return next(new errorHandler("User already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    monthlyBudget,
    savingGoal,
  });

  const otpCode = generateOTP();
  const html = getOtpHtml(otpCode);

  const otpHash = crypto.createHash("sha256").update(otpCode).digest("hex");

  // Clean up any older OTPs for this email first
  await otpModel.deleteMany({ email: user.email.toLowerCase() });

  await otpModel.create({
    user: user._id,
    email: user.email.toLowerCase(),
    otp_hash: otpHash,
    otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendEmail(user.email, "Verify your email - FinTrack", "Your OTP code is: " + otpCode, html);

  res.status(201).clearCookie("token", cookieOptions).json({
    success: true,
    message: "OTP sent to your email. Please verify to complete registration.",
    data: {
      requireVerification: true,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return next(new errorHandler("Invalid credentials", 400));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new errorHandler("Invalid credentials", 400));

  // Generate OTP for login
  const otpCode = generateOTP();
  const html = getOtpHtml(otpCode);
  const otpHash = crypto.createHash("sha256").update(otpCode).digest("hex");

  // Clean up any older OTPs for this email first
  await otpModel.deleteMany({ email: user.email.toLowerCase() });

  await otpModel.create({
    user: user._id,
    email: user.email.toLowerCase(),
    otp_hash: otpHash,
    otp_expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes validity
  });

  await sendEmail(user.email, "Verify your email - FinTrack", "Your OTP code is: " + otpCode, html);

  res.status(200).clearCookie("token", cookieOptions).json({
    success: true,
    message: "OTP sent to your email. Please verify to login.",
    data: {
      requireVerification: true,
      email: user.email,
    },
  });
});

export const logout = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json({
      success: true,
      message: "Logout successful",
    });
});

export const getMe = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) return next(new errorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { savingGoal, monthlyBudget } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) return next(new errorHandler("User not found", 404));

  if (savingGoal !== undefined) user.savingGoal = savingGoal;
  if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;

  await user.save();

  const safeUser = user.toObject() as any;
  delete safeUser.password;

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: safeUser,
  });
});

export const verifyOtp = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new errorHandler("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const otpRecord = await otpModel.findOne({ email: email.toLowerCase() });
  if (!otpRecord) {
    return next(new errorHandler("Invalid or expired OTP", 400));
  }

  if (new Date() > otpRecord.otp_expires_at) {
    await otpModel.deleteMany({ email: email.toLowerCase() });
    return next(new errorHandler("OTP has expired. Please request a new one.", 400));
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== otpRecord.otp_hash) {
    return next(new errorHandler("Invalid OTP code", 400));
  }

  user.verified = true;
  await user.save();

  // Delete all active OTPs for this email
  await otpModel.deleteMany({ email: email.toLowerCase() });

  const token = generateToken(user._id);
  const safeUser = user.toObject() as any;
  delete safeUser.password;

  res.cookie("token", token, cookieOptions).status(200).json({
    success: true,
    message: "Verification successful",
    data: { user: safeUser, token },
  });
});

export const auth0Login = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, name, auth0Id } = req.body;

  if (!email || !auth0Id) {
    return next(new errorHandler("Email and Auth0 ID are required", 400));
  }

  // Find or create user
  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Generate a secure random password since they login via Auth0/Google
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verified: true, // Google already verified their email
    });
  } else {
    // Ensure existing user is marked verified
    if (!user.verified) {
      user.verified = true;
      await user.save();
    }
  }

  const token = generateToken(user._id);
  const safeUser = user.toObject() as any;
  delete safeUser.password;

  res.cookie("token", token, cookieOptions).status(200).json({
    success: true,
    message: "Auth0 login successful",
    data: { user: safeUser, token },
  });
});