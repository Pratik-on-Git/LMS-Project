import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/requireUser.js";
import * as courseService from "../services/course.service.js";

// GET /api/courses - Get all published courses
export async function getAllCourses(_req: AuthenticatedRequest, res: Response) {
  try {
    const courses = await courseService.getAllCourses();
    res.json({
      status: "success",
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch courses",
    });
  }
}

// GET /api/courses/:slug - Get individual course by slug
export async function getCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const slug = req.params.slug as string;
    const course = await courseService.getIndividualCourse(slug);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    res.json({
      status: "success",
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch course",
    });
  }
}

// GET /api/courses/:slug/sidebar - Get course sidebar data (requires auth + enrollment)
export async function getCourseSidebar(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const slug = req.params.slug as string;
    const userId = req.user!.id;

    const data = await courseService.getCoursesSidebarData(slug, userId);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Course not found or not enrolled",
      });
    }

    res.json({
      status: "success",
      message: "Course sidebar data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching course sidebar:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch course sidebar data",
    });
  }
}
