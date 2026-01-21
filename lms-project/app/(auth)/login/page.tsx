"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { use, useTransition } from "react";
import { SiGithub as GithubIcon } from 'react-icons/si';
import { SiGoogle } from 'react-icons/si'
import { toast } from "sonner";

export default function LoginPage() {

    const [githubPending, startGithubTransition] = useTransition()
    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => { toast.success("Successfully logged in with GitHub!") },
                    onError: (error) => { toast.error("Something went wrong during GitHub login.") }
                },
            });
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome Back!</CardTitle>
                <CardDescription>Please Log In to Your Account</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <Button variant="google-outline" className="w-full">
                    <SiGoogle className="size-4" />
                    Log In With Google
                </Button>
                <Button
                    onClick={signInWithGithub}
                    variant="github"
                    className="w-full"
                    disabled={githubPending}>
                    {githubPending ? (<>
                        <Loader className="size-4 animate-spin" />
                        <span>Loading...</span>
                    </>) : (<>
                        <GithubIcon className="size-4" />
                        Log In With Github
                    </>)}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or Use Your Email Account</span>
                </div>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" placeholder="your-email@example.com" id="email" />
                    </div>
                    <Button variant="blue" className="w-full">Continue with Email</Button>
                </div>
            </CardContent>
        </Card>
    )
}