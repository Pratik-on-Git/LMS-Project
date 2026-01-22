import {
    BoltIcon,
    BookOpenIcon,
    ChevronDownIcon,
    LayersIcon,
    Layers2Icon,
    LogOutIcon,
    PinIcon,
    UserPenIcon
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function UserDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage
                            src="./avatar.png"
                            alt="User Avatar"
                        />
                        <AvatarFallback>KK</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        Kevin Kumar
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        kevin.kumar@example.com
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Option 1</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Option 2</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Option 3</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}