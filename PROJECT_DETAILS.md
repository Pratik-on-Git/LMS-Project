# LMS Project - Complete Technical Documentation

## 📌 Executive Summary

**NeoLMS** is a modern, full-stack Learning Management System built to provide a seamless educational experience. It's a scalable platform that enables course creation, content delivery, enrollment management, and payment processing with enterprise-grade security and performance optimizations.

**Built by:** Pratik  
**Version:** 1.0.0  
**Last Updated:** February 5, 2026

---

## 🏗️ Architecture Overview

The project follows a **monorepo structure** with separated frontend and backend applications communicating via RESTful APIs.

```
LMS-Project/
├── lms-backend/          # Express.js TypeScript API Server
├── lms-frontend/         # Next.js 16 React Application
├── postman-collection.json  # API Documentation
├── swagger.yaml          # OpenAPI Specification
├── README.md            # Project Overview
└── PROJECT_DETAILS.md   # This file
```

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
│  Next.js (SSR) + React 19 + Tailwind CSS + shadcn/ui  │
│  (Port 3001)                                            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API Calls
                     │ (CORS enabled)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  API LAYER                              │
│  Express 5.x + TypeScript + Better-Auth                │
│  (Port 3000)                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes & Controllers (Handlers)                  │   │
│  │ ├─ /api/courses      (Course Management)         │   │
│  │ ├─ /api/lessons      (Lesson Management)         │   │
│  │ ├─ /api/enrollments  (User Enrollments)          │   │
│  │ ├─ /api/stripe       (Payment Processing)        │   │
│  │ ├─ /api/s3           (File Storage)              │   │
│  │ ├─ /api/admin        (Admin Dashboard)           │   │
│  │ └─ /api/auth         (Authentication)            │   │
│  └──────────────────────────────────────────────────┘   │
└────────┬──────────────────────────────────────┬─────────┘
         │                                      │
    Services Layer                      Middleware Layer
    (Business Logic)                    (Auth, Rate Limit,
    ├─ course.service                   Error Handling)
    ├─ enrollment.service
    ├─ stripe.service
    ├─ s3.service
    ├─ lesson.service
    ├─ admin.service
    └─ auth.service
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│  PostgreSQL (Neon) + Prisma ORM                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Models: User, Course, Chapter, Lesson, Enrollment   │
│  │ Real-time relationships & cascading deletes      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

