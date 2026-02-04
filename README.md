# LMS Project - Full Stack Learning Management System

A modern, scalable learning management system built with **Next.js**, **Express**, and **PostgreSQL**. Features real-time enrollment, payment processing, and admin analytics.

## 🏗️ Architecture

```
LMS-Project/
├── lms-backend/     # Express API server
├── lms-frontend/    # Next.js application
└── README.md
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express 5.x (TypeScript)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: Better-Auth (OAuth + Email)
- **Payments**: Stripe API
- **File Storage**: AWS S3/Tigris
- **Security**: Arcjet (Rate limiting & DDoS protection)
- **API Style**: RESTful

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Charts**: Recharts (interactive pie charts)
- **Authentication**: Client-side session management
- **State**: React hooks + server-side data fetching

### Key Libraries
- **ORM**: Prisma 7.x
- **Email**: Nodemailer
- **Validation**: Zod
- **Icons**: Lucide React
- **Toast**: Sonner

---

## ⚙️ Configuration & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Redis (optional, for caching - improves performance)
- Stripe account
- GitHub OAuth app
- AWS S3/Tigris bucket
- Arcjet account (free tier available)

### 1️⃣ Clone & Install

```bash
git clone <repo-url>
cd LMS-Project

# Install backend dependencies
cd lms-backend
pnpm install

# Install frontend dependencies
cd ../lms-frontend
pnpm install
```

### 2️⃣ Database Setup

```bash
cd lms-backend

# Copy env file
cp .env.example .env.local

# Update DATABASE_URL in .env.local with your Neon PostgreSQL connection string

# Run migrations
pnpm prisma migrate dev

# (Optional) Open Prisma Studio to view data
pnpm prisma studio
```

### 3️⃣ Backend Configuration

Create `lms-backend/.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/lms_db

# Redis (for caching - optional, will use localhost:6379 by default)
REDIS_URL=redis://localhost:6379

# Authentication (Better-Auth)
BETTER_AUTH_SECRET=your-secure-random-secret-here
BETTER_AUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-oauth-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS S3 / Tigris
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1

# Arcjet
ARCJET_KEY=ajk_...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```


---

## 🚀 Running the Application

### Optional: Start Redis (for caching)

For improved performance, start a Redis server:

**Windows (with WSL):**
```bash
# Install Redis in WSL (one-time only)
wsl -d docker-desktop -e apk add --no-cache redis

# Start Redis as a daemon
wsl -d docker-desktop -e redis-server --daemonize yes

# Verify it's working
wsl -d docker-desktop -e redis-cli ping
# Should return: PONG
```

**Linux/Mac (local Redis installation):**
```bash
redis-server
```

**Note:** If Redis is not running, the app will still work but without caching benefits. Cached queries will fall back to direct database queries.

### Start Backend (Terminal 1)

```bash
cd lms-backend
pnpm dev
# Runs on http://localhost:3000
```

### Start Frontend (Terminal 2)

```bash
cd lms-frontend
pnpm dev
# Runs on http://localhost:3001
```

### Dev commands

- `pnpm studio`: Open Prisma Studio for inspecting the database (run from the `lms-backend` folder so it reads the backend `.env`).

- `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`: Forward Stripe CLI events to the local backend webhook route (run in a separate terminal).

Copyable examples:

```bash
# Open Prisma Studio (backend)
cd lms-backend
pnpm studio

# Forward Stripe events to local webhook
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

### Admin Dashboard
- URL: `http://localhost:3001/admin`
- Features: Real-time stats, monthly charts, course management, enrollment analytics
- **Performance**: Admin stats are cached with Redis (3-minute TTL) for faster loading

### User Dashboard
- URL: `http://localhost:3001/dashboard`
- Features: Enrolled courses, available courses, progress tracking

---

## 📊 Database Schema Highlights

### Key Tables
- **User**: User accounts (email, OAuth provider)
- **Course**: Course data (title, price, description, media)
- **Chapter**: Course chapters/sections
- **Lesson**: Individual lessons with video content
- **Enrollment**: User-Course relationships with payment status
- **LessonProgress**: User lesson completion tracking

### Enum Values
```
EnrollmentStatus: Pending | Completed | Cancelled
```

---

## 🔑 Key Features

### Authentication
- GitHub OAuth + Email/Password signup
- Session-based authentication (Better-Auth)
- Admin role verification via middleware
- Secure cookie configuration for cross-origin requests

### Payments & Enrollment
- Stripe payment processing
- Real-time enrollment status tracking
- Revenue analytics (aggregated by month)
- Webhook handling for payment events

### Admin Features
- Dashboard with real-time stats:
  - Total signups, customers, revenue, lessons
  - Monthly revenue pie chart
  - Monthly lessons pie chart
  - Recent course activity
  - Enrollment trends
- Course CRUD operations
- Chapter & lesson management
- File upload to S3/Tigris

### Security
- Arcjet rate limiting
- CORS configuration
- Server-side cookie forwarding for API calls
- Admin route protection via `/api/admin/verify`
- Input validation with Zod

---

## 📝 Common Tasks

### Add a New Course (Admin)
1. Go to `/admin/courses`
2. Click "Create Course"
3. Fill course details (title, description, price, image)
4. Create chapters and add lessons
5. Publish the course

### Test Stripe Payment
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date, any CVC
3. Check enrollment status in admin dashboard

### Fix Common Issues

**"Module not found" error**
- Restart dev server: `Ctrl+C`, then `pnpm dev`

**CORS errors on file upload**
- Verify S3 CORS configuration
- Check `AWS_BUCKET_NAME` and region in env

**Database connection failed**
- Verify `DATABASE_URL` is correct
- Run migrations: `pnpm prisma migrate dev`

**Admin page shows $0 revenue**
- Check enrollment status is "Completed" (not "Pending")
- Verify Stripe webhook is processing payments

---

