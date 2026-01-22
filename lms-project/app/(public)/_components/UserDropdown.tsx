import {
    ChevronDownIcon,
    LogOutIcon,
    HomeIcon,
    BookOpen,
    LayoutDashboardIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/dist/client/components/navigation"

interface iAppProps {
    name: string;
    email: string;
    image: string;
}

export function UserDropdown({ name, email, image } : iAppProps) {

    const router = useRouter();
    async function signOut() {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");  
                        toast.success("Successfully logged out.");
                    },
                    onError: () => {
                        toast.error("Error logging out. Please try again.");
                    }
                },
            });
        }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage
                            src={image}
                            alt="User Avatar"
                        />
                        <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        {name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        {email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
                                <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/courses">
                            <BookOpen size={16} className="opacity-60" aria-hidden="true" />
                                <span>Courses</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                            <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
                                <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}