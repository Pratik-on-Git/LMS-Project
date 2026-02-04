"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { toast } from "sonner";
import { stripeApi } from "@/lib/api";
import { CircleChevronRight, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function EnrollmentButton({courseId}:{courseId: string}) {
    const [pending, startTransition] = useTransition();
    const { data: session } = useSession();
    const router = useRouter();

    function onSubmit() {
        // Redirect to login if not authenticated
        if (!session?.user) {
            toast.error("Please log in to enroll in this course.");
            router.push("/login");
            return;
        }

        startTransition(async () => {
            const { data: result, error } = await tryCatch(stripeApi.createCheckout(courseId));

            if (error) {
                toast.error("Unexpected error occurred. Please try again.");
                return;
            }

            if (result.status === "success") {
                if (result.data?.alreadyEnrolled) {
                    toast.success("You are already enrolled in this course.");
                } else if (result.data?.checkoutUrl) {
                    // Redirect to Stripe checkout
                    window.location.href = result.data.checkoutUrl;
                }
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    }
    return <Button className="w-full cursor-pointer" onClick={onSubmit} disabled={pending}>
        { pending ? 
        <>
            <Loader2 className="size-4 animate-spin" />
            Enrolling...
        </> : <>
            <CircleChevronRight className="size-4" />
            Enroll Now
        </> }
    </Button>
}