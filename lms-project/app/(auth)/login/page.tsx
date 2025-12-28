import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGithub as GithubIcon, SiFacebook } from 'react-icons/si';
import { SiGoogle } from 'react-icons/si'

export default function LoginPage() {
    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome Back!</CardTitle>
                <CardDescription>Please Log In to Your Account</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <Button variant="google" className="w-full">
                    <SiGoogle className="size-4"/>
                    Log In With Google
                </Button>
                <Button variant="facebook" className="w-full">
                    <SiFacebook className="size-4"/>
                    Log In With Facebook
                </Button>
                <Button variant="default" className="w-full">
                    <GithubIcon className="size-4"/>
                    Log In With Github
                </Button>
            </CardContent>
        </Card>
    )
}