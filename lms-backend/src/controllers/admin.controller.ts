import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/requireUser.js";
import * as adminService from "../services/admin.service.js";

// GET /api/admin/courses - Get all courses for admin
export async function getAdminCourses(
  _req: AuthenticatedRequest,
  res: Response
) {
  try {
    const courses = await adminService.adminGetCourses();
    res.json({
      status: "success",
      message: "Admin courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch admin courses",
    });
  }
}

// GET /api/admin/courses/:courseId - Get single course for admin
export async function getAdminCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const course = await adminService.adminGetCourse(courseId);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    res.json({
      status: "success",
      message: "Admin course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching admin course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch admin course",
    });
  }
}

// POST /api/admin/courses - Create course
export async function createCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const result = await adminService.createCourse(req.body, userId);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create course",
    });
  }
}

// PUT /api/admin/courses/:courseId - Edit course
export async function editCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const userId = req.user!.id;
    const result = await adminService.editCourse(req.body, courseId, userId);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error editing course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to edit course",
    });
  }
}

// DELETE /api/admin/courses/:courseId - Delete course
export async function deleteCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const courseId = req.params.courseId as string;
    const result = await adminService.deleteCourse(courseId);

    res.json(result);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete course",
    });
  }
}

// GET /api/admin/lessons/:lessonId - Get lesson for admin
export async function getAdminLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const lesson = await adminService.adminGetLesson(lessonId);

    if (!lesson) {
      return res.status(404).json({
        status: "error",
        message: "Lesson not found",
      });
    }

    res.json({
      status: "success",
      message: "Admin lesson fetched successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Error fetching admin lesson:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch admin lesson",
    });
  }
}

// GET /api/admin/lessons - Get all lessons for admin stats
export async function getAllAdminLessons(
  _req: AuthenticatedRequest,
  res: Response
) {
  try {
    const lessons = await adminService.adminGetAllLessons();
    res.json({
      status: "success",
      message: "Admin lessons fetched successfully",
      data: lessons,
    });
  } catch (error) {
    console.error("Error fetching admin lessons:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch admin lessons",
    });
  }
}

// GET /api/admin/dashboard/stats - Get dashboard stats
export async function getDashboardStats(
  _req: AuthenticatedRequest,
  res: Response
) {
  try {
    const stats = await adminService.adminGetDashboardStats();
    res.json({
      status: "success",
      message: "Dashboard stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard stats",
    });
  }
}

// GET /api/admin/dashboard/enrollment-stats - Get enrollment stats
export async function getEnrollmentStats(
  _req: AuthenticatedRequest,
  res: Response
) {
  try {
    const stats = await adminService.adminGetEnrollmentStats();
    res.json({
      status: "success",
      message: "Enrollment stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching enrollment stats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch enrollment stats",
    });
  }
}

// GET /api/admin/dashboard/recent-courses - Get recent courses
export async function getRecentCourses(
  _req: AuthenticatedRequest,
  res: Response
) {
  try {
    const courses = await adminService.adminGetRecentCourses();
    res.json({
      status: "success",
      message: "Recent courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching recent courses:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recent courses",
    });
  }
}

// POST /api/admin/chapters - Create chapter
export async function createChapter(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await adminService.createChapter(req.body);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create chapter",
    });
  }
}

// DELETE /api/admin/chapters/:chapterId - Delete chapter
export async function deleteChapter(req: AuthenticatedRequest, res: Response) {
  try {
    const chapterId = req.params.chapterId as string;
    const { courseId } = req.body;
    const result = await adminService.deleteChapter(chapterId, courseId);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete chapter",
    });
  }
}

// PUT /api/admin/chapters/reorder - Reorder chapters
export async function reorderChapters(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { courseId, chapters } = req.body;
    const result = await adminService.reorderChapters(courseId, chapters);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error reordering chapters:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to reorder chapters",
    });
  }
}

// POST /api/admin/lessons - Create lesson
export async function createLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await adminService.createLesson(req.body);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create lesson",
    });
  }
}

// PUT /api/admin/lessons/:lessonId - Update lesson
export async function updateLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const result = await adminService.updateLesson(req.body, lessonId);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update lesson",
    });
  }
}

// DELETE /api/admin/lessons/:lessonId - Delete lesson
export async function deleteLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const { chapterId } = req.body;
    const result = await adminService.deleteLesson(lessonId, chapterId);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete lesson",
    });
  }
}

// PUT /api/admin/lessons/reorder - Reorder lessons
export async function reorderLessons(req: AuthenticatedRequest, res: Response) {
  try {
    const { chapterId, lessons } = req.body;
    const result = await adminService.reorderLessons(chapterId, lessons);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error reordering lessons:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to reorder lessons",
    });
  }
}
