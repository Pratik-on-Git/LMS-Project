import { Router, type IRouter } from "express";
import * as enrollmentController from "../controllers/enrollment.controller.js";
import { requireUser } from "../middleware/requireUser.js";

const router: IRouter = Router();

// All enrollment routes require authentication
router.get("/", requireUser, enrollmentController.getEnrolledCourses);
router.get("/check/:courseId", requireUser, enrollmentController.checkEnrollment);

export default router;
