import { Router } from "express";
import * as courseController from "../controllers/course.controller.js";
import { requireUser } from "../middleware/requireUser.js";

const router = Router();

// Public routes
router.get("/", courseController.getAllCourses);
router.get("/:slug", courseController.getCourse);

// Protected routes (require auth + enrollment)
router.get("/:slug/sidebar", requireUser, courseController.getCourseSidebar);

export default router;
