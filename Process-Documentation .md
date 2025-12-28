# Process Documentation — Actions Performed

### 🛠️ First Installed pnpm - Used `npm` to install the pnpm executable.
	 
* Fonts - Added `IBM Plex Sans` via Next.js `next/font/google`.
* File changed: `app/layout.tsx` — added `IBM_Plex_Sans` import and configured the font variable `--font-ibm-plex` on the `<body>` class.
* Colors - Defined a custom color palette in `app/globals.css` and created utility classes for text colors.
* Favicon - Created a simple SVG favicon and updated the app metadata to reference it.

## 🛣️ Route Groups in NextJS
In the `app` directory, nested folders are normally mapped to URL paths. However, you can mark a folder as a Route Group to prevent the folder from being included in the route's URL path.

This allows you to organize your files better into logical groups without affecting the URL path structure.
### 📐 Convention
To create a Route Group, simply wrap the folder name in parentheses. For example, a folder named `(admin)` would be treated as a Route Group.

### 🗃️ Organize routes without affecting the URL path
To organize routes without affecting the URL, create a group to keep related routes together. The folders in parenthesis will be omitted from the URL (e.g. `(marketing)` or `(shop)`)

### 🧩 How we'll create our folder
We're gonna create a `(auth)` folder to `app` folder. then gonna create a `login` folder to contain all login-related pages like login and forgot-password. Then gonna add a `page.tsx` file inside that `login` folder.
```
export default function LoginPage() {
    return(
        <div>
            <h1>A <b>production-ready course platform</b> built with <b>Next.js 15</b>, featuring secure authentication, payments, analytics, progress tracking, drag-and-drop course creation, and a modern admin & customer dashboard experience.</h1>
        </div>
    )
}
```
now go to route `http://localhost:3000/login` to see the result.

## ✨ shadcn/ui Addition (what we ran and what was created)

What was run
- Executed the shadcn CLI to add the `button` component:

```powershell
pnpm dlx shadcn@latest add button
```

What the CLI produced (key files created or updated)
- `components.json` — configuration for the shadcn UI generator (style: `new-york`, RSC/TSX flags, aliases pointing `ui` → `@/components/ui`).
- `components/ui/button.tsx` — the generated Button component (exported `Button` and `buttonVariants`).
- `lib/utils.ts` — small utility helper `cn()` for merging class names (used by generated components).

Notes
- The project already uses Tailwind; shadcn was configured to use `app/globals.css` for its CSS variables.
- You can now import and use the generated `Button` in app code, e.g.:

```tsx
import { Button } from "@/components/ui/button"

export default function Demo() {
    return <Button>Click me</Button>
}
```
- Add more components via the shadcn CLI 
```
pnpm dlx shadcn@latest add alert-dialog avatar badge breadcrumb button card chart checkbox collapsible dialog drawer dropdown-menu form input-otp input label progress select separator sheet sidebar skeleton sonner table tabs textarea toggle-group toggle tooltip
```

## Login Page UI Creation
Created a simple login page inside the `(auth)/login/page.tsx` file with the following content:
```tsx
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
                <Button variant="default" className="w-full">
                    <GithubIcon className="size-4"/>
                    Log In With Github
                </Button>
            </CardContent>
        </Card>
    )
}
```
Also add some codes in `app/auth/layout.tsx` to center the login card.
```tsx
export default function AuthLayout({ children }: { children: ReactNode }) {
    return(
        <div className="relative flex min-h-svh flex-col items-center justify-center ">
            <div className="flex w-full max-w-sm flex-col gap-6">
                {children}
            </div>
        </div>   
    )
}
```
### Dark Theme Addition
To add dark theme support to the application, we made the following changes: 
1. Open Shadcn UI's website and navigate to the "Docs" section.
2. Locate the "Dark Theme" documentation page. Open Next.js & Copy the provided code snippet for dark theme support. Create a new file named `theme-provider.tsx` inside the `components/ui` folder and paste the copied code into this file.
```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```
> This code have a "use client" directive at the top, indicating that it is a client-side component & it will get a JavaScript bundle shipped to it because this component needs the client side to work as intended.
3. Next, open the `app/layout.tsx` file and import the newly created `ThemeProvider` component. Wrap the existing content inside the `ThemeProvider` component to enable dark theme support throughout the application.
```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Neo LMS",
  description: "A Learning Management System for Modern Education",
  icons: {
    icon: '/favicon-black.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

```
4. Add a mode toggle
Place a mode toggle on your site to toggle between light and dark mode. You can use shadcn's `Toggle` component for this purpose. `app/components/ui/theme-toggle.tsx`.

Here's how to implement it:
```tsx 
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```
Now we'll add a toggle button to the home page. Open the `app/page.tsx` file and import the `ThemeToggle()` component. Place the `ThemeToggle` component at the top right corner of the login card.
```tsx
import Image from "next/image";
import { MotionMain, MotionButton } from "@/components/ui/animated";
import { CardDescriptionWhite, CardTitle, CardBlue } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
  
export default function Home() {
  return (
    <MotionMain className="flex min-h-screen flex-col items-center justify-center p-24">
      <ThemeToggle />
      <CardBlue className="flex flex-col items-center justify-center">
        <Image src="/favicon.png" alt="Neo LMS logo" width={50} height={50} priority/>
        <div className="flex flex-col gap-1 text-center">
          <CardTitle className="font--font-space-grotesk">Welcome to Neo LMS</CardTitle>
          <CardDescriptionWhite>
            Your learning management system at your fingertips.
          </CardDescriptionWhite>
        </div>
      </CardBlue>
      <MotionButton
        type="button"
        className="mt-6 bg--turquoise text--black font--font-space-grotesk flex flex-col items-center justify-center gap-6 rounded-sm px-6 py-3 shadow-sm font-medium"
        aria-label="Coming Soon"
      >
        Coming Soon
      </MotionButton>
    </MotionMain>
  );
}
```
Now you should see a toggle button at the top right corner of the home page. You can click on it to switch between light and dark themes.

### Final Button Component (Variant) Code After Modifications
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        github: "bg-[#24292f] text-white hover:bg-[#16181b]",
        google: "bg-transparent text-[#4285F4] border border-[#4285F4] hover:bg-[#4285F4]/10",
        "google-outline": "bg-gradient-to-r from-[#EA4335] via-[#FBBC05] via-[#34A853] to-[#4285F4] text-white hover:opacity-95",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

