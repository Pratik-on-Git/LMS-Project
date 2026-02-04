import { Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { AuthenticatedRequest } from "./requireUser.js";

export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    if (!session) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized. Please log in.",
      });
    }

    if (session.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Forbidden. Admin access required.",
      });
    }

    req.user = session.user as AuthenticatedRequest["user"];
    req.session = session.session as AuthenticatedRequest["session"];
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(401).json({
      status: "error",
      message: "Authentication failed.",
    });
  }
}
