import { Request, Response, NextFunction } from "express";
import arcjet, { fixedWindow } from "../config/arcjet.js";

export function createRateLimiter(options?: { window?: string; max?: number }) {
  const window = options?.window || "1m";
  const max = options?.max || 10;

  const aj = arcjet.withRule(
    fixedWindow({
      mode: "LIVE",
      window: window as "1m" | "10m" | "1h",
      max,
    })
  );

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fingerprint =
        req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";

      const decision = await aj.protect(req, {
        fingerprint,
      });

      if (decision.isDenied()) {
        return res.status(429).json({
          status: "error",
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (error) {
      console.error("Rate limit error:", error);
      // Allow request to proceed if rate limiting fails
      next();
    }
  };
}
