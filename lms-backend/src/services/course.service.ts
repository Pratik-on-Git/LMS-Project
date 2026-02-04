import { prisma } from "../lib/prisma.js";

// Get all published courses (public)
export async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
    },
  });

  return data;
}

// Get individual course by slug (public)
export async function getIndividualCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      description: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      status: true,
      price: true,
      createdAt: true,
      updatedAt: true,
      chapter: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return course;
}

// Get course sidebar data with user progress
export async function getCoursesSidebarData(slug: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
      chapter: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: userId,
                },
                select: {
                  lessonId: true,
                  completed: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  // Verify enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
      courseId: course.id,
    },
  });

  if (!enrollment || enrollment.status !== "Completed") {
    return null;
  }

  return { course };
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
export type CourseSidebarDataType = NonNullable<
  Awaited<ReturnType<typeof getCoursesSidebarData>>
>;
