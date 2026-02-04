import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    status,
    message,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
}
