import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/dist/client/link"
import {ReactNode} from "react"
import Image from "next/image"
import logo from '@/public/favicon.png'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return(
        <div className="relative flex min-h-svh flex-col items-center justify-center ">
            <Link href="/" className={buttonVariants({variant: 'outline', className: 'absolute top-4 left-4 md:top-8 md:left-8'})}>
                <ArrowLeft className="size-4"/> Back
            </Link>

            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                <Image src={logo} alt="NeoLMS logo"
                    width={32}
                    height={32}
                    priority    
                />
                    NeoLMS
                </Link>
                {children} 
                <div className="text-balance text-center text-xs text-muted-foreground">By clicking Continue, you agree to our 
                    <span className="hover:text-primary hover:underline font-medium"> Terms and Conditions</span>.</div>
            </div>
        </div>   
    )
}
