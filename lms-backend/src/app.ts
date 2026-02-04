import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

import { env } from "./config/env.js";
import { auth } from "./lib/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// Import routes
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import s3Routes from "./routes/s3.routes.js";

// Import webhook controller
import * as stripeController from "./controllers/stripe.controller.js";

const app: Express = express();

// CORS configuration
app.use(
  cors({
    origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Cookie parser
app.use(cookieParser());

// Stripe webhook needs raw body - must be before json parser
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

// JSON parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API info
app.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "LMS Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth/*",
      courses: "/api/courses",
      lessons: "/api/lessons",
      enrollments: "/api/enrollments",
      admin: "/api/admin/*",
      stripe: "/api/stripe/*",
      s3: "/api/s3/*",
    },
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Better Auth routes - handles all /api/auth/* endpoints
app.all("/api/auth/{*splat}", toNodeHandler(auth));

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/s3", s3Routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
