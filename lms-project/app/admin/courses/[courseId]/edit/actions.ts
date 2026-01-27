"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseFormData, mapFormToPrisma } from "@/lib/zodSchemas";
import { adminGetCourse } from "@/app/data/admin/admin-get-course";

export async function editCourse({ data, courseId }: { data: CourseFormData; courseId: string }): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
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
        level: prismaData.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        status: prismaData.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      }
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
