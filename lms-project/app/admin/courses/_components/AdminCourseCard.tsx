import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { useConstructUrl } from "@/hooks/use-construct";
import Link from "next/link";
import { ArrowRight, School2, TimerIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface iAppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.fileKey);
    return (
        <Card className="group relative overflow-hidden py-0 gap-0">
            <div className="relative w-full aspect-video bg-muted">
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={data.title ?? "Course Image"}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 600px, 100vw"
                        priority
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <Link
                    href={`/admin/courses/${data.id}/edit`}
                    className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
                >
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight">{data.smallDescription}</p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.duration}hrs.</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School2 className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.level}</p>
                    </div>
                </div>
                <Link
                    href={`/admin/courses/${data.id}/edit`}
                    className={buttonVariants({
                        className: "w-full mt-4 justify-center",
                    })}
                >
                    Edit Course <ArrowRight className="size-4" />
                </Link>
            </CardContent>
        </Card>
    );
}