import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/requireUser.js";
import * as enrollmentService from "../services/enrollment.service.js";

// GET /api/enrollments - Get user's enrolled courses
export async function getEnrolledCourses(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user!.id;
    const courses = await enrollmentService.getEnrolledCourses(userId);

    res.json({
      status: "success",
      message: "Enrolled courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch enrolled courses",
    });
  }
}

// GET /api/enrollments/check/:courseId - Check if user is enrolled
export async function checkEnrollment(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const courseId = req.params.courseId as string;
    const userId = req.user!.id;

    const isEnrolled = await enrollmentService.checkIfCourseBought(
      courseId,
      userId
    );

    res.json({
      status: "success",
      message: "Enrollment status checked",
      data: { isEnrolled },
    });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to check enrollment status",
    });
  }
}
