import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { errorHandler } from "../utils/errorHandler.utils.js";

export const validate = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(
      new errorHandler(
        result.error.errors.map(e => e.message).join(", "),
        400
      )
    );
  }

  req.body = result.data;
  next();
};

export const validateQuery = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return next(
      new errorHandler(
        result.error.errors.map(e => e.message).join(", "),
        400
      )
    );
  }
  next();
};