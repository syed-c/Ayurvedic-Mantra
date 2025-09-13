Ayurvedic Mantra – Project Process & Architecture Guide

This document explains how the project is structured, how to run it locally, environment/configuration requirements, core features, security model, integrations (Shiprocket, SMTP/SMS), API surface, and deployment/operations.

### 1) Tech Stack
- Runtime: Next.js 15 (App Router) on Node.js 18+
- Language: TypeScript, React 18
- Styling: Tailwind CSS, shadcn/ui (Radix primitives)
- State/Context: React Context (`contexts/AppContext.tsx`)
- Build: next build; standalone output
- Storage: JSON-backed persistent storage via `lib/storage.ts` (file `data/admin-settings.json`) with in-memory cache
- Communications: SMTP (Nodemailer) + SMS (Infobip/Twilio/Fast2SMS) via `lib/communications.ts`
- Shipping: Shiprocket API via `lib/shiprocket.ts`

### 2) Repository Layout (high level)
- `app/`: App Router pages and API routes
  - `app/page.tsx`: Landing/home
  - `app/checkout/page.tsx`: Checkout
  - `app/admin/page.tsx`, `app/admin-direct/page.tsx`: Admin dashboards (protected)
  - `app/admin-login/page.tsx`: Admin login (OTP)
  - `app/api/...`: Backend endpoints (orders, auth/otp, admin settings, shiprocket, communications, public/internal)
- `components/`: UI components (sections, admin panels, shadcn/ui primitives)
- `contexts/AppContext.tsx`: Client-side context/provider
- `data/admin-settings.json`: Persisted configuration + runtime data (orders, settings)
- `lib/`: Core libraries
  - `lib/storage.ts`: Persistent storage abstraction with in-memory cache and JSON file backing
  - `lib/communications.ts`: Email/SMS/OTP and order confirmation messaging
  - `lib/shiprocket.ts`: Shiprocket client with token caching and auto-refresh
  - `lib/utils.ts`: Utilities (e.g., `cn`)
  - `lib/auth.ts`: Client-side auth helpers/validators
- `middleware.ts`: Primary security middleware for routes and API
- `middleware-secure.ts`: Alternate/legacy secure middleware
- `server-configs/`: `nginx.conf`, `ecosystem.config.js` examples
- Deployment docs/scripts: `DEPLOYMENT_GUIDE.md`, `HOSTINGER_DEPLOYMENT_GUIDE.md`, `deploy.sh`, `hostinger-deploy.sh`, `verify-deployment.js`

### 3) Local Development
Requirements: Node.js 18+, npm 9+

Steps:
1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Visit: `http://localhost:3000`

Scripts (`package.json`):
- `dev`: next dev
- `build`: next build
- `start`: next start
- `lint`: next lint

Environment variables (typical local):
- `NODE_ENV=development`
- `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- Optional: override defaults for email/SMS/Shiprocket via Admin Settings API or by editing `data/admin-settings.json` locally (see Security notes).

### 4) Configuration & Storage Model
- Central store: `lib/storage.ts` persists a `StorageData` JSON at `data/admin-settings.json` with in-memory caching for 10 minutes to reduce I/O.
- When file storage is unavailable (serverless), defaults are served from `getDefaultSettings()` and retained in memory.
- `storage.update()` deep-merges partial updates; `storage.save()` writes + stamps metadata (`lastUpdated`, `version`).
- Admin settings are retrieved/updated via `app/api/admin/settings/route.ts` (GET, PUT).

Important sections in settings:
- `site`, `homepage`, `product`, `checkout`: Marketing/UX content
- `communications`: SMTP + SMS provider config
- `payment`: Placeholder for gateway config
- `shipping.shiprocket`: Shiprocket auth/config, token and expiry
- `orders`: Stored order list for admin dashboard

Security note: Do not commit secrets. Replace any credentials present in `data/admin-settings.json` with secure values in production and rotate them. Prefer setting these by calling the Admin Settings API in production environments.

### 5) Security & Middleware
- `middleware.ts` guards admin UIs (`/admin`, `/admin-direct`) and admin APIs (`/api/admin/*`):
  - Requires presence of `adminToken` (cookie or `Authorization: Bearer`)
  - Validates token structure `admin_<timestamp>_<random>`, and max age 8 hours
  - Redirects to `/admin-login` if not authenticated
- Blocks deprecated `/api/auth/login` paths unless using secure endpoints
- Adds hardened headers globally:
  - `X-Frame-Options=DENY`, `X-Content-Type-Options=nosniff`, `Referrer-Policy=strict-origin-when-cross-origin`, `X-XSS-Protection`, `Permissions-Policy`, `Strict-Transport-Security`
- Adds CSP for admin routes; `frame-ancestors 'none'`

Admin Authentication:
- OTP-based flow via `app/api/auth/*` routes and `app/admin-login`
- On success, frontend stores `adminToken` locally; middleware also expects cookie or bearer when hitting API

Recommendation:
- Issue `adminToken` as HttpOnly, Secure cookie from the server-side login route to avoid relying on localStorage and reduce XSS risk
- Rotate any public demo credentials

### 6) Communications (Email/SMS/OTP)
- Centralized in `lib/communications.ts`
- Settings loaded from storage; if incomplete, sensible defaults are used
- Providers:
  - SMS: Infobip, Twilio, Fast2SMS (choose via `communications.sms.provider`)
  - Email: Nodemailer SMTP (Titan or other)
- Functions:
  - `sendOTP(contact, otp, method)`: method = 'sms' | 'email'
  - `sendEmailWithHtml(to, subject, html)` and `sendEmail(to, subject, text)`
  - `sendOrderConfirmation({ orderId, customerName, ... })`: triggers HTML email + SMS

Caution:
- Replace any example API keys, SMTP usernames/passwords with your own. Never commit real secrets.

SMTP configuration notes:
- You can configure SMTP via Admin Settings or environment variables. Env vars override storage when provided:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - Optional: `SMTP_FROM_NAME`, `SMTP_DEFAULT_SUBJECT`
- TLS is enforced with `minVersion: TLSv1.2`. If your provider requires STARTTLS, use `SMTP_PORT=587`; for implicit SSL, use `SMTP_PORT=465`.
- After changing `.env.local`, restart the dev server to apply.

### 7) Orders & Checkout Flow
- Checkout page collects user + address + plan selection
- `POST /api/orders/place`:
  - Generates unique order ID (prefix `SM`)
  - Persists order in memory and in `storage`
  - Attempts Shiprocket order creation (see below); does NOT auto-assign AWB/courier by design
  - Sends customer confirmation via email and SMS (non-blocking)
  - Returns response with order summary and a message indicating Shiprocket creation status
- `GET /api/orders/place` (admin use): returns enhanced order list + stats

### 8) Shiprocket Integration
Library: `lib/shiprocket.ts`
- Authenticates with Shiprocket and stores token + 10-day `tokenExpiry` and `nextRefresh` into `shipping.shiprocket` in storage
- `ensureValidToken()` uses stored token when valid; otherwise re-authenticates
- Auto-refresh logic checks if within 1 day of `nextRefresh` and refreshes
- Provided operations used here:
  - `createOrder(orderData, credentials, existingToken)`
  - Tracking/serviceability/AWB/pickup/manifest/label/invoice helpers (available but not auto-run)
- Formatter: `ShiprocketService.formatOrderForShiprocket()` maps internal order to Shiprocket payload with Ayurvedic Mantra defaults

Application behavior:
- On order placement, the app creates the order in Shiprocket only (no AWB, no courier assignment, no pickup). This ensures orders appear under "New Orders" for manual processing.
- If Shiprocket fails, the order still completes and is flagged for admin attention.

Settings required (via Admin panel or settings storage):
- `shipping.shiprocket.email`
- `shipping.shiprocket.password`
- Optional: `pickupLocation`, `channelId`, `packageDimensions`

### 9) Admin Dashboard Features

#### Order Management Filters
The admin dashboard (`/admin`) includes comprehensive filtering capabilities:

**Payment Method Filters:**
- COD Orders: Cash on Delivery orders
- Online Paid: Online payment orders
- Guest Orders: Orders from non-registered users
- Delivered: Completed/delivered orders

**Order Status Filters:**
- Pending: New orders awaiting processing (default status)
- Processing: Orders being prepared
- Confirmed: Orders confirmed by admin
- Shipped: Orders dispatched
- Today: Orders placed today

**Order Status Management:**
- Default new order status: `pending` (changed from `placed`)
- Status dropdown in order table with options: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
- Bulk status updates for multiple orders
- Status change confirmation dialogs

**Payment Status Management:**
- Payment status dropdown with options: Pending, Completed, Failed, Refunded
- Independent of order status
- Payment status change confirmation dialogs
- Real-time updates via API
- **Default Payment Status:**
  - COD Orders: `pending` (payment due on delivery)
  - Online Payment Orders: `completed` (payment processed immediately)

#### User Management Filters
**User Filter Options:**
- All Users: Complete user list
- Registration: Filter by registration date/status
- Orders Stats: Users sorted by order count
- Total Value: Users sorted by total spending
- Paying Customers: Users with completed orders
- New Users: Recently registered users
- Inactive Users: Users without recent activity

#### API Enhancements
**Order API Updates (`/api/admin/orders`):**
- `PUT` method now accepts `paymentStatus` parameter
- Payment status updates tracked in order history
- Enhanced order statistics with filter counts
- Improved error handling and validation

**Order Placement Updates (`/api/orders/place`):**
- Default order status changed to `pending`
- Enhanced order tracking and history
- Improved Supabase integration with fallback to file storage

### 10) Public/Private Settings APIs
- Public:
  - `GET /api/public/settings`: public site config (if present)
- Internal/Admin:
  - `GET /api/admin/settings`, `PUT /api/admin/settings`: load/update full settings (protected)
  - Admin-Only communications tests under `app/api/communications/*`

Auth/OTP APIs:
- `app/api/auth/send-otp`, `verify-otp`, `admin-otp`, `secure-login`: endpoints for OTP flows
- Deprecated plain `login` endpoints are blocked by middleware

### 11) Next.js Config
- `next.config.js`:
  - `output: 'standalone'` for containerized/PM2 deployment
  - Image domains allow `assets.macaly-user-data.dev`, `ayurvedicmantra.com`
  - Security headers + redirects
  - `env`: `PRODUCTION_DOMAIN`, `ADMIN_EMAIL` baked into build

### 12) Deployment
See:
- `DEPLOYMENT_GUIDE.md`: Generic VPS + PM2 + Nginx + Certbot flow
- `HOSTINGER_DEPLOYMENT_GUIDE.md`: Hostinger-focused guidance (VPS/Cloud recommended)
- Scripts: `deploy.sh`, `hostinger-deploy.sh`

Quick outline (VPS):
1) Build locally: `npm ci && npm run build`
2) Package & upload using `deploy.sh`
3) On server: extract to `/var/www/ayurvedicmantra`
4) Configure environment (prefer `.env.local` and Admin Settings API for secrets)
5) Run with PM2: `pm2 start npm --name ayurvedicmantra -- start && pm2 save`
6) Nginx reverse proxy + Let’s Encrypt TLS

Operational notes:
- Rotate and set secrets post-deploy using Admin Settings page/API; avoid placing secrets in git
- Verify Shiprocket connectivity via the provided `app/api/shiprocket/test-connection` route if present, or from admin UI

### 13) Admin UI
- Access: `/admin-login` (OTP)
- After login: `/admin` (and `/admin-direct`)
- Features: settings management (site content, images, Shiprocket, SMTP/SMS), orders overview, Shiprocket dashboard links

### 14) Testing & Verification
- Unit/UI tests infra: `@testing-library/*`, `vitest` present (no extensive tests yet)
- Manual checks after deploy:
  - Place test order on `/checkout`
  - Confirm email/SMS received
  - Verify order appears under `/api/orders/place` (GET) and in admin UI
  - Confirm Shiprocket order appears under "New Orders"

### 15) Troubleshooting (quick)
- Orders saved but not syncing to Shiprocket: verify credentials in Admin settings; check middleware logs; inspect server logs
- Emails not sending: verify SMTP host/port/username/password in Admin settings and provider allowlist; check Nodemailer logs
- SMS not sending: confirm provider/API key and sender ID; ensure phone number formatting per provider
- Admin access denied: validate `adminToken` cookie and its age; confirm middleware matcher includes your route

### 16) Compliance & Secrets Hygiene
- Replace any placeholder credentials and API keys in `data/admin-settings.json` immediately in production; do not commit real credentials
- Prefer configuring credentials from the Admin panel or via protected API, then persisting through `lib/storage.ts`
- Consider moving sensitive data to environment variables or a managed secrets store for production

### 17) Useful Endpoints (reference)
- Orders: `POST /api/orders/place`, `GET /api/orders/place`
- Admin settings: `GET/PUT /api/admin/settings` (protected)
- Auth: `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/secure-login`, `/api/auth/admin-otp`
- Communications tests: `/api/communications/*`
- Shiprocket helpers: `/api/shiprocket/*` (toggle, track, test, docs, manage, etc.)

### 18) Roadmap Suggestions
- Harden admin auth: server-issued HttpOnly cookies, JWT with signature, refresh rotation
- Migrate secrets to env/secret manager; encrypt at rest in JSON if retained
- Add unit/integration tests for APIs and Shiprocket flows
- Introduce DB (e.g., Postgres/Prisma) if order volume requires robust persistence beyond JSON file

---
This guide should give new contributors and operators the context and steps needed to work with the project end-to-end. Keep this document updated alongside any architectural or process changes.

## Supabase Integration

- Library: `@supabase/supabase-js` with clients in `lib/supabase.ts` (`supabase` for anon and `supabaseService` for server-only privileged calls).
- Env required (add to `.env.local` and `.env.production`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never expose on client)
- Users API (`app/api/admin/users/route.ts`) now fetches/creates users via Supabase `users` table.
- Orders API (`app/api/orders/place/route.ts`) now inserts/fetches orders via Supabase `orders` table, with file storage fallback if DB is down.

SQL (run in Supabase SQL Editor):
```
-- Optional: ensure pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text,
  name text,
  is_guest boolean not null default false,
  verified boolean not null default false,
  total_orders integer not null default 0,
  total_spent numeric(12,2) not null default 0,
  meta jsonb,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique,
  user_id uuid references public.users(id) on delete set null,
  user_email text,
  user_phone text,
  user_name text,
  product_name text,
  price numeric(12,2) not null default 0,
  status text not null default 'placed',
  payment_method text,
  payment_status text default 'pending',
  shipping_address jsonb,
  is_guest boolean not null default true,
  meta jsonb,
  created_at timestamp with time zone not null default now()
);

-- Helpful indexes
create index if not exists idx_orders_order_id on public.orders(order_id);
create index if not exists idx_orders_user_email on public.orders(user_email);
create index if not exists idx_users_email on public.users(email);

-- RLS policies (example: allow anon read, service role full access)
alter table public.users enable row level security;
alter table public.orders enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'users' and policyname = 'anon read users'
  ) then
    create policy "anon read users" on public.users for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'orders' and policyname = 'anon read orders'
  ) then
    create policy "anon read orders" on public.orders for select using (true);
  end if;
end $$;

-- Service role is unrestricted by design; use server key in API routes only
```



