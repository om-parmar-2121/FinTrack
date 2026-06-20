import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/config.js";
import User, { UserS } from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.utils.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserS;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new errorHandler("Not authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new errorHandler("User not found", 404));
    }

    if (!user.verified) {
      return next(new errorHandler("Please verify your email first", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new errorHandler("Invalid token", 401));
  }
};