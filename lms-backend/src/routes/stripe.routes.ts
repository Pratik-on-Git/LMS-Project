import { Router, type IRouter } from "express";
import * as stripeController from "../controllers/stripe.controller.js";
import { requireUser } from "../middleware/requireUser.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const router: IRouter = Router();

// Rate limiter for checkout: 5 requests per minute
const checkoutRateLimiter = createRateLimiter({ window: "1m", max: 5 });

// Checkout requires authentication and rate limiting
router.post("/checkout", checkoutRateLimiter, requireUser, stripeController.createCheckout);

// Webhook is handled separately in app.ts with raw body parser

export default router;
