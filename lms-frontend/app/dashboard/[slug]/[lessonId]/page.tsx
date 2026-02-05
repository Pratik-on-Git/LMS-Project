import { lessonApi } from "@/lib/api";
import { CourseContent } from "./_components/CourseContent";
import { Suspense } from "react";
import { LessonSkeleton } from "./_components/LessonSkeleton";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

type Params = Promise<{ lessonId: string; slug: string }>;

export default async function LessonContentPage({params}: { params: Params }){
    const { lessonId, slug } = await params;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    return (
        <Suspense fallback={<LessonSkeleton />}>
        <LessonContentLoader lessonId={lessonId} slug={slug} cookieHeader={cookieHeader} />
        </Suspense>
    );
}

async function LessonContentLoader({lessonId, slug, cookieHeader}: {lessonId: string; slug: string; cookieHeader: string}){
    const response = await lessonApi.getContentServer(lessonId, cookieHeader);
    
    if (response.status === "error" || !response.data) {
        notFound();
    }
    
    return <CourseContent data={response.data} slug={slug} />;
}
