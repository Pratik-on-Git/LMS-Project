import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { RevenueLessonAreaInteractive } from "@/components/sidebar/revenue-lesson-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminApi } from "@/lib/api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  const [enrollmentResponse, dashboardResponse, lessonsResponse] = await Promise.all([
    adminApi.getEnrollmentStatsServer(cookieHeader),
    adminApi.getDashboardStatsServer(cookieHeader),
    adminApi.getLessonsServer(cookieHeader),
  ]);
  
  const enrollmentData = enrollmentResponse.data || [];
  const dashboardData = dashboardResponse.data;
  const lessonsData = lessonsResponse.data || [];

  return (
    <>
      <SectionCards data={dashboardData} />
      <ChartAreaInteractive data={enrollmentData} />
      {/* <DataTable data={data} /> */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link className={buttonVariants({variant: "outline"})} href="/admin/courses">View All Courses</Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses cookieHeader={cookieHeader} />
        </Suspense>
      </div>
      <RevenueLessonAreaInteractive enrollmentData={enrollmentData} lessonsData={lessonsData} />
    </>
  )
}

async function RenderRecentCourses({ cookieHeader }: { cookieHeader: string }) {
  const response = await adminApi.getRecentCoursesServer(cookieHeader);
  const data = response.data || [];
  if (data.length === 0) {
    return <EmptyState 
    buttonText="No recent courses found." 
    description="You Don't Have Any Courses. Create Some to See Them Here"
    title="No Recent Courses"
    href="/admin/courses/create"
  />
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}