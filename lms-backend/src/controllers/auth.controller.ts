import { Request, Response } from "express";
import { auth } from "../lib/auth.js";

// GET /api/auth/session - Get current session
export async function getSession(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    if (!session) {
      return res.status(401).json({
        status: "error",
        message: "Not authenticated",
        data: null,
      });
    }

    res.json({
      status: "success",
      message: "Session retrieved",
      data: session,
    });
  } catch (error) {
    console.error("Session error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get session",
    });
  }
}
