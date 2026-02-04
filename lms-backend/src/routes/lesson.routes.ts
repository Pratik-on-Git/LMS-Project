import { Router } from "express";
import * as lessonController from "../controllers/lesson.controller.js";
import { requireUser } from "../middleware/requireUser.js";

const router = Router();

// All lesson routes require authentication
router.get("/:lessonId", requireUser, lessonController.getLessonContent);
router.post("/:lessonId/complete", requireUser, lessonController.markLessonComplete);

export default router;
