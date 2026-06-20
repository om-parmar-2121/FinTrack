import { Request, Response, NextFunction } from "express";

export const asyncHandler = (func: (req: Request, res: Response, next: NextFunction) => any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(func(req, res, next)).catch((err) => next(err));
};