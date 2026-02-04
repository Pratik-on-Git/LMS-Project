const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { body, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...restOptions.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// Server-side fetch that forwards cookies
async function fetchApiServer<T>(
  endpoint: string,
  cookieHeader: string | null,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { body, ...restOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const config: RequestInit = {
    ...restOptions,
    credentials: "include",
    headers: {
      ...headers,
      ...restOptions.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// Course APIs
export const courseApi = {
  getAll: () => fetchApi<PublicCourseType[]>("/api/courses"),
  getBySlug: (slug: string) => fetchApi<CourseDetailType>(`/api/courses/${slug}`),
  getSidebar: (slug: string) =>
    fetchApi<CourseSidebarDataType>(`/api/courses/${slug}/sidebar`),
  // Server-side version with cookie forwarding
  getSidebarServer: (slug: string, cookieHeader: string | null) =>
    fetchApiServer<CourseSidebarDataType>(`/api/courses/${slug}/sidebar`, cookieHeader),
};

// Lesson APIs
export const lessonApi = {
  getContent: (lessonId: string) =>
    fetchApi<LessonContentType>(`/api/lessons/${lessonId}`),
  markComplete: (lessonId: string) =>
    fetchApi(`/api/lessons/${lessonId}/complete`, { method: "POST" }),
  // Server-side version with cookie forwarding
  getContentServer: (lessonId: string, cookieHeader: string | null) =>
    fetchApiServer<LessonContentType>(`/api/lessons/${lessonId}`, cookieHeader),
};

// Enrollment APIs
export const enrollmentApi = {
  getEnrolled: () => fetchApi<EnrolledCourseType[]>("/api/enrollments"),
  checkEnrollment: (courseId: string) =>
    fetchApi<{ isEnrolled: boolean }>(`/api/enrollments/check/${courseId}`),
  // Server-side versions with cookie forwarding
  getEnrolledServer: (cookieHeader: string | null) =>
    fetchApiServer<EnrolledCourseType[]>("/api/enrollments", cookieHeader),
  checkEnrollmentServer: (courseId: string, cookieHeader: string | null) =>
    fetchApiServer<{ isEnrolled: boolean }>(`/api/enrollments/check/${courseId}`, cookieHeader),
};

// Stripe APIs
export const stripeApi = {
  createCheckout: (courseId: string) =>
    fetchApi<{ checkoutUrl?: string; alreadyEnrolled?: boolean }>(
      "/api/stripe/checkout",
      {
        method: "POST",
        body: { courseId },
      }
    ),
};

// Admin APIs
export const adminApi = {
  // Dashboard
  getDashboardStats: () =>
    fetchApi<DashboardStatsType>("/api/admin/dashboard/stats"),
  getEnrollmentStats: () =>
    fetchApi<EnrollmentStatsType[]>("/api/admin/dashboard/enrollment-stats"),
  getRecentCourses: () =>
    fetchApi<AdminCourseType[]>("/api/admin/dashboard/recent-courses"),
  getLessons: () => fetchApi<AdminAllLessonsType>("/api/admin/lessons"),

  // Server-side versions with cookie forwarding
  getDashboardStatsServer: (cookieHeader: string | null) =>
    fetchApiServer<DashboardStatsType>("/api/admin/dashboard/stats", cookieHeader),
  getEnrollmentStatsServer: (cookieHeader: string | null) =>
    fetchApiServer<EnrollmentStatsType[]>("/api/admin/dashboard/enrollment-stats", cookieHeader),
  getRecentCoursesServer: (cookieHeader: string | null) =>
    fetchApiServer<AdminCourseType[]>("/api/admin/dashboard/recent-courses", cookieHeader),
  getLessonsServer: (cookieHeader: string | null) =>
    fetchApiServer<AdminAllLessonsType>("/api/admin/lessons", cookieHeader),
  getCoursesServer: (cookieHeader: string | null) =>
    fetchApiServer<AdminCourseType[]>("/api/admin/courses", cookieHeader),
  getCourseServer: (courseId: string, cookieHeader: string | null) =>
    fetchApiServer<AdminCourseSingularType>(`/api/admin/courses/${courseId}`, cookieHeader),
  getLessonServer: (lessonId: string, cookieHeader: string | null) =>
    fetchApiServer<AdminLessonType>(`/api/admin/lessons/${lessonId}`, cookieHeader),

  // Courses
  getCourses: () => fetchApi<AdminCourseType[]>("/api/admin/courses"),
  getCourse: (courseId: string) =>
    fetchApi<AdminCourseSingularType>(`/api/admin/courses/${courseId}`),
  createCourse: (data: CourseFormData) =>
    fetchApi("/api/admin/courses", { method: "POST", body: data }),
  editCourse: (courseId: string, data: CourseFormData) =>
    fetchApi(`/api/admin/courses/${courseId}`, { method: "PUT", body: data }),
  deleteCourse: (courseId: string) =>
    fetchApi(`/api/admin/courses/${courseId}`, { method: "DELETE" }),

  // Chapters
  createChapter: (data: ChapterSchemaType) =>
    fetchApi("/api/admin/chapters", { method: "POST", body: data }),
  deleteChapter: (chapterId: string, courseId: string) =>
    fetchApi(`/api/admin/chapters/${chapterId}`, {
      method: "DELETE",
      body: { courseId },
    }),
  reorderChapters: (
    courseId: string,
    chapters: { id: string; position: number }[]
  ) =>
    fetchApi("/api/admin/chapters/reorder", {
      method: "PUT",
      body: { courseId, chapters },
    }),

  // Lessons
  getLesson: (lessonId: string) =>
    fetchApi<AdminLessonType>(`/api/admin/lessons/${lessonId}`),
  createLesson: (data: LessonSchemaType) =>
    fetchApi("/api/admin/lessons", { method: "POST", body: data }),
  updateLesson: (lessonId: string, data: LessonSchemaType) =>
    fetchApi(`/api/admin/lessons/${lessonId}`, { method: "PUT", body: data }),
  deleteLesson: (lessonId: string, chapterId: string) =>
    fetchApi(`/api/admin/lessons/${lessonId}`, {
      method: "DELETE",
      body: { chapterId },
    }),
  reorderLessons: (
    chapterId: string,
    lessons: { id: string; position: number }[]
  ) =>
    fetchApi("/api/admin/lessons/reorder", {
      method: "PUT",
      body: { chapterId, lessons },
    }),
};

// S3 APIs
export const s3Api = {
  getUploadUrl: (data: {
    fileName: string;
    contentType: string;
    size: number;
    isImage: boolean;
  }) => fetchApi<{ url: string; key: string }>("/api/s3/upload", { method: "POST", body: data }),
  deleteFile: (key: string) =>
    fetchApi("/api/s3/delete", { method: "DELETE", body: { key } }),
};

// Type definitions
export type PublicCourseType = {
  id: string;
  title: string;
  slug: string;
  smallDescription: string;
  fileKey: string;
  duration: number;
  level: string;
  category: string;
};

export type CourseDetailType = {
  id: string;
  title: string;
  smallDescription: string;
  description: string;
  fileKey: string;
  duration: number;
  level: string;
  category: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  chapter: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
    }[];
  }[];
};

export type CourseSidebarDataType = {
  course: {
    id: string;
    title: string;
    fileKey: string;
    duration: number;
    level: string;
    category: string;
    slug: string;
    chapter: {
      id: string;
      title: string;
      position: number;
      lessons: {
        id: string;
        title: string;
        position: number;
        description: string | null;
        lessonProgress: {
          lessonId: string;
          completed: boolean;
          id: string;
        }[];
      }[];
    }[];
  };
};

export type LessonContentType = {
  id: string;
  title: string;
  description: string | null;
  thumbnailKey: string | null;
  videoKey: string | null;
  position: number;
  lessonProgress: {
    completed: boolean;
    lessonId: string;
  }[];
  Chapter: {
    courseId: string;
    course: {
      title: string;
      slug: string;
    };
  };
};

export type EnrolledCourseType = {
  Course: {
    id: string;
    title: string;
    smallDescription: string;
    fileKey: string;
    slug: string;
    duration: number;
    level: string;
    chapter: {
      id: string;
      lessons: {
        id: string;
        lessonProgress: {
          completed: boolean;
          id: string;
          lessonId: string;
        }[];
      }[];
    }[];
  };
};

export type AdminCourseType = {
  id: string;
  title: string;
  smallDescription: string;
  duration: number;
  level: string;
  status: string;
  price: number;
  fileKey: string;
  slug: string;
};

export type AdminCourseSingularType = {
  id: string;
  title: string;
  smallDescription: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  status: string;
  slug: string;
  category: string;
  chapter: {
    id: string;
    title: string;
    position: number;
    lessons: {
      id: string;
      title: string;
      description: string | null;
      thumbnailKey: string | null;
      position: number;
      videoKey: string | null;
    }[];
  }[];
};

export type AdminLessonType = {
  title: string;
  videoKey: string | null;
  description: string | null;
  thumbnailKey: string | null;
  id: string;
  position: number;
};

export type AdminAllLessonsType = {
  id: string;
  date: string;
}[];

export type DashboardStatsType = {
  totalSignups: number;
  totalCustomers: number;
  totalCourses: number;
  totalLessons: number;
  totalRevenue: number;
};

export type EnrollmentStatsType = {
  date: string;
  enrollments: number;
  revenue: number;
};

export type CourseFormData = {
  title: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  smallDescription: string;
  slug: string;
  status: "Draft" | "Published" | "Archived";
};

export type ChapterSchemaType = {
  name: string;
  courseId: string;
};

export type LessonSchemaType = {
  name: string;
  courseId: string;
  chapterId: string;
  description?: string;
  thumbnailKey?: string;
  videoKey?: string;
};
