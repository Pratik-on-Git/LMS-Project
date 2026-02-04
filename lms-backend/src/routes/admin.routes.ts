import { Router, type IRouter } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router: IRouter = Router();

// All admin routes require admin authentication
router.use(requireAdmin);

// Verify admin access (used by frontend middleware)
router.get("/verify", (_req, res) => {
  res.json({ status: "success", message: "Admin verified" });
});

// Dashboard stats
router.get("/dashboard/stats", adminController.getDashboardStats);
router.get("/dashboard/enrollment-stats", adminController.getEnrollmentStats);
router.get("/dashboard/recent-courses", adminController.getRecentCourses);

// Course management
router.get("/courses", adminController.getAdminCourses);
router.get("/courses/:courseId", adminController.getAdminCourse);
router.post("/courses", adminController.createCourse);
router.put("/courses/:courseId", adminController.editCourse);
router.delete("/courses/:courseId", adminController.deleteCourse);

// Chapter management
router.post("/chapters", adminController.createChapter);
router.delete("/chapters/:chapterId", adminController.deleteChapter);
router.put("/chapters/reorder", adminController.reorderChapters);

// Lesson management
router.get("/lessons", adminController.getAllAdminLessons);
router.get("/lessons/:lessonId", adminController.getAdminLesson);
router.post("/lessons", adminController.createLesson);
router.put("/lessons/:lessonId", adminController.updateLesson);
router.delete("/lessons/:lessonId", adminController.deleteLesson);
router.put("/lessons/reorder", adminController.reorderLessons);

export default router;
