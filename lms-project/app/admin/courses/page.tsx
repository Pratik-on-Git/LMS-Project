import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard } from "./_components/AdminCourseCard";

export default async function CoursesPage() {
    const data = await adminGetCourses();
    const courses = Array.isArray(data) ? data : [];
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Your Courses</h1>

                <Link href="/admin/courses/create" className={buttonVariants()}>
                    Add New Course
                </Link>
            </div>
            <div>
                <h1>Courses List</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
                {courses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No courses yet.</p>
                ) : (
                    courses.map((course) => (
                        <AdminCourseCard key={course.id} data={course} />
                    ))
                )}
            </div>
        </>
    );
}