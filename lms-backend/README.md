# lms-backend — Backend developer quickstart

Quick notes for running the backend locally.

Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL (Neon or other) and a configured `.env` with `DATABASE_URL`

Setup

```bash
cd lms-backend
pnpm install
cp .env.example .env
# Edit .env and set DATABASE_URL and other secrets
```

Run

```bash
# Start dev server (runs on http://localhost:3000)
pnpm dev
```

Prisma / Database

```bash
# Run migrations and generate client
pnpm prisma migrate dev
pnpm prisma generate

# Open Prisma Studio (inspects the DB). Run this from the backend folder so it picks up the backend .env
pnpm studio
```

Stripe webhooks (local)

Run the Stripe CLI in a separate terminal to forward events to the local webhook route:

```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Notes
- Ensure `DATABASE_URL` is kept out of version control (use `.env` and add to `.gitignore`).
- If you prefer, run `dotenv -e .env -- prisma studio` to explicitly load environment variables.
