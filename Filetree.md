# File Tree: LMS-Project

**Generated:** 2/5/2026, 2:58:48 PM
**Root Path:** `c:\Users\PRATIK\Documents\GitHub\LMS-Project`

```
├── 📁 lms-backend
│   ├── 📁 prisma
│   │   └── 📄 schema.prisma
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   ├── 📄 arcjet.ts
│   │   │   ├── 📄 env.ts
│   │   │   ├── 📄 s3.ts
│   │   │   └── 📄 stripe.ts
│   │   ├── 📁 controllers
│   │   │   ├── 📄 admin.controller.ts
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 course.controller.ts
│   │   │   ├── 📄 enrollment.controller.ts
│   │   │   ├── 📄 lesson.controller.ts
│   │   │   ├── 📄 s3.controller.ts
│   │   │   └── 📄 stripe.controller.ts
│   │   ├── 📁 lib
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 nodemailer.ts
│   │   │   ├── 📄 prisma.ts
│   │   │   └── 📄 redis.ts
│   │   ├── 📁 middleware
│   │   │   ├── 📄 errorHandler.ts
│   │   │   ├── 📄 rateLimit.ts
│   │   │   ├── 📄 requireAdmin.ts
│   │   │   └── 📄 requireUser.ts
│   │   ├── 📁 routes
│   │   │   ├── 📄 admin.routes.ts
│   │   │   ├── 📄 auth.routes.ts
│   │   │   ├── 📄 course.routes.ts
│   │   │   ├── 📄 enrollment.routes.ts
│   │   │   ├── 📄 lesson.routes.ts
│   │   │   ├── 📄 s3.routes.ts
│   │   │   └── 📄 stripe.routes.ts
│   │   ├── 📁 services
│   │   │   ├── 📄 admin.service.ts
│   │   │   ├── 📄 course.service.ts
│   │   │   ├── 📄 enrollment.service.ts
│   │   │   ├── 📄 lesson.service.ts
│   │   │   ├── 📄 s3.service.ts
│   │   │   └── 📄 stripe.service.ts
│   │   ├── 📁 types
│   │   │   └── 📄 index.ts
│   │   ├── 📁 validators
│   │   │   └── 📄 zodSchemas.ts
│   │   ├── 📄 app.ts
│   │   └── 📄 server.ts
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── ⚙️ package.json
│   ├── ⚙️ pnpm-lock.yaml
│   ├── 📄 prisma.config.ts
│   └── ⚙️ tsconfig.json
├── 📁 lms-frontend
│   ├── 📁 app
│   │   ├── 📁 (auth)
│   │   │   ├── 📁 login
│   │   │   │   ├── 📁 _components
│   │   │   │   │   └── 📄 LoginForm.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 signup
│   │   │   │   ├── 📁 _components
│   │   │   │   │   └── 📄 SignUpForm.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 verify-request
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 layout.tsx
│   │   ├── 📁 (public)
│   │   │   ├── 📁 _components
│   │   │   │   ├── 📄 Navbar.tsx
│   │   │   │   ├── 📄 PublicCourseCard.tsx
│   │   │   │   └── 📄 UserDropdown.tsx
│   │   │   ├── 📁 courses
│   │   │   │   ├── 📁 [slug]
│   │   │   │   │   ├── 📁 _components
│   │   │   │   │   │   └── 📄 EnrollmentButton.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 admin
│   │   │   ├── 📁 courses
│   │   │   │   ├── 📁 [courseId]
│   │   │   │   │   ├── 📁 [chapterId]
│   │   │   │   │   │   └── 📁 [lessonId]
│   │   │   │   │   │       ├── 📁 _components
│   │   │   │   │   │       │   └── 📄 LessonForm.tsx
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   ├── 📁 delete
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📁 edit
│   │   │   │   │       ├── 📁 _components
│   │   │   │   │       │   ├── 📄 CourseStructure.tsx
│   │   │   │   │       │   ├── 📄 DeleteChapter.tsx
│   │   │   │   │       │   ├── 📄 DeleteLesson.tsx
│   │   │   │   │       │   ├── 📄 EditCourseForm.tsx
│   │   │   │   │       │   ├── 📄 NewChapterModal.tsx
│   │   │   │   │       │   └── 📄 NewLessonModal.tsx
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 _components
│   │   │   │   │   └── 📄 AdminCourseCard.tsx
│   │   │   │   ├── 📁 create
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── ⚙️ data.json
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 dashboard
│   │   │   ├── 📁 [slug]
│   │   │   │   ├── 📁 [lessonId]
│   │   │   │   │   ├── 📁 _components
│   │   │   │   │   │   ├── 📄 CourseContent.tsx
│   │   │   │   │   │   └── 📄 LessonSkeleton.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📄 layout.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 _components
│   │   │   │   ├── 📄 CourseProgressCard.tsx
│   │   │   │   ├── 📄 CourseSidebar.tsx
│   │   │   │   ├── 📄 DashboardAppSidebar.tsx
│   │   │   │   └── 📄 LessonItem.tsx
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 not-admin
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 payment
│   │   │   ├── 📁 cancel
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📁 success
│   │   │       └── 📄 page.tsx
│   │   ├── 🎨 globals.css
│   │   └── 📄 layout.tsx
│   ├── 📁 components
│   │   ├── 📁 auth
│   │   ├── 📁 file-uploader
│   │   │   ├── 📄 RenderState.tsx
│   │   │   └── 📄 Uploader.tsx
│   │   ├── 📁 general
│   │   │   └── 📄 EmptyState.tsx
│   │   ├── 📁 rich-text-editor
│   │   │   ├── 📄 Editor.tsx
│   │   │   ├── 📄 Menubar.tsx
│   │   │   └── 📄 RenderDescription.tsx
│   │   ├── 📁 sidebar
│   │   │   ├── 📄 app-sidebar.tsx
│   │   │   ├── 📄 chart-area-interactive.tsx
│   │   │   ├── 📄 chart-radial-grid.tsx
│   │   │   ├── 📄 data-table.tsx
│   │   │   ├── 📄 nav-documents.tsx
│   │   │   ├── 📄 nav-main.tsx
│   │   │   ├── 📄 nav-secondary.tsx
│   │   │   ├── 📄 nav-user.tsx
│   │   │   ├── 📄 revenue-lesson-area-interactive.tsx
│   │   │   ├── 📄 section-cards.tsx
│   │   │   └── 📄 site-header.tsx
│   │   └── 📁 ui
│   │       ├── 📄 alert-dialog.tsx
│   │       ├── 📄 animated.tsx
│   │       ├── 📄 avatar.tsx
│   │       ├── 📄 badge.tsx
│   │       ├── 📄 breadcrumb.tsx
│   │       ├── 📄 button.tsx
│   │       ├── 📄 card.tsx
│   │       ├── 📄 chart.tsx
│   │       ├── 📄 checkbox.tsx
│   │       ├── 📄 collapsible.tsx
│   │       ├── 📄 dialog.tsx
│   │       ├── 📄 drawer.tsx
│   │       ├── 📄 dropdown-menu.tsx
│   │       ├── 📄 field-1.tsx
│   │       ├── 📄 form.tsx
│   │       ├── 📄 gradient-mesh.tsx
│   │       ├── 📄 input-group.tsx
│   │       ├── 📄 input-otp.tsx
│   │       ├── 📄 input.tsx
│   │       ├── 📄 label.tsx
│   │       ├── 📄 progress.tsx
│   │       ├── 📄 select.tsx
│   │       ├── 📄 separator.tsx
│   │       ├── 📄 shader-animation.tsx
│   │       ├── 📄 sheet.tsx
│   │       ├── 📄 sidebar.tsx
│   │       ├── 📄 skeleton.tsx
│   │       ├── 📄 sonner.tsx
│   │       ├── 📄 table.tsx
│   │       ├── 📄 tabs.tsx
│   │       ├── 📄 textarea.tsx
│   │       ├── 📄 theme-provider.tsx
│   │       ├── 📄 theme-toggle.tsx
│   │       ├── 📄 toggle-group.tsx
│   │       ├── 📄 toggle.tsx
│   │       └── 📄 tooltip.tsx
│   ├── 📁 hooks
│   │   ├── 📄 try-catch.ts
│   │   ├── 📄 use-arcjet-protection.ts
│   │   ├── 📄 use-construct.ts
│   │   ├── 📄 use-course-progress.ts
│   │   ├── 📄 use-mobile.ts
│   │   └── 📄 use-signout.ts
│   ├── 📁 lib
│   │   ├── 📄 api.ts
│   │   ├── 📄 auth-client.ts
│   │   ├── 📄 env.ts
│   │   ├── 📄 types.ts
│   │   ├── 📄 utils.ts
│   │   └── 📄 zodSchemas.ts
│   ├── 📁 public
│   │   ├── 🖼️ favicon-white.svg
│   │   ├── 🖼️ favicon.png
│   │   ├── 🖼️ file.svg
│   │   ├── 🖼️ globe.svg
│   │   ├── 🖼️ next.svg
│   │   ├── 🖼️ vercel.svg
│   │   └── 🖼️ window.svg
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── ⚙️ components.json
│   ├── 📄 eslint.config.mjs
│   ├── 📄 next-env.d.ts
│   ├── 📄 next.config.ts
│   ├── ⚙️ package.json
│   ├── ⚙️ pnpm-lock.yaml
│   ├── ⚙️ pnpm-workspace.yaml
│   ├── 📄 postcss.config.mjs
│   ├── 📄 proxy.ts
│   └── ⚙️ tsconfig.json
├── 📝 README.md
├── ⚙️ postman-collection.json
└── ⚙️ swagger.yaml
```

---
*Generated by FileTree Pro Extension*