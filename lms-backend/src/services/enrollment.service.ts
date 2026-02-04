import { prisma } from "../lib/prisma.js";
import { EnrollmentStatus } from "@prisma/client";

// Get enrolled courses for a user
export async function getEnrolledCourses(userId: string) {
  const data = await prisma.enrollment.findMany({
    where: {
      userId: userId,
      status: "Completed",
    },
    select: {
      Course: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          fileKey: true,
          slug: true,
          duration: true,
          level: true,
          chapter: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: userId,
                    },
                    select: {
                      completed: true,
                      id: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

// Check if user is enrolled in a course
export async function checkIfCourseBought(
  courseId: string,
  userId: string
): Promise<boolean> {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
      courseId: courseId,
    },
    select: {
      status: true,
    },
  });

  return enrollment?.status === EnrollmentStatus.Completed ? true : false;
}

// Create pending enrollment
export async function createPendingEnrollment(
  courseId: string,
  userId: string,
  amount: number
) {
  // Check existing enrollment
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: courseId,
        userId: userId,
      },
    },
    select: { status: true, id: true },
  });

  if (existingEnrollment?.status === EnrollmentStatus.Completed) {
    return { alreadyEnrolled: true, enrollment: existingEnrollment };
  }

  let enrollment;
  if (existingEnrollment) {
    enrollment = await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: {
        ammount: amount,
        status: EnrollmentStatus.Pending,
        updatedAt: new Date(),
      },
    });
  } else {
    enrollment = await prisma.enrollment.create({
      data: {
        courseId: courseId,
        userId: userId,
        ammount: amount,
        status: EnrollmentStatus.Pending,
      },
    });
  }

  return { alreadyEnrolled: false, enrollment };
}

// Update enrollment status
export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: EnrollmentStatus,
  amount?: number
) {
  const updateData: { status: EnrollmentStatus; updatedAt: Date; ammount?: number } = {
    status,
    updatedAt: new Date(),
  };

  if (amount !== undefined) {
    updateData.ammount = amount;
  }

  return await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: updateData,
  });
}

// Get enrollment by ID
export async function getEnrollmentById(enrollmentId: string) {
  return await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { id: true, status: true, userId: true, courseId: true, ammount: true },
  });
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
