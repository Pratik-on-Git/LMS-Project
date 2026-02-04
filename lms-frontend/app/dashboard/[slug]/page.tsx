import { courseApi } from "@/lib/api";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";

interface iAppProps {
    params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    // Get course data to find the first lesson
    const response = await courseApi.getSidebarServer(slug, cookieHeader);
    
    if (response.status === "error" || !response.data) {
        notFound();
    }
    
    const course = response.data.course;
    
    // Find the first lesson in the first chapter
    const firstChapter = course.chapter[0];
    const firstLesson = firstChapter?.lessons[0];
    if ( firstLesson) {
        redirect(`/dashboard/${slug}/${firstLesson.id}`);
    }
    
    // If no lessons found, show empty state
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-muted-foreground">No lessons available</h2>
                <p className="text-sm text-muted-foreground mt-2">This course doesn&apos;t have any lessons yet.</p>
            </div>
        </div>
    );
}