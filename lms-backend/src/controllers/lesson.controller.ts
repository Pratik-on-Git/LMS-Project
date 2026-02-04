import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/requireUser.js";
import * as lessonService from "../services/lesson.service.js";

// GET /api/lessons/:lessonId - Get lesson content
export async function getLessonContent(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const lessonId = req.params.lessonId as string;
    const userId = req.user!.id;

    const lesson = await lessonService.getLessonContent(lessonId, userId);

    if (!lesson) {
      return res.status(404).json({
        status: "error",
        message: "Lesson not found or not enrolled",
      });
    }

    res.json({
      status: "success",
      message: "Lesson content fetched successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Error fetching lesson content:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch lesson content",
    });
  }
}

// POST /api/lessons/:lessonId/complete - Mark lesson as complete
export async function markLessonComplete(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const lessonId = req.params.lessonId as string;
    const userId = req.user!.id;

    await lessonService.markLessonComplete(lessonId, userId);

    res.json({
      status: "success",
      message: "Lesson marked as complete",
    });
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to mark lesson as complete",
    });
  }
}
