import { prisma } from "../lib/prisma.js";

// Get lesson content with progress
export async function getLessonContent(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      lessonProgress: {
        where: {
          userId: userId,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      Chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return null;
  }

  // Verify enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
      courseId: lesson.Chapter.courseId,
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "Completed") {
    return null;
  }

  return lesson;
}

// Mark lesson as complete
export async function markLessonComplete(lessonId: string, userId: string) {
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: userId,
        lessonId: lessonId,
      },
    },
    update: {
      completed: true,
    },
    create: {
      lessonId: lessonId,
      userId: userId,
      completed: true,
    },
  });

  return { success: true };
}

export type LessonContentType = NonNullable<
  Awaited<ReturnType<typeof getLessonContent>>
>;
