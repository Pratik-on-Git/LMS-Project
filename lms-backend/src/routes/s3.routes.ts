import { Router, type IRouter } from "express";
import * as s3Controller from "../controllers/s3.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const router: IRouter = Router();

// Rate limiter for S3 operations: 20 requests per minute
const s3RateLimiter = createRateLimiter({ window: "1m", max: 20 });

// All S3 routes require admin authentication and rate limiting
router.post("/upload", s3RateLimiter, requireAdmin, s3Controller.generateUploadUrl);
router.delete("/delete", s3RateLimiter, requireAdmin, s3Controller.deleteFile);

export default router;