External Services:
├─ Stripe (Payment Processing)
├─ AWS S3 / Tigris (File Storage)
├─ Better-Auth (Authentication)
├─ Nodemailer (Email Notifications)
├─ Arcjet (Security & Rate Limiting)
└─ Redis (Optional Caching)
```

---

## 📦 Technology Stack Analysis

### Why Each Technology?

#### **Backend Stack**

| Technology | Purpose | Why Chosen |
|-----------|---------|-----------|
| **Express 5.x** | Web Server & Routing | Light, fast, industry standard. Handles HTTP requests efficiently |
| **TypeScript** | Type Safety | Catches errors at compile time, improves maintainability, self-documenting code |
| **Node.js 18+** | Runtime | Non-blocking I/O, excellent for real-time applications & APIs |
| **PostgreSQL (Neon)** | Primary Database | Reliable, ACID compliant, excellent relational data support |
| **Prisma ORM** | Database Access | Type-safe queries, auto-migration, excellent DX, prevents SQL injection |
| **Better-Auth** | Authentication | OAuth2 + Email/Password support, session management, minimal setup |
| **Stripe API** | Payment Processing | Industry-leading, secure, handles subscription & one-time payments |
| **AWS S3** | File Storage | Scalable, reliable, global distribution, cost-effective |
| **Arcjet** | Security & DDoS | Rate limiting, bot detection, shields against malicious requests |
| **Nodemailer** | Email Service | SMTP support, HTML templates, reliable delivery |
| **Zod** | Input Validation | Runtime schema validation, TypeScript inference |
| **Redis** | Caching (Optional) | In-memory cache for improved performance on repeated requests |

#### **Frontend Stack**

| Technology | Purpose | Why Chosen |
|-----------|---------|-----------|
| **Next.js 16** | React Framework | Server-side rendering, automatic code splitting, file-based routing, image optimization |
| **React 19** | UI Library | Component-based, unidirectional data flow, large ecosystem |
| **Tailwind CSS 4** | Styling | Utility-first, rapid UI development, consistent design system |
| **shadcn/ui** | Component Library | Accessible, customizable, built on Radix UI primitives |
| **React Hook Form** | Form Handling | Low re-renders, small bundle size, easy validation |
| **Framer Motion** | Animations | Smooth, performant animations, spring physics |
| **Recharts** | Data Visualization | React components, responsive charts for analytics |
| **Tiptap** | Rich Text Editor | Extensible, performant, WYSIWYG editing |
| **dnd-kit** | Drag & Drop | Accessibility-first, keyboard support, modern API |
| **Sonner** | Toast Notifications | Minimal, accessible, beautiful UX |
| **Better-Auth Client** | Authentication | Seamless session sync with backend |

---

## 📂 Backend Folder Structure & Purpose

### `/src/app.ts` - Express Application Setup
```typescript
// Main Express app initialization
// CORS configuration for cross-origin requests
// Middleware registration in correct order
// Route mounting
// Error handling setup
```
**Why:** Centralizes app configuration, separates concerns from server startup

### `/src/server.ts` - Server Entry Point
```typescript
// Imports and starts the Express app
// Listens on PORT 3000
// Logs server information
```
**Why:** Clean separation between app logic and server startup

### `/src/config/` - Configuration Management

#### `env.ts`
- **Purpose:** Environment variable validation using Zod
- **Why:** Type-safe access to env vars, fails fast if required vars missing
- **Key Variables:**
  - Database URL (PostgreSQL connection)
  - Authentication secrets
  - API keys (Stripe, AWS, Arcjet)
  - Email configuration
  - Frontend/Auth URLs (for CORS)

#### `arcjet.ts`
- **Purpose:** DDoS protection and rate limiting configuration
- **Why:** Prevents abuse, protects API from malicious requests
- **Rules Applied:**
  - Shield mode (detects suspicious patterns)
  - Fixed window rate limiting

#### `s3.ts`
- **Purpose:** AWS S3 client configuration
- **Why:** Centralized file storage client, reused across services
- **Uses:** Presigned URLs for secure uploads/downloads

#### `stripe.ts`
- **Purpose:** Stripe API client initialization
- **Why:** Isolated payment service configuration
- **Version:** Latest (2026-01-28)

### `/src/routes/` - API Route Definitions

Routes define the API endpoints and attach middleware/controllers:

#### `auth.routes.ts`
- **Endpoints:**
  - `/api/auth/*` → Better-Auth (handles all auth operations)
  - `/api/auth/signin`
  - `/api/auth/signup`
  - `/api/auth/signout`
  - `/api/auth/verify-otp`

#### `course.routes.ts`
- **Public Routes:**
  - `GET /api/courses` → Get all published courses
  - `GET /api/courses/:slug` → Get individual course details
- **Protected Routes:**
  - `GET /api/courses/:slug/sidebar` → Get course sidebar with user progress (requires authentication + enrollment)

#### `lesson.routes.ts`
- **Protected:** Requires user authentication
- **Functions:** Lesson content delivery, progress tracking

#### `enrollment.routes.ts`
- **Protected:** Requires user authentication
- **Endpoints:**
  - `GET /api/enrollments` → Get user's enrolled courses
  - `GET /api/enrollments/check/:courseId` → Check if user enrolled

#### `stripe.routes.ts`
- **Protected:** Requires user authentication + rate limiting
- **Endpoints:**
  - `POST /api/stripe/checkout` → Create checkout session
  - `POST /api/webhooks/stripe` → Handle payment webhooks

#### `s3.routes.ts`
- **Protected:** Requires admin authentication + rate limiting
- **Endpoints:**
  - `POST /api/s3/upload` → Generate presigned upload URL
  - `DELETE /api/s3/delete` → Delete file from S3

#### `admin.routes.ts`
- **All Protected:** Requires admin role authentication
- **Endpoints:**
  - Course CRUD operations
  - Chapter management (create, delete, reorder)
  - Lesson management (CRUD + reorder)
  - Dashboard statistics
  - Analytics data

### `/src/controllers/` - Request Handlers

Controllers handle HTTP requests, call services, and return responses:

#### `course.controller.ts`
```
Request → Validate params/body → Call courseService
                                       ↓
                              Return formatted response
```

#### `enrollment.controller.ts`
- `getEnrolledCourses()` → Fetches all courses user enrolled in
- `checkEnrollment()` → Checks if user can access course

#### `stripe.controller.ts`
- `createCheckout()` → Initiates payment checkout
- `handleWebhook()` → Processes Stripe webhook events (payment confirmation)

#### `admin.controller.ts`
- Course management (create, edit, delete)
- Chapter management (create, delete, reorder)
- Lesson management (CRUD, reorder)
- Dashboard statistics

#### `s3.controller.ts`
- `generateUploadUrl()` → Creates presigned URL for secure uploads
- `deleteFile()` → Removes file from S3

#### `auth.controller.ts`
- Uses Better-Auth for all operations
- Custom email OTP logic in `lib/auth.ts`

### `/src/services/` - Business Logic Layer

Services contain reusable business logic, called by controllers:

#### `course.service.ts`
```typescript
// Services:
getAllCourses()           // Query published courses
getIndividualCourse()     // Get course with chapters & lessons
getCoursesSidebarData()   // Get course structure + user progress

// Why separated:
- Reusable across multiple controllers
- Testable independently
- Prisma queries centralized
- Easy to modify queries without touching controllers
```

#### `enrollment.service.ts`
```typescript
// Services:
getEnrolledCourses()      // Query user enrollments with course data
checkIfCourseBought()     // Boolean check if user can access
createPendingEnrollment() // Create pending enrollment after checkout
updateEnrollment()        // Confirm enrollment after payment
```

#### `stripe.service.ts`
```typescript
// Services:
createCheckoutSession()   // Create Stripe session
constructWebhookEvent()   // Parse & verify webhook
handleCheckoutSessionCompleted() // Update enrollment on payment success
handleCheckoutSessionExpired()   // Handle payment timeouts
```

#### `lesson.service.ts`
- Get lesson details
- Update lesson progress
- Mark lessons as complete

#### `admin.service.ts`
- Course CRUD operations
- Chapter/lesson management
- Dashboard statistics calculation

#### `s3.service.ts`
- Generate presigned upload URLs
- Delete files
- Manage file permissions

### `/src/middleware/` - Request Processing

Middleware functions process requests before they reach controllers:

#### `requireUser.ts`
```typescript
// Purpose: Authenticate user
// Flow:
1. Extract session from request headers
2. Call Better-Auth API to verify session
3. If valid: attach user & session to req object
4. If invalid: return 401 Unauthorized

// Used by: All user-facing routes
```

#### `requireAdmin.ts`
```typescript
// Purpose: Verify admin access
// Flow:
1. Call requireUser logic (verify session)
2. Check if user.role === "admin"
3. If not: return 403 Forbidden

// Used by: All admin routes
```

#### `rateLimit.ts`
```typescript
// Purpose: Prevent abuse via rate limiting
// Implementation: Arcjet with fixed window
// Example usage:
const checkoutRateLimiter = createRateLimiter({ window: "1m", max: 5 })
- 5 checkout requests per minute
- Returns 429 if exceeded

// Why: 
- Stripe checkout abuse prevention
- S3 upload abuse prevention
- Cost control
```

#### `errorHandler.ts`
```typescript
// Purpose: Centralized error handling
// Catches errors from async middleware/routes
// Formats error response with status code
// Logs errors for debugging

// Error flow:
try-catch → throw error → errorHandler middleware → formatted response
```

### `/src/lib/` - Shared Utilities

#### `auth.ts`
```typescript
// Better-Auth configuration
// Email OTP plugin setup
// Admin plugin setup
// Cookie configuration (cross-domain support for dev)
// OAuth2 GitHub integration

// Why Better-Auth:
- Handles complex auth flows
- Provides session management
- Supports multiple auth methods
- Manages user state
```

#### `prisma.ts`
```typescript
// Singleton Prisma client instance
// Prevents multiple DB connections
// Exports to be used across services
```

#### `nodemailer.ts`
```typescript
// SMTP configuration
// Email templates (OTP verification email)
// sendEmail() function

// Features:
- HTML email templates
- Text fallback
- Custom from address
- TLS/SSL support
```

#### `redis.ts`
```typescript
// Optional Redis client (commented out if not used)
// For caching frequently accessed data
// Improves performance for repeated queries
```

### `/src/types/` - TypeScript Definitions

#### `index.ts`
```typescript
export type ApiResponse<T = unknown> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

// Used in all API responses for consistency
```

### `/src/validators/` - Input Validation

#### `zodSchemas.ts`
```typescript
// Define schemas for:
- Course creation/update
- Chapter management
- Lesson management
- Validation rules
- Custom error messages

// Why Zod:
- Runtime validation (not just TypeScript)
- Beautiful error messages
- Composable schemas
- Type inference
```

---

## 📂 Frontend Folder Structure & Purpose

### `/app/` - Next.js App Router

#### `layout.tsx`
- Root layout wrapping entire app
- Theme provider (dark/light mode)
- Toaster for notifications
- Global CSS imports
- Font configuration (Hanken Grotesk)

#### `/(public)/` - Public Routes
```
/                     → Home page with features & CTA
/courses             → Browse all published courses
/courses/[slug]     → Individual course details page
```
**Protected By:** No authentication required

#### `/(auth)/` - Authentication Routes
```
/login              → Email/password login
/signup             → Create account
/verify-request     → OTP verification
```
**Flow:** 
1. Enter email
2. Receive OTP via email
3. Verify OTP
4. Redirected to dashboard/courses

#### `/dashboard/` - User Dashboard
```
/dashboard          → Main dashboard (course overview)
/dashboard/[slug]  → Enrolled course details (sidebar, progress)
```
**Protected By:** User authentication required
**Features:**
- Sidebar with enrolled courses
- Lesson progress tracking
- Chapter/lesson navigation

#### `/admin/` - Admin Panel
```
/admin                     → Dashboard with statistics
/admin/courses            → Manage all courses
/admin/courses/[id]      → Edit specific course
/admin/courses/create    → Create new course
```
**Protected By:** Admin role required
**Features:**
- Course CRUD
- Chapter/lesson management
- Drag-and-drop reordering
- Analytics dashboard

### `/components/` - Reusable React Components

#### `auth/` - Authentication Components
- Login form
- Signup form
- OTP input
- Session management wrapper

#### `file-uploader/` - File Upload
- `Uploader.tsx` → Handles drag-drop & file selection
- `RenderState.tsx` → Shows upload progress/status
**Uses:** Presigned S3 URLs for secure uploads

#### `rich-text-editor/` - Course Description Editor
- `Editor.tsx` → Tiptap rich text editor
- `Menubar.tsx` → Formatting toolbar
- `RenderDescription.tsx` → Display rendered HTML

#### `general/` - Generic Components
- `EmptyState.tsx` → No data state UI

#### `sidebar/` - Navigation & Layout
- `app-sidebar.tsx` → Main navigation sidebar
- `site-header.tsx` → Header with user profile
- `nav-main.tsx` → Main navigation items
- `nav-documents.tsx` → Course navigation
- `data-table.tsx` → Reusable data table
- Analytics charts

#### `ui/` - shadcn/ui Components
- Button, Card, Dialog, Input, etc.
- Theme provider (dark/light mode)
- All accessible, fully customizable

### `/app/globals.css` - Global Styles
```css
Tailwind CSS directives
Custom CSS variables
Theme-specific styles
Animation definitions
```

### `/lib/` - Frontend Utilities

#### `api.ts`
```typescript
// Base API client function
// Handles:
- Credential inclusion (cookies)
- Error handling
- Response parsing
- Server-side vs client-side fetching

// Key Functions:
fetchApi<T>()         // Client-side API calls
fetchApiServer<T>()   // Server-side API calls (with cookies)
```

#### `auth-client.ts`
```typescript
// Better-Auth client configuration
// Exported functions:
signIn()
signUp()
signOut()
useSession() // React hook for session data

// Plugins:
- emailOTPClient()
- adminClient()
```

#### `env.ts`
```typescript
// Frontend environment variables
// API URL configuration
// Public-facing vars only (NEXT_PUBLIC_*)
```

#### `types.ts`
```typescript
export type ApiResponse = {
  status: "success" | "error";
  message: string;
  data?: unknown;
};
```

#### `zodSchemas.ts`
```typescript
// Same validation schemas as backend
// Ensures frontend & backend validation match
// Helper functions:
mapFormToPrisma() // Convert UI enums to DB format
```

#### `utils.ts`
```typescript
// Utility functions:
- String formatting
- Date formatting
- Type guards
- Common calculations
```

### `/hooks/` - Custom React Hooks

#### `use-session.ts`
- Get current user session
- Check authentication status

#### `use-arcjet-protection.ts`
- Client-side Arcjet integration
- Bot detection

#### `use-mobile.ts`
- Responsive design helper
- Mobile breakpoint detection

#### `use-course-progress.ts`
- Calculate course progress percentage
- Track lesson completion

#### `use-signout.ts`
- Handle user logout
- Clear session
- Redirect to home

#### `try-catch.ts`
- Wrapper for API calls
- Unified error handling

### `/public/` - Static Assets
```
favicon.png
images/
logos/
```

---

## 🔄 Data Flow Diagrams

### User Authentication Flow

```
Frontend (Login Page)
        ↓ (POST /api/auth/email)
Better-Auth API
        ↓
Verify email format
        ↓
Generate OTP
        ↓
Send email via Nodemailer
        ↓
Frontend (OTP Verification)
        ↓ (POST /api/auth/verify-otp)
Better-Auth API
        ↓
Create session
        ↓
Set secure HttpOnly cookie
        ↓
Frontend redirected to Dashboard
```

### Course Enrollment & Payment Flow

```
User clicks "Enroll Course"
        ↓
Frontend calls POST /api/stripe/checkout
        ↓ (requireUser middleware)
Backend validates user
        ↓
Check if already enrolled
        ↓
Create Stripe Checkout Session
        ↓
Return checkout URL to frontend
        ↓
Frontend redirects to Stripe Checkout
        ↓
User completes payment on Stripe
        ↓
Stripe sends webhook to /api/webhooks/stripe
        ↓
Backend verifies webhook signature
        ↓
Update enrollment status to "Completed"
        ↓
Update user's stripeCustomerId
        ↓
Frontend detects enrollment complete
        ↓
User can access course content
```

### Lesson Progress Tracking

```
User views lesson
        ↓
Frontend fetches course sidebar
GET /api/courses/:slug/sidebar
        ↓
Backend queries:
- Course info
- All chapters
- All lessons
- User's lesson progress (LessonProgress records)
        ↓
Returns progress status for each lesson
        ↓
Frontend marks completed lessons
        ↓
Displays progress bar:
completed_lessons / total_lessons
```

### Admin Course Creation Flow

```
Admin goes to /admin/courses/create
        ↓
Frontend: Rich text editor + form fields
        ↓
Admin uploads banner image
        ↓
Frontend calls POST /api/s3/upload
        ↓ (requireAdmin middleware)
Backend generates presigned URL
        ↓
Frontend uploads directly to S3
        ↓
Returns S3 file key
        ↓
Admin creates course with form data + S3 keys
        ↓
Frontend calls POST /api/admin/courses
        ↓ (requireAdmin middleware)
Backend:
- Validates with Zod schemas
- Creates course in DB
- Generates Stripe product & price ID
- Returns created course
        ↓
Admin can add chapters & lessons
        ↓
Can drag-drop to reorder
        ↓
Calls PUT /api/admin/chapters/reorder
        ↓
Backend updates position field
        ↓
Frontend shows updated order
```

---

## 🗄️ Database Schema Overview

### User Model
```prisma
User {
  id: String              // CUID (unique identifier)
  name: String
  email: String          // Unique
  emailVerified: Boolean
  image: String?
  role: String           // "user" or "admin"
  banned: Boolean
  banReason: String?
  banExpires: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
  stripeCustomerId: String? // Links to Stripe
  
  Relationships:
  ├─ courses[]           // Courses created by user
  ├─ enrollment[]        // Courses user enrolled in
  ├─ sessions[]          // Active sessions
  ├─ accounts[]          // OAuth connections
  └─ lessonProgress[]    // Lesson completion tracking
}
```

### Course Model
```prisma
Course {
  id: String              // UUID
  title: String
  description: String     // Full course description
  smallDescription: String // For course cards (max 200 chars)
  fileKey: String        // S3 key for course banner
  price: Int             // In cents (e.g., 9999 = $99.99)
  duration: Int          // Total hours
  level: CourseLevel     // BEGINNER, INTERMEDIATE, ADVANCED
  category: String       // Course category
  slug: String           // URL-friendly (unique)
  status: CourseStatus   // DRAFT, PUBLISHED, ARCHIVED
  stripePriceId: String  // Links to Stripe price
  userId: String         // Creator
  createdAt: DateTime
  updatedAt: DateTime
  
  Relationships:
  ├─ user                // Course creator
  ├─ chapter[]           // Chapters in course
  └─ enrollment[]        // Student enrollments
}
```

### Chapter Model
```prisma
Chapter {
  id: String      // UUID
  title: String
  position: Int   // Order in course
  createdAt: DateTime
  updatedAt: DateTime
  courseId: String // Parent course
  
  Relationships:
  ├─ course       // Parent course
  └─ lessons[]    // Lessons in chapter
}
```

### Lesson Model
```prisma
Lesson {
  id: String           // UUID
  title: String
  description: String?
  thumbnailKey: String? // S3 key for lesson thumbnail
  videoKey: String?    // S3 key for video file
  position: Int        // Order in chapter
  chapterId: String    // Parent chapter
  createdAt: DateTime
  updatedAt: DateTime
  
  Relationships:
  ├─ chapter       // Parent chapter
  └─ lessonProgress[] // Student progress
}
```

### Enrollment Model
```prisma
Enrollment {
  id: String      // UUID
  courseId: String
  userId: String
  status: EnrollmentStatus // Pending, Completed, Cancelled
  amount: Int     // Price paid in cents
  createdAt: DateTime
  updatedAt: DateTime
  
  Unique Constraint: courseId + userId (one enrollment per user per course)
}
```

### LessonProgress Model
```prisma
LessonProgress {
  id: String      // UUID
  userId: String
  lessonId: String
  completed: Boolean // Lesson completed?
  createdAt: DateTime
  updatedAt: DateTime
  
  Unique Constraint: userId + lessonId
}
```

### Session Model (Better-Auth)
```prisma
Session {
  id: String
  token: String      // Unique session token
  expiresAt: DateTime
  userId: String
  ipAddress: String?
  userAgent: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Account Model (OAuth)
```prisma
Account {
  id: String
  userId: String
  providerId: String  // "github", "google", etc.
  accountId: String
  accessToken: String?
  refreshToken: String?
  idToken: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🔐 Security Implementation

### 1. Authentication

**Better-Auth Library:**
- Session-based authentication
- HTTP-only cookies (prevents XSS attacks)
- CSRF protection built-in
- OAuth2 support (GitHub)
- Email OTP verification

**Implementation:**
```typescript
// Session stored in database (session model)
// Token sent as secure cookie
// Verified on each protected route
// Expires after set duration
```

### 2. Authorization

**Role-Based Access Control (RBAC):**
- User roles: "user" or "admin"
- `requireUser` middleware for authenticated users
- `requireAdmin` middleware for admin-only routes
- Admin verification endpoint for frontend

### 3. Rate Limiting

**Arcjet Integration:**
```typescript
- DDoS shield (detects malicious patterns)
- Fixed window rate limiting
- Per-endpoint configuration:
  - Checkout: 5 requests/minute
  - S3 uploads: 20 requests/minute
  - Default: 10 requests/minute
```

**Prevents:**
- Checkout spam
- Large file uploads abuse
- Brute force attacks
- Bot traffic

### 4. Data Validation

**Zod Schemas:**
```typescript
- Runtime validation on all inputs
- Type-safe at compile time
- Custom error messages
- Prevents injection attacks
- Catches malformed data early
```

### 5. CORS Configuration

```typescript
app.use(cors({
  origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
  credentials: true,  // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
```

**Why:**
- Only approved origins can access API
- Prevents cross-site request forgery
- Allows credentials (cookies) only from trusted sources

### 6. File Upload Security

**S3 Presigned URLs:**
```
Admin → Request upload URL
      ← Get presigned URL (time-limited)
      → Upload directly to S3
      ← S3 confirms upload
```

**Benefits:**
- Files never pass through backend
- Time-limited URLs (expire after 1 hour)
- No exposed AWS credentials
- Server-side verification of file ownership

### 7. Payment Security

**Stripe:**
- PCI-DSS compliant payment processing
- Webhook signature verification
- No sensitive payment data stored locally
- Stripe handles card processing

### 8. Environment Secrets

**Zod Validation:**
```typescript
- All required env vars validated on startup
- Fails fast if any secret missing
- Type-safe access
- No secrets in code
```

---

## 📊 API Response Format

All API endpoints follow a consistent response format:

```typescript
{
  status: "success" | "error",
  message: string,
  data?: any  // Optional data object
}
```

**Examples:**

Success Response:
```json
{
  "status": "success",
  "message": "Courses fetched successfully",
  "data": [
    {
      "id": "course-123",
      "title": "Learn React",
      "slug": "learn-react",
      "price": 9999,
      "duration": 20
    }
  ]
}
```

Error Response:
```json
{
  "status": "error",
  "message": "User not authenticated",
  "data": null
}
```

---

## 🔄 Request-Response Cycle

### Example: Get Course Details

```
1. FRONTEND REQUEST
   GET /api/courses/learn-react
   Headers: {
     Cookie: session=abc123...
     Content-Type: application/json
   }

2. EXPRESS MIDDLEWARE CHAIN
   ├─ CORS Check ✓
   ├─ JSON Parser ✓
   ├─ Cookie Parser ✓
   └─ Router Matching → course.routes.ts

3. ROUTE HANDLER
   GET "/:slug" → courseController.getCourse()

4. CONTROLLER
   ├─ Extract slug from params
   ├─ Call courseService.getIndividualCourse(slug)
   └─ Return formatted response

5. SERVICE (BUSINESS LOGIC)
   ├─ Query Prisma:
   │  SELECT course WHERE slug = ?
   │  ├─ Include chapters
   │  └─ Include lessons
   └─ Return course with relationships

6. DATABASE (PostgreSQL)
   ├─ Query execution
   └─ Return result set

7. RESPONSE TO FRONTEND
   {
     "status": "success",
     "message": "Course fetched successfully",
     "data": {
       "id": "uuid",
       "title": "Learn React",
       "description": "...",
       "chapter": [
         {
           "id": "uuid",
           "title": "Chapter 1",
           "lessons": [...]
         }
       ]
     }
   }

8. FRONTEND PROCESSING
   ├─ Parse JSON
   ├─ Update React state
   ├─ Re-render UI with course data
   └─ Display to user
```

---

## 🚀 Performance Optimizations

### Backend

1. **Database Query Optimization**
   - Select only required fields (avoid `SELECT *`)
   - Use Prisma `select` to control returned data
   - Relationships loaded efficiently

2. **Rate Limiting**
   - Prevents abuse
   - Arcjet fingerprinting based on IP
   - Configurable per endpoint

3. **Caching (Optional)**
   - Redis integration available
   - Cache frequently accessed data
   - Reduce database queries

### Frontend

1. **Next.js Optimizations**
   - Code splitting (per route)
   - Image optimization (next/image)
   - Server-side rendering (SSR) for home page
   - Static site generation (SSG) where applicable

2. **React Optimizations**
   - Babel React compiler (auto memoization)
   - Custom hooks for reusable logic
   - React 19 optimizations

3. **Bundle Size**
   - Tailwind CSS purging unused styles
   - Tree-shaking dependencies
   - Dynamic imports for heavy components

4. **Caching**
   - Browser caching (far-future expires)
   - HTTP cache headers
   - Stale-while-revalidate

---

## 📈 Scalability Considerations

### Current Setup
- Express single instance
- PostgreSQL (Neon) - handles multiple connections
- S3 for file storage (unlimited scale)
- Redis optional for caching

### For Production Scale

1. **Load Balancing**
   ```
   Load Balancer (HAProxy/Nginx)
         ↓
   ├─ Express Instance 1
   ├─ Express Instance 2
   └─ Express Instance 3
   ```

2. **Database Scaling**
   - Read replicas
   - Connection pooling (PgBouncer)
   - Query optimization & indexing

3. **Caching Layer**
   - Redis cluster
   - CDN for static assets
   - API response caching

4. **Monitoring**
   - Logging (ELK stack, DataDog)
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - Health checks

---

## 🔧 Development Workflow

### Setup Instructions

#### Backend
```bash
cd lms-backend
pnpm install
cp .env.example .env
# Fill in environment variables

pnpm run db:push        # Push schema to database
pnpm run dev           # Start development server (port 3000)
```

#### Frontend
```bash
cd lms-frontend
pnpm install
cp .env.example .env
# Set NEXT_PUBLIC_API_URL=http://localhost:3000

pnpm run dev           # Start development server (port 3001)
```

### Environment Variables Required

**Backend (.env):**
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
AUTH_GITHUB_CLIENT_ID=...
AUTH_GITHUB_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=lms-bucket
ARCJET_KEY=ajk_...
EMAIL_HOST=smtp.provider.com
EMAIL_USER=noreply@example.com
EMAIL_PASSWORD=...
PORT=3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Signup with email
- [ ] Receive OTP email
- [ ] Verify OTP
- [ ] Login with credentials
- [ ] GitHub OAuth login
- [ ] Session persistence (refresh page)
- [ ] Logout

**User Features:**
- [ ] Browse courses
- [ ] Enroll in course (free)
- [ ] Make payment (Stripe test mode)
- [ ] Access course content
- [ ] Track lesson progress
- [ ] View progress percentage

**Admin Features:**
- [ ] Access admin panel (non-admin denied)
- [ ] Create new course
- [ ] Upload course banner
- [ ] Add chapters
- [ ] Add lessons
- [ ] Upload video/thumbnail
- [ ] Reorder chapters/lessons
- [ ] Edit course
- [ ] Delete course
- [ ] View analytics

**Error Cases:**
- [ ] Invalid login credentials
- [ ] Expired session
- [ ] Unauthorized access (non-admin accessing admin)
- [ ] File upload failure
- [ ] Payment failure
- [ ] Network timeout
- [ ] Database error

---

## 📚 Common Interview Questions & Answers

### Architecture & Design

**Q1: Why did you separate the frontend and backend?**

A: "This monorepo structure provides several advantages:
- Independent deployment pipelines
- Technology flexibility (can upgrade independently)
- Clear separation of concerns (frontend UI/logic vs API)
- Different scaling patterns (frontend CDN, backend API instances)
- Team separation (frontend developers vs backend developers)
- Easier testing and debugging"

**Q2: Why use Express instead of other Node.js frameworks?**

A: "Express is the industry standard for RESTful APIs because:
- Mature ecosystem with extensive middleware
- Lightweight with minimal overhead
- Great for building APIs quickly
- Good performance
- Easy debugging and monitoring
- Large community support

We could have used Fastify for more performance, but Express provides the right balance of speed and developer experience for this project."

**Q3: Why PostgreSQL instead of MongoDB?**

A: "PostgreSQL is better for this project because:
- Strong relational data (courses → chapters → lessons)
- ACID compliance ensures data consistency (important for payments)
- Complex queries with joins (course + progress + enrollment data)
- Better for structured data with defined schema
- More cost-effective for this use case

NoSQL like MongoDB would be better if we had unstructured or semi-structured data."

### Authentication & Security

**Q4: How does session management work?**

A: "Better-Auth handles session management:
1. User logs in with email + password
2. Backend generates session token
3. Session stored in database with user ID, expiry, IP, user agent
4. Token sent as HTTP-only, secure cookie to frontend
5. On subsequent requests, frontend sends cookie
6. Backend verifies token exists, hasn't expired, and matches user
7. If valid, attaches user object to request
8. If invalid or expired, returns 401 Unauthorized

HTTP-only cookies prevent XSS attacks since JavaScript cannot access them."

**Q5: How is payment security handled?**

A: "We use Stripe for PCI-DSS compliance:
1. User clicks 'Enroll' → creates checkout session
2. Frontend redirected to Stripe's hosted checkout (user never enters card on our site)
3. User enters card details on Stripe's secure page
4. Stripe processes payment and sends webhook
5. We verify webhook signature with our secret key
6. Only after verified webhook, we update enrollment status
7. No sensitive payment data stored locally
8. Stripe handles all fraud detection and security

This approach is much more secure than processing payments ourselves."

### Data & Performance

**Q6: How do you optimize database queries?**

A: "Several strategies:
1. **Select only required fields**: Instead of SELECT *, we use Prisma's select to return only needed data
2. **Relationships optimization**: Load related data efficiently without N+1 queries
3. **Indexing**: Primary key on id, unique on email/slug, foreign key indexes
4. **Query caching**: Redis for frequently accessed data
5. **Connection pooling**: Manage database connections efficiently
6. **Pagination**: For large result sets, implement pagination

Example: When fetching course sidebar, we select:
- Course: title, duration, fileKey
- Chapters: id, title
- Lessons: id, title
- LessonProgress: completed status

Not the entire course object."

**Q7: How do you track course progress?**

A: "LessonProgress model creates a relationship between User and Lesson:
1. When user completes a lesson, create/update LessonProgress record
2. Record stores: userId, lessonId, completed (boolean)
3. Unique constraint on userId + lessonId (prevents duplicates)
4. When fetching course sidebar:
   - Query course with all chapters and lessons
   - For each lesson, query LessonProgress for current user
   - Frontend calculates: completed_lessons / total_lessons
5. Progress persists across sessions (stored in DB)

This allows:
- Accurate progress tracking
- Resume from last viewed lesson
- Progress statistics
- Incomplete course detection"

### File Handling

**Q8: How does file upload work with S3?**

A: "We use presigned URLs for secure uploads:

1. Admin clicks upload button
2. Frontend calls POST /api/s3/upload
3. Backend generates presigned URL:
   - Valid for 1 hour
   - Only allows PUT requests
   - To specific S3 path
4. Frontend receives URL
5. Frontend uploads file directly to S3 (bypasses backend)
6. Returns file key to save in database
7. When serving, generate presigned download URL

Benefits:
- Files never pass through backend (saves bandwidth)
- Time-limited URLs prevent sharing
- No AWS credentials exposed to frontend
- Can delete files later using file key
- Scales to any file size

The file key is stored in database, allowing us to:
- Delete old files when course is updated
- Generate download links for users
- Track file ownership"

### Business Logic

**Q9: What happens during course enrollment with payment?**

A: "Complete enrollment flow:

1. User clicks 'Enroll' on course detail page
2. Frontend: POST /api/stripe/checkout with courseId
3. Backend (requireUser middleware): Verify user authenticated
4. Backend: Check if user already enrolled (avoid double payment)
5. Backend: Create Stripe Checkout Session with:
   - Course price
   - Course title
   - User email
   - Success/cancel URLs
6. Return checkout URL to frontend
7. Frontend: Redirect to Stripe checkout page
8. User: Enters card details on Stripe
9. Stripe: Processes payment

10. Payment Complete:
    - Stripe sends webhook to /api/webhooks/stripe
    - Backend verifies webhook signature (prevents forgery)
    - Backend finds enrollment matching session
    - Updates enrollment status: Pending → Completed
    - Updates user.stripeCustomerId (for future purchases)
    - Stripe customer link prevents duplicate charges

11. Frontend: Detects enrollment complete
    - Redirects to /dashboard/[slug]
    - User can now access course

12. If payment fails:
    - Stripe sends checkout.session.expired event
    - Enrollment status remains Pending
    - User can retry checkout"

**Q10: How are admin operations protected?**

A: "Admin operations have multiple layers of protection:

1. **requireAdmin middleware**:
   - Verifies user is logged in
   - Checks user.role === 'admin'
   - Returns 403 Forbidden if not admin

2. **Frontend verification**:
   - Fetch /api/admin/verify endpoint
   - Only show admin UI if response is 200

3. **Rate limiting**:
   - S3 uploads: 20 requests/minute
   - Prevents abuse

4. **Input validation**:
   - Zod schemas for all inputs
   - Prevents malformed data

5. **Audit trail**:
   - All operations logged
   - User ID tracked on created/updated records

6. **Data ownership**:
   - When fetching admin courses, query by user ID
   - Prevents accessing other admin's courses"

### Error Handling

**Q11: How do you handle errors?**

A: "Three-layer error handling:

1. **Route level**: Try-catch blocks in controllers
2. **Service level**: Validation and business logic errors
3. **Middleware level**: Global error handler

Flow:
```
Request → Middleware → Route → try-catch
                       ↓ error
                    throw error
                       ↓
                   errorHandler middleware
                       ↓
            Format response with status code
                       ↓
          {status: 'error', message: '...'}
```

Types of errors:
- 400: Bad request (validation failed)
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 404: Not found (resource doesn't exist)
- 429: Too many requests (rate limited)
- 500: Internal server error (unexpected)

Frontend:
- Catches error responses
- Shows user-friendly toasts (Sonner)
- Logs errors for debugging (console)
- Retries on network errors (optional)"

---

## 💡 Key Design Decisions

### 1. MVC Architecture
```
Routes → Controllers → Services → Database
          ↑                         ↓
          └─────── Middleware ──────┘
```
**Why:** Separation of concerns, testability, maintainability

### 2. API-First Design
- Frontend and backend communicate via REST API
- Can scale frontend and backend independently
- Easy to add mobile app later (uses same API)

### 3. Type Safety
- TypeScript on both frontend and backend
- Zod runtime validation
- Catches errors at compile time

### 4. Database Normalization
- Proper relational schema
- Prevents data duplication
- Ensures data consistency

### 5. Service Layer Abstraction
- Controllers don't directly query database
- Business logic centralized in services
- Easier to test and reuse logic

---

## 🎯 Interview Talking Points Summary

**1. Architecture:**
- Monorepo with separated frontend/backend
- MVC pattern with service layer
- RESTful API design
- Type-safe with TypeScript + Zod

**2. Technology Choices:**
- Express for lightweight, fast API
- PostgreSQL for relational data
- Next.js for modern frontend
- Stripe for secure payments
- S3 for scalable file storage

**3. Security:**
- Better-Auth for session management
- CORS configuration
- Rate limiting with Arcjet
- HTTP-only cookies
- Presigned URLs for file uploads
- Webhook signature verification

**4. Performance:**
- Selective field queries
- Database indexing
- Optional caching with Redis
- Frontend code splitting
- Image optimization

**5. Scalability:**
- Stateless API (can be load-balanced)
- Database ready for replication
- S3 handles unlimited files
- Optional Redis for caching

**6. Best Practices:**
- Consistent error handling
- Input validation at every step
- Proper HTTP status codes
- Clean separation of concerns
- Comprehensive logging
- Environment-based configuration

---

## 📖 How to Use This Document for Interviews

1. **Before Interview:**
   - Read this document completely
   - Understand each folder's purpose
   - Be ready to draw architecture diagrams
   - Practice explaining data flows

2. **During Interview:**
   - Use diagrams and flows from this document
   - Reference specific technologies and why
   - Connect technical decisions to business requirements
   - Show understanding of trade-offs

3. **Common Questions to Expect:**
   - "Walk me through the authentication flow"
   - "How do you ensure data consistency?"
   - "What would you do differently?"
   - "How do you handle scale?"
   - "How do you secure sensitive data?"
   - "Walk me through payment processing"

4. **Answer Structure:**
   - Start with the big picture
   - Drill down into specific components
   - Explain why decisions were made
   - Discuss trade-offs and alternatives

---

## 🔗 File Cross-References

When preparing for interviews, reference these files:

**Authentication Flow:**
- [lms-backend/src/lib/auth.ts](lms-backend/src/lib/auth.ts) - Better-Auth config
- [lms-backend/src/middleware/requireUser.ts](lms-backend/src/middleware/requireUser.ts) - Session verification
- [lms-frontend/lib/auth-client.ts](lms-frontend/lib/auth-client.ts) - Frontend client

**Payment Processing:**
- [lms-backend/src/controllers/stripe.controller.ts](lms-backend/src/controllers/stripe.controller.ts) - Checkout & webhooks
- [lms-backend/src/services/stripe.service.ts](lms-backend/src/services/stripe.service.ts) - Stripe business logic

**Course Management:**
- [lms-backend/src/routes/admin.routes.ts](lms-backend/src/routes/admin.routes.ts) - Admin endpoints
- [lms-backend/src/controllers/admin.controller.ts](lms-backend/src/controllers/admin.controller.ts) - Admin handlers
- [lms-backend/src/services/admin.service.ts](lms-backend/src/services/admin.service.ts) - Admin logic

**Database Schema:**
- [lms-backend/prisma/schema.prisma](lms-backend/prisma/schema.prisma) - Complete data model

**File Uploads:**
- [lms-backend/src/controllers/s3.controller.ts](lms-backend/src/controllers/s3.controller.ts) - Upload handlers
- [lms-backend/src/services/s3.service.ts](lms-backend/src/services/s3.service.ts) - S3 operations

---

## 📞 Quick Reference

**When asked "How does [feature] work?"**

| Feature | Key Files | Key Concept |
|---------|-----------|------------|
| Authentication | auth.ts, requireUser.ts | Better-Auth + Sessions |
| Payments | stripe.controller.ts, stripe.service.ts | Stripe Checkout + Webhooks |
| File Upload | s3.controller.ts, s3.service.ts | Presigned URLs |
| Course Access | course.service.ts, enrollment.service.ts | Database queries |
| Admin Panel | admin.controller.ts, requireAdmin.ts | Role-based access control |
| Progress Tracking | LessonProgress model, enrollment.service.ts | Database relationships |

---

## Final Notes

This LMS is a **production-ready** platform demonstrating:
- ✅ Secure authentication & authorization
- ✅ Payment processing integration
- ✅ Scalable architecture
- ✅ Type safety
- ✅ Performance optimizations
- ✅ Clean code organization
- ✅ Industry best practices

You're ready for interviews! Good luck! 🚀
