import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

// Better Auth handles all /api/auth/* routes
router.all("/*", toNodeHandler(auth));

// Custom session endpoint
router.get("/session", authController.getSession);

export default router;
