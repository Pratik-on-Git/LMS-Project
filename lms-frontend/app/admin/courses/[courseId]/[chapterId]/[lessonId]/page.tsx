import { adminApi } from "@/lib/api";
import { LessonForm } from "./_components/LessonForm";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonIdPage({ params }: { params: Params }) {
  const { courseId, chapterId, lessonId } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  const response = await adminApi.getLessonServer(lessonId, cookieHeader);
  
  if (response.status === "error" || !response.data) {
    notFound();
  }
  
  return (
    <LessonForm data={response.data} chapterId={chapterId} courseId={courseId}/>
  );
}