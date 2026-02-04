"use client";

import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteLesson({
    courseId,
    chapterId,
    lessonId, }: {
        courseId: string;
        chapterId: string;
        lessonId: string;
    }) {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    async function onSubmit() {
        startTransition(async () => {
            const {data:result, error} = await tryCatch(adminApi.deleteLesson(lessonId, chapterId));
            if (error) {
                toast.error("An error occurred while deleting the lesson");
                return;
            }
            if (result.status === "success") {
                toast.success(result.message);
                setOpen(false);
                router.refresh();
            }
            else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100">
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this lesson?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the lesson from the course.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type="button" onClick={onSubmit} disabled={pending} className="bg-red-600 text-white hover:bg-red-700">
                        {pending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
	);
}
