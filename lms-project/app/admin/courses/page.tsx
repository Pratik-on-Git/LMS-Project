import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
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
        </>
    );
}