# 🎓 Full-Stack Course Platform (Next.js 15)

A **production-ready course platform** built with **Next.js 15**, featuring secure authentication, payments, analytics, progress tracking, drag-and-drop course creation, and a modern admin & customer dashboard experience.

This project demonstrates a **scalable architecture**, **clean code practices**, and **real-world SaaS patterns**, deployed on **Vercel**.

---

## ✨ Features

### Core Stack
- 🌐 **Next.js 15 (App Router)**
- 🎨 **Tailwind CSS + shadcn/ui**
- 🧮 **Neon Postgres**
- 💾 **Prisma ORM**
- 🚀 **Deployed on Vercel**

### Authentication & Security
- 🔒 **Better-Auth**
  - Email OTP authentication
  - GitHub OAuth
- 🛡️ **Arcjet Security**
  - XSS protection
  - SQL injection protection
  - Bot protection
- 🚫 **Rate Limiting**
- 🧩 Middleware-based route protection

### Course Platform Features
- 🧑‍💼 **Admin Dashboard**
- 👤 **Customer Dashboard**
- 🖱️ **Drag & Drop Course Structure**
- 📝 **Custom Rich Text Editor**
- 🎥 **Custom Video Player**
- ⭐ **Custom File Dropzone**
- 📁 **File Uploads with S3 (Presigned URLs)**
- 🗑️ Secure file deletion
- ✅ **Lesson Completion Tracking**
- 📈 **Progress Tracking**
- 📊 **Beautiful Analytics Dashboard**

### Payments & Enrollment
- 💳 **Stripe Payment Integration**
- 🔔 Stripe Webhooks
- 🎟️ Course enrollment system

### Architecture & DX
- 📦 **Data Access Layer (DAL)**
- ⚡ Performance-optimized architecture
- 📱 Fully responsive design
- 🧼 Clean & maintainable codebase
- 🧪 Schema validation with Zod

---

## 🛠️ Tech Stack

| Category | Tech |
|------|------|
| Framework | Next.js 15 |
| Styling | Tailwind CSS, shadcn/ui |
| Auth | Better-Auth |
| Database | Neon Postgres |
| ORM | Prisma |
| Security | Arcjet |
| Storage | S3 (Presigned URLs) |
| Payments | Stripe |
| Validation | Zod |
| Deployment | Vercel |

---
## 📚 Feature Overview
### 🌍 Public Experience
| Feature               | Description                              |
| --------------------- | ---------------------------------------- |
| Landing Page          | High-converting public landing page      |
| Course Catalogue      | Browse all available courses             |
| Course Detail Pages   | View course overview and full curriculum |
| Pre-Purchase Browsing | Explore courses before authentication    |
### 🔐 Authentication & Authorization
| Feature                        | Description                              |
| ------------------------------ | ---------------------------------------- |
| Mandatory Auth Before Purchase | Users must authenticate before checkout  |
| GitHub OAuth                   | One-click GitHub login                   |
| Email OTP Authentication       | Passwordless login via one-time passcode |
| Unified User Roles             | Single auth flow for creators & students |
### 💳 Payments & Enrollment
| Feature                   | Description                               |
| ------------------------- | ----------------------------------------- |
| Stripe Checkout           | Secure Stripe payment flow                |
| Instant Enrollment        | Access unlocked immediately after payment |
| Production-Ready Payments | Handles real users & real transactions    |
### 🧑‍💼 Creator / Admin Dashboard
| Feature           | Description                           |
| ----------------- | ------------------------------------- |
| Admin Dashboard   | Dedicated creator control panel       |
| Visual Analytics  | Track course performance & engagement |
| Course Management | Create, edit, and manage courses      |
### 📝 Course Authoring & Editing
| Feature                 | Description                            |
| ----------------------- | -------------------------------------- |
| Custom Rich Text Editor | Built from scratch for lesson content  |
| Course Editing Tabs     | Separate info & structure editing      |
| Course Metadata Editing | Update title, description, and details |
| Chapter Management      | Create and manage chapters             |
| Lesson Management       | Create and manage lessons              |

### 🛡️ Security & Protection
| Feature                  | Description                       |
| ------------------------ | --------------------------------- |
| Arcjet Security          | Platform-wide security layer      |
| Bot Protection           | Detects and blocks malicious bots |
| XSS Protection           | Prevents cross-site scripting     |
| SQL Injection Protection | Guards against injection attacks  |
| Rate & Weight Limiting   | Keeps app fast and resilient      |
