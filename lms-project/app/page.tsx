"use client";
import Image from "next/image";
import { MotionMain, MotionButton } from "@/components/ui/animated";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
  
export default function Home() {
  const { data: session} = authClient.useSession() 
  const router = useRouter();
  async function signOut() {
    await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
      toast.success("Successfully logged out.");
    },
  },
});
  }
  return (
    <MotionMain className="flex min-h-screen flex-col items-center justify-center p-24">
      <ThemeToggle />
      {session ? (
        <>
          <p>Welcome Back! {session.user?.name}</p>
          <Button onClick={signOut}>Logout</Button>
        </> 
      ) : (
        <>
          <p>Please log in to continue.</p>
          <Button>Login</Button>
        </>
      )}
    </MotionMain>
  );
}
