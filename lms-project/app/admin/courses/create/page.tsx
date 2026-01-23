import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CourseCreationPage() {
    return (
        <>
            <div className="flex items-center gap-4">
                <Link href="/admin/courses" className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                })}>
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold ">Create Course</h1>        
            </div>
        </>
    )
}