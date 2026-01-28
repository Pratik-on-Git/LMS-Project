"use client"

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface iAppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({ data, chapterId, courseId }: iAppProps) {
    return (
        <div>
            <Link href={`/admin/courses/${courseId}/edit`} className={buttonVariants({ variant: "outline", className: "mb-4" })}>
                <ArrowLeft className="size-4" />
                <span>Back to Course</span>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>Configure the details of the lesson here.</CardDescription>
                </CardHeader>
                <CardContent>
                    
                </CardContent>
            </Card>
        </div>
    );
}