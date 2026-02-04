import { prisma } from "../lib/prisma.js";
import { stripe } from "../config/stripe.js";
import { withCache } from "../lib/redis.js";
import {
  courseSchema,
  mapFormToPrisma,
  CourseFormData,
  ChapterSchemaType,
  chapterSchema,
  lessonSchema,
  LessonSchemaType,
} from "../validators/zodSchemas.js";
import { ApiResponse } from "../types/index.js";

// Get all courses for admin
export async function adminGetCourses() {
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

// Get single course for admin
export async function adminGetCourse(id: string) {
  const data = await prisma.course.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              position: true,
              videoKey: true,
            },
          },
        },
      },
    },
  });

  return data;
}

// Get lesson for admin
export async function adminGetLesson(id: string) {
  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      videoKey: true,
      description: true,
      thumbnailKey: true,
      id: true,
      position: true,
    },
  });

  return data;
}

// Get all lessons for admin stats
export async function adminGetAllLessons() {
  const lessons = await prisma.lesson.findMany({
    select: {
      id: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return lessons.map((l) => ({ id: l.id, date: l.createdAt.toISOString() }));
}

// Get dashboard stats
export async function adminGetDashboardStats() {
  return withCache(
    "admin:dashboard:stats",
    async () => {
      const [totalSignups, totalCustomers, totalCourses, totalLessons, revenueResult] =
        await Promise.all([
          prisma.user.count(),
          // Count users who have at least one COMPLETED enrollment
          prisma.user.count({
            where: {
              enrollment: {
                some: {
                  status: "Completed",
                },
              },
            },
          }),
          prisma.course.count(),
          prisma.lesson.count(),
          // Sum revenue from COMPLETED enrollments only
          prisma.enrollment.aggregate({
            _sum: {
              ammount: true,
            },
            where: {
              status: "Completed",
            },
          }),
        ]);

      // Convert from cents to dollars
      const totalRevenue = (revenueResult._sum.ammount || 0) / 100;

      return {
        totalSignups,
        totalCustomers,
        totalCourses,
        totalLessons,
        totalRevenue,
      };
    },
    180 // Cache for 3 minutes
  );
}

// Get enrollment stats for last 30 days
export async function adminGetEnrollmentStats() {
  return withCache(
    "admin:enrollment:stats",
    async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const enrollments = await prisma.enrollment.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
          status: "Completed", // Only count completed enrollments
        },
        select: {
          createdAt: true,
          ammount: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const map = new Map();
      for (const e of enrollments) {
        const d = e.createdAt.toISOString().slice(0, 10);
        const cur = map.get(d) ?? { enrollments: 0, revenue: 0 };
        cur.enrollments += 1;
        // Convert from cents to dollars
        cur.revenue += typeof e.ammount === "number" ? e.ammount / 100 : 0;
        map.set(d, cur);
      }

      const points = [];
      const cur = new Date(thirtyDaysAgo);
      while (cur <= new Date()) {
        const key = cur.toISOString().slice(0, 10);
        const v = map.get(key) ?? { enrollments: 0, revenue: 0 };
        points.push({ date: key, enrollments: v.enrollments, revenue: v.revenue });
        cur.setDate(cur.getDate() + 1);
      }

      return points;
    },
    120 // Cache for 2 minutes
  );
}

// Get recent courses
export async function adminGetRecentCourses() {
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });
  return data;
}

// Create course
export async function createCourse(
  values: CourseFormData,
  userId: string
): Promise<ApiResponse> {
  const validation = courseSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: "error",
      message: "Invalid Form Data",
    };
  }

  const data = await stripe.products.create({
    name: validation.data.title,
    description: validation.data.smallDescription,
    default_price_data: {
      currency: "usd",
      unit_amount: validation.data.price * 100,
    },
  });

  const prismaData = mapFormToPrisma(validation.data);

  await prisma.course.create({
    data: {
      ...prismaData,
      userId: userId,
      stripePriceId: data.default_price as string,
    },
  });

  return {
    status: "success",
    message: "Course created successfully",
    data: validation.data,
  };
}

// Edit course
export async function editCourse(
  data: CourseFormData,
  courseId: string,
  userId: string
): Promise<ApiResponse> {
  const result = courseSchema.safeParse(data);
  if (!result.success) {
    return {
      status: "error",
      message: "Invalid form data",
    };
  }

  const prismaData = mapFormToPrisma(result.data);

  await prisma.course.update({
    where: {
      id: courseId,
      userId: userId,
    },
    data: {
      ...prismaData,
    },
  });

  const updatedCourse = await adminGetCourse(courseId);

  return {
    status: "success",
    message: "Course updated successfully",
    data: updatedCourse,
  };
}

