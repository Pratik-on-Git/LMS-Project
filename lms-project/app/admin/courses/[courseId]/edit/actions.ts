"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseFormData, mapFormToPrisma } from "@/lib/zodSchemas";
import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import arcjet, { detectBot, fixedWindow, request } from "@arcjet/next";
import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

const aj = arcjet({
    key: env.ARCJET_KEY || "",
    characteristics: ["fingerprint"],
    rules: [
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"],
        }),
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 10,
        }),
    ],
})

export async function editCourse({ data, courseId }: { data: CourseFormData; courseId: string }): Promise<ApiResponse> {
  const user = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message: "Request blocked. If this is an error, please contact support.",
        };
      }
    }

    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    // Map UI values to Prisma enum values
    const prismaData = mapFormToPrisma(result.data);

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...prismaData,
      },
    });

    // Fetch the updated course data
    const updatedCourse = await adminGetCourse(courseId);

    return {
      status: "success",
      message: "Course updated successfully",
      data: updatedCourse,
    };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      status: "error",
      message: "An error occurred while updating the course",
    };
  }
}

export async function reorderLessons(chapterId: string, lessons: {id: string, position: number}[], courseId: string): Promise<ApiResponse> {
    await requireAdmin();
  try {
      if (!lessons || lessons.length === 0) {
        return {
          status: "error",
          message: "No lessons provided for reordering",
        };
      }

      const updates = lessons.map((lesson) => prisma.lesson.update({
        where: { id: lesson.id, chapterId: chapterId },
        data: { position: lesson.position },
      }));

      await prisma.$transaction(updates);
      revalidatePath(`/admin/courses/${courseId}/edit`);
      return ({
        status: "success",
        message: "Lessons reordered successfully",
      })

    } catch {
      return {
        status: "error",
        message: "An error occurred while reordering lessons",
      };
    }
  }

export async function reorderChapters(courseId: string, chapters:{id: string, position: number}[]): Promise<ApiResponse> {
    await requireAdmin();
  try {
      if (!chapters || chapters.length === 0) {
        return {
          status: "error",
          message: "No chapters provided for reordering",
        };
      }
      const updates = chapters.map((chapter) => prisma.chapter.update({
        where: { id: chapter.id, courseId: courseId },
        data: { position: chapter.position },
      }));

      await prisma.$transaction(updates);
      revalidatePath(`/admin/courses/${courseId}/edit`);
      return ({
        status: "success",
        message: "Chapters reordered successfully",
      })
    }catch{
      return {
        status: "error",
        message: "An error occurred while reordering chapters",
      }
    }
}

