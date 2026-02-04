import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { courseApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

interface iAppProps {
    params: Promise<{ slug: string }>;
    children: ReactNode;
}

export default async function CourseLayout({ params, children }: iAppProps) {
    const {slug} = await params;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await courseApi.getSidebarServer(slug, cookieHeader);
    
    if (response.status === "error" || !response.data) {
        notFound();
    }
    
	return (
		<div className="flex flex-1">
			{/* sidebar - 30% */}
			<div className="w-80 border-r border-border shrink-0">
				<CourseSidebar course={response.data.course} />
			</div>

			{/* Main Content - 70% */}
			<div className="flex-1 overflow-hidden">
				{children}
			</div>
		</div>
	);
}