// Delete course
export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  return { status: "success", message: "Course deleted successfully." };
}

// Reorder lessons
export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[]
): Promise<ApiResponse> {
  if (!lessons || lessons.length === 0) {
    return {
      status: "error",
      message: "No lessons provided for reordering",
    };
  }

  const updates = lessons.map((lesson) =>
    prisma.lesson.update({
      where: { id: lesson.id, chapterId: chapterId },
      data: { position: lesson.position },
    })
  );

  await prisma.$transaction(updates);

  return {
    status: "success",
    message: "Lessons reordered successfully",
  };
}

// Reorder chapters
export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  if (!chapters || chapters.length === 0) {
    return {
      status: "error",
      message: "No chapters provided for reordering",
    };
  }

  const updates = chapters.map((chapter) =>
    prisma.chapter.update({
      where: { id: chapter.id, courseId: courseId },
      data: { position: chapter.position },
    })
  );

  await prisma.$transaction(updates);

  return {
    status: "success",
    message: "Chapters reordered successfully",
  };
}

// Create chapter
export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  const result = chapterSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: "Invalid chapter data",
    };
  }

  await prisma.$transaction(async (tx) => {
    const maxPos = await tx.chapter.findFirst({
      where: { courseId: result.data.courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    await tx.chapter.create({
      data: {
        title: result.data.name,
        courseId: result.data.courseId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });
  });

  return {
    status: "success",
    message: "Chapter created successfully",
  };
}

// Create lesson
export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  const result = lessonSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: "Invalid lesson data",
    };
  }

  await prisma.$transaction(async (tx) => {
    const maxPos = await tx.lesson.findFirst({
      where: { chapterId: result.data.chapterId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    await tx.lesson.create({
      data: {
        title: result.data.name,
        description: result.data.description,
        videoKey: result.data.videoKey,
        thumbnailKey: result.data.thumbnailKey,
        chapterId: result.data.chapterId,
        position: (maxPos?.position ?? 0) + 1,
      },
    });
  });

  return {
    status: "success",
    message: "Lesson created successfully",
  };
}

// Update lesson
export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  const result = lessonSchema.safeParse(values);

  if (!result.success) {
    return { status: "error", message: "Invalid lesson data." };
  }

  await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      title: result.data.name,
      description: result.data.description,
      videoKey: result.data.videoKey,
      thumbnailKey: result.data.thumbnailKey,
    },
  });

  return { status: "success", message: "Lesson updated successfully." };
}

// Delete lesson
export async function deleteLesson(
  lessonId: string,
  chapterId: string
): Promise<ApiResponse> {
  const chapterWithLesson = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
    select: {
      lessons: {
        orderBy: { position: "asc" },
        select: { id: true, position: true },
      },
    },
  });

  if (!chapterWithLesson) {
    return {
      status: "error",
      message: "Chapter not found",
    };
  }

  const lessons = chapterWithLesson.lessons;
  const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);
  if (!lessonToDelete) {
    return {
      status: "error",
      message: "Lesson not found in the specified chapter",
    };
  }

  const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

  const updates = remainingLessons.map((lesson, index) => {
    return prisma.lesson.update({
      where: { id: lesson.id },
      data: { position: index + 1 },
    });
  });

  await prisma.$transaction([
    ...updates,
    prisma.lesson.delete({
      where: { id: lessonId, chapterId: chapterId },
    }),
  ]);

  return {
    status: "success",
    message: "Lesson deleted successfully",
  };
}

// Delete chapter
export async function deleteChapter(
  chapterId: string,
  courseId: string
): Promise<ApiResponse> {
  const courseWithChapters = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      chapter: {
        orderBy: { position: "asc" },
        select: { id: true, position: true },
      },
    },
  });

  if (!courseWithChapters) {
    return {
      status: "error",
      message: "Course not found",
    };
  }

  const chapters = courseWithChapters.chapter;
  const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId);
  if (!chapterToDelete) {
    return {
      status: "error",
      message: "Chapter not found in the specified course",
    };
  }

  const remainingChapters = chapters.filter(
    (chapter) => chapter.id !== chapterId
  );

  const updates = remainingChapters.map((chapter, index) => {
    return prisma.chapter.update({
      where: { id: chapter.id },
      data: { position: index + 1 },
    });
  });

  await prisma.$transaction([
    ...updates,
    prisma.chapter.delete({
      where: { id: chapterId },
    }),
  ]);

  return {
    status: "success",
    message: "Chapter deleted successfully",
  };
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;
export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
export type AdminAllLessonsType = Awaited<ReturnType<typeof adminGetAllLessons>>;
