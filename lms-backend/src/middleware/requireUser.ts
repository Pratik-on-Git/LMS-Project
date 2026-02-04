import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

export async function requireUser(
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

    req.user = session.user as AuthenticatedRequest["user"];
    req.session = session.session as AuthenticatedRequest["session"];
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      status: "error",
      message: "Authentication failed.",
    });
  }
}
