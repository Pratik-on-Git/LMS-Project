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

## Login Page Creation
Created a simple login page inside the `(auth)/login/page.tsx` file with the following content: