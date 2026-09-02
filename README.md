# Budget Bazar - Best Gadgets, Best Prices

A complete, scalable, production-ready full-stack e-commerce platform for gadgets & electronics in Bangladesh.

## Architecture

`
budget-bazar/
├── frontend/   # Next.js 14 + React + TypeScript + Tailwind CSS
├── backend/    # Node.js + Express + TypeScript
├── database/   # Supabase PostgreSQL migrations + storage
└── README.md
`

Frontend and Backend are completely separated. Frontend communicates via REST APIs. No sensitive logic in frontend.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand, TanStack Query, React Hook Form, Zod, Axios, Lucide React
- **Backend:** Node.js, Express, TypeScript, Supabase JS, Zod, Helmet, CORS, Rate Limit, Multer
- **Database:** Supabase PostgreSQL + Supabase Auth + Supabase Storage

## Quick Start

### 1. Supabase Setup
- Create project at supabase.com
- Copy URL & keys
- Run migrations: database/migrations/*.sql via SQL Editor
- Create Storage bucket: \product-images\ (public)

### 2. Backend
\\ash
cd backend
cp .env.example .env   # fill values
npm install
npm run dev    # http://localhost:5000
\
### 3. Frontend
\\ash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev    # http://localhost:3000
\
## Environment Variables
See frontend/.env.local.example and backend/.env.example

## Order Flow
Search -> View -> Add to Cart -> Checkout (Guest allowed) -> Backend validates prices/stock/coupon -> Supabase Order -> Admin Notification -> Success Page (Bengali message)

## Product Upload Flow
Admin Dashboard -> Products -> Add Product (dynamic specs by category) -> Upload images -> Backend -> Supabase Storage -> DB -> Visible on Storefront

## Future Ready
Payments (bKash/Nagad/Rocket), Courier APIs, Multi-vendor, Push/SMS/WhatsApp, AI Search ready
