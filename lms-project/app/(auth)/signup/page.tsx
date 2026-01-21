import { headers } from "next/headers";
import { SignUpForm } from "./_components/SignUpForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session) {
        return redirect("/");
    }

    return <SignUpForm />;
}