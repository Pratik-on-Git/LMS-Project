"use server";
import { ApiResponse } from "@/lib/types";
import { courseSchemaType, courseSchema, mapFormToPrisma } from "@/lib/zodSchemas";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function CreateCourse(
  values: courseSchemaType,
): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    // Map UI values to Prisma enum values
    const prismaData = mapFormToPrisma(validation.data);

    await prisma.course.create({
      data: {
        ...prismaData,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
      data: validation.data,
    };
  } catch (error) {
    console.log(error)
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
