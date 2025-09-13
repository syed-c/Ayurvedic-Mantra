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

### 19) Admin Dashboard Database Connection Fixes

#### Problem Solved
The admin dashboard had all UI elements working but wasn't properly connected to the database. Users could see the interface but changes weren't being saved or loaded from the database, making all sections except homepage content appear uneditable.

#### Root Cause
The admin dashboard was using local state (`useState`) that was only initialized once when components mounted, but never synced with the actual database settings. This meant:
- Form fields showed empty values even when data existed in the database
- Changes made in the UI weren't reflected in the database
- Only homepage content worked because it had proper state synchronization

#### Solution Implemented

**1. Added State Synchronization with useEffect**
- **File**: `components/admin-tabs-content.tsx`
- **Fix**: Added `useEffect` hooks to sync local state with database settings
- **Impact**: SEO settings, pricing plans, testimonials, and FAQs now properly load from database

```typescript
// Sync local state with settings prop changes
useEffect(() => {
  if (settings) {
    // Update SEO settings
    setSeoSettings({
      homepage: {
        title: settings?.seo?.homepage?.title || "Ayurvedic Mantra - Natural Weight Loss",
        description: settings?.seo?.homepage?.description || "Lose weight naturally with our Ayurvedic formula",
        keywords: settings?.seo?.homepage?.keywords || "ayurvedic, weight loss, natural",
        ogImage: settings?.seo?.homepage?.ogImage || ""
      },
      product: {
        title: settings?.seo?.product?.title || "SlimX Mantra - Product Details",
        description: settings?.seo?.product?.description || "Learn about our natural weight loss formula",
        keywords: settings?.seo?.product?.keywords || "slimx, ayurvedic medicine, weight loss",
        ogImage: settings?.seo?.product?.ogImage || ""
      }
    });

    // Update pricing plans, testimonials, FAQs from database
    if (settings?.product?.plans) {
      setPricingPlans(settings.product.plans);
    }
    // ... similar for testimonials and FAQs
  }
}, [settings]);
```

**2. Fixed Content Settings Synchronization**
- **File**: `app/admin/page.tsx`
- **Fix**: Added comprehensive `useEffect` to sync all content settings with database
- **Impact**: All content sections (homepage, product, checkout, thank you) now properly load and save

```typescript
// Sync content settings with database settings
useEffect(() => {
  if (settings) {
    setContentSettings({
      homepage: {
        heroTitle: settings?.homepage?.heroTitle || "",
        heroSubtitle: settings?.homepage?.heroSubtitle || "",
        heroImage: settings?.homepage?.heroImage || settings?.product?.image || "",
        benefitsTitle: settings?.homepage?.benefitsSection?.title || "",
        benefitsEnabled: settings?.homepage?.benefitsSection?.enabled ?? true,
        testimonialsEnabled: settings?.homepage?.testimonials?.enabled ?? true,
        faqEnabled: settings?.homepage?.faq?.enabled ?? true,
        pricingEnabled: settings?.homepage?.pricing?.enabled ?? true,
        ctaText: settings?.homepage?.cta?.primary || "Order Now",
        ctaSecondary: settings?.homepage?.cta?.secondary || "Learn More"
      },
      product: {
        name: settings?.product?.name || "",
        tagline: settings?.product?.tagline || "",
        description: settings?.product?.description || "",
        image: settings?.product?.image || "",
        ingredients: settings?.product?.ingredients || "",
        benefits: settings?.product?.benefits || "",
        howToUse: settings?.product?.howToUse || "",
        video: settings?.product?.video || ""
      },
      checkout: {
        title: settings?.checkout?.title || "",
        subtitle: settings?.checkout?.subtitle || "",
        deliveryMessage: settings?.checkout?.deliveryMessage || "",
        deliveryDays: settings?.checkout?.deliveryDays || 3,
        securityMessage: settings?.checkout?.securityMessage || ""
      },
      thankYou: {
        title: settings?.thankYou?.title || "",
        subtitle: settings?.thankYou?.subtitle || "",
        message: settings?.thankYou?.message || "",
        supportEmail: settings?.thankYou?.supportEmail || "",
        supportPhone: settings?.thankYou?.supportPhone || ""
      }
    });

    // Sync website settings
    setWebsiteSettings({
      siteName: settings?.site?.title || "",
      logo: settings?.site?.logo || "",
      tagline: settings?.site?.tagline || "",
      primaryColor: settings?.design?.colors?.primary || "#1f3b20",
      secondaryColor: settings?.design?.colors?.secondary || "#D2691E",
      accentColor: settings?.design?.colors?.accent || "#E6B800",
      headerPhone: settings?.site?.contactPhone || "",
      headerEmail: settings?.site?.contactEmail || "",
      footerText: settings?.site?.footerText || "",
      address: settings?.site?.address || "",
      socialLinks: {
        facebook: settings?.site?.socialLinks?.facebook || "",
        instagram: settings?.site?.socialLinks?.instagram || "",
        youtube: settings?.site?.socialLinks?.youtube || "",
        whatsapp: settings?.site?.socialLinks?.whatsapp || ""
      }
    });

    // Sync SEO settings
    setSeoSettings({
      homepage: {
        title: settings?.seo?.homepage?.title || "",
        description: settings?.seo?.homepage?.description || "",
        keywords: settings?.seo?.homepage?.keywords || "",
        ogImage: settings?.seo?.homepage?.ogImage || ""
      },
      product: {
        title: settings?.seo?.product?.title || "",
        description: settings?.seo?.product?.description || "",
        keywords: settings?.seo?.product?.keywords || "",
        ogImage: settings?.seo?.product?.ogImage || ""
      }
    });
  }
}, [settings]);
```

**3. Image and Video Upload Functionality**
- **Status**: Already working correctly
- **API**: `/api/admin/media/upload` properly handles file uploads
- **Storage**: Images are converted to base64 and stored in the database
- **UI**: Upload buttons properly trigger the upload function and update the form state

#### What's Now Working

**✅ All Admin Sections Are Now Editable:**
1. **Homepage Content**: Hero title, subtitle, benefits, CTAs, section toggles
2. **Product Details**: Name, tagline, description, ingredients, benefits, how to use, video URL
3. **Checkout Content**: Title, subtitle, delivery message, delivery days
4. **Thank You Content**: Title, subtitle, message, support contact info
5. **Website Settings**: Site name, logo, tagline, contact info, footer text, address
6. **Social Media Links**: Facebook, Instagram, YouTube, WhatsApp
7. **Design Colors**: Primary, secondary, accent colors
8. **SEO Settings**: Homepage and product page meta tags
9. **Pricing Plans**: Plan names, prices, MRP, popular/best value flags
10. **Testimonials**: Customer info, ratings, before/after weights, images, videos
11. **FAQs**: Questions and answers with enable/disable toggles
12. **Image Uploads**: Hero banner, product image, logo uploads
13. **Quick Actions**: All filter buttons and action links are now functional

**✅ Database Integration:**
- All changes are properly saved to the database via the `saveSettings` function
- Settings are loaded from the database on page load
- Real-time synchronization between UI and database
- Proper error handling and success notifications

**✅ User Experience:**
- Form fields now show actual data from the database
- Changes are immediately visible after saving
- Toast notifications confirm successful saves
- No more empty forms or uneditable sections

#### Technical Implementation Details

**State Management Pattern:**
```typescript
// 1. Initialize with empty/default values
const [contentSettings, setContentSettings] = useState({...});

// 2. Sync with database when settings load
useEffect(() => {
  if (settings) {
    setContentSettings({
      // Map database values to form state
      homepage: {
        heroTitle: settings?.homepage?.heroTitle || "",
        // ... other fields
      }
    });
  }
}, [settings]);

// 3. Save changes back to database
const saveSettings = async (settingsType: string, data: any) => {
  const success = await updateSettings(data);
  if (success) {
    await refreshData(); // Reload from database
  }
};
```

**Database Schema Compatibility:**
- Handles both old and new field names (e.g., `paymentMethod` vs `payment_method`)
- Graceful fallbacks for missing fields
- Proper type checking and validation

This fix ensures that the admin dashboard is now fully functional and properly connected to the database, making all sections editable and ensuring changes persist correctly.

### 20) Pricing and Image Update Fixes

#### Problem Solved
Two critical issues were preventing the website from reflecting admin dashboard changes:
1. **Pricing Updates Not Reflecting**: Changes made to pricing plans in the admin dashboard weren't showing on the live website
2. **Image Upload Issues**: Images uploaded through the admin dashboard weren't displaying on the website, causing 404 errors

#### Root Causes

**Pricing Issue:**
- Pricing plans were hardcoded in frontend components (`components/pricing-section.tsx` and `app/product/page.tsx`)
- Components weren't using the dynamic data from the database settings
- Admin dashboard was saving to database but frontend was ignoring the database data

**Image Issue:**
- Upload type mismatch: Admin dashboard used `'hero-banner'` but API expected `'hero'`
- Missing upload type handler: API didn't handle `'logo'` upload type
- Database contained old hardcoded paths (`/product-main.jpg`, `/logo.png`) instead of base64 image data

#### Solutions Implemented

**1. Made Pricing Plans Dynamic**
- **Files**: `components/pricing-section.tsx`, `app/product/page.tsx`
- **Fix**: Updated components to use `settings?.product?.plans` from database with fallback to defaults
- **Impact**: Pricing changes in admin dashboard now immediately reflect on website

```typescript
// Before: Hardcoded plans
const plans = [
  { id: 1, name: "1 Month Supply", price: 999, mrp: 1299, ... }
];

// After: Dynamic plans from database
const { settings } = useApp();
const plans = settings?.product?.plans || [
  { id: 1, name: "1 Month Supply", price: 999, mrp: 1299, ... }
];
```

**2. Fixed Image Upload Type Mismatches**
- **File**: `app/admin/page.tsx`
- **Fix**: Changed upload type from `'hero-banner'` to `'hero'` to match API expectations
- **Impact**: Hero banner uploads now work correctly

```typescript
// Before: Incorrect upload type
const url = await uploadImage(file, 'hero-banner');

// After: Correct upload type
const url = await uploadImage(file, 'hero');
```

**3. Added Missing Logo Upload Handler**
- **File**: `app/api/admin/media/upload/route.ts`
- **Fix**: Added `case 'logo':` handler to properly save logo uploads to database
- **Impact**: Logo uploads now work and save to `site.logo` field

```typescript
case 'logo':
  updateData = {
    site: {
      logo: base64
    },
    media: {
      logoImages: [{ 
        filename, 
        url: base64, 
        uploadedAt: new Date().toISOString(),
        size: file.size,
        type: file.type
      }]
    }
  };
  break;
```

**4. Enhanced Pricing Display Logic**
- **Files**: `components/pricing-section.tsx`, `app/product/page.tsx`
- **Fix**: Updated logic to handle both `bestValue` and `bestSeller` flags from database
- **Impact**: Proper display of "Most Popular" and "Best Value" badges

```typescript
// Handle both database flags and legacy flags
{(plan.bestValue || plan.bestSeller) && (
  <div className="absolute top-0 left-0 right-0 bg-turmeric-500 text-white text-center py-2 text-sm font-medium">
    ⭐ Best Value
  </div>
)}
```

#### What's Now Working

**✅ Dynamic Pricing:**
- Pricing plans are loaded from database settings
- Changes in admin dashboard immediately reflect on website
- Proper handling of "Most Popular" and "Best Value" flags
- Fallback to default plans if database is empty

**✅ Image Uploads:**
- Hero banner uploads work correctly (fixed type mismatch)
- Logo uploads work correctly (added missing handler)
- Product image uploads work correctly (already working)
- Images are stored as base64 in database and display properly

**✅ Real-time Updates:**
- Pricing changes are immediately visible on homepage and product page
- Image changes are immediately visible across the website
- No more 404 errors for missing image files
- Proper synchronization between admin dashboard and live website

#### Technical Implementation Details

**Database Integration Pattern:**
```typescript
// 1. Load settings from database
const { settings } = useApp();

// 2. Use database data with fallback
const plans = settings?.product?.plans || defaultPlans;

// 3. Handle multiple flag types
const isBestValue = plan.bestValue || plan.bestSeller;
```

**Image Upload Flow:**
```typescript
// 1. Upload file to API
const url = await uploadImage(file, 'hero'); // Correct type

// 2. API converts to base64 and saves to database
updateData = {
  homepage: { heroImage: base64 }
};

// 3. Frontend displays from database
{settings?.homepage?.heroImage && (
  <img src={settings.homepage.heroImage} alt="Hero Banner" />
)}
```

**Error Prevention:**
- Fixed upload type mismatches to prevent API errors
- Added missing upload handlers to prevent 404s
- Enhanced fallback logic to prevent crashes
- Proper type checking for database flags

This fix ensures that all admin dashboard changes (pricing, images, content) are immediately reflected on the live website, providing a seamless content management experience.

### 21) Webpack Module Loading Error Fixes

**Problem Identified:**
The website was experiencing critical webpack module loading errors that prevented proper functionality:
- `Cannot find module './8548.js'` and `Cannot find module './4447.js'`
- `Cannot read properties of undefined (reading 'call')` in webpack runtime
- 500 Internal Server Error on homepage and admin-login
- Missing static chunks and fallback files
- `Cannot read properties of undefined (reading 'map')` in pricing section

**Root Cause:**
- Corrupted Next.js build cache in `.next` directory
- Webpack runtime trying to load modules that were corrupted or missing
- Timing issues with component rendering before data was fully loaded
- Missing null checks for array operations in React components

**Solution Applied:**

**1. Build Cache Cleanup:**
```bash
# Clear corrupted build cache
Remove-Item -Recurse -Force .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Restart development server
npm run dev
```

**2. Component Safety Enhancements:**
```typescript
// Enhanced null checking for pricing plans
const plans = (settings?.product?.plans && 
  Array.isArray(settings.product.plans) && 
  settings.product.plans.length > 0) ? settings.product.plans : defaultPlans;

// Safe array mapping with fallbacks
{plans && Array.isArray(plans) && plans.length > 0 ? plans.map((plan: any, index: number) => (
  // Component rendering
)) : (
  <div>Loading pricing plans...</div>
)}

// Safe feature mapping with null checks
{plan.features && Array.isArray(plan.features) ? plan.features.map((feature: any, idx: number) => (
  <li key={idx}>{feature}</li>
)) : (
  <li>Features loading...</li>
)}
```

**3. Debug Logging Added:**
```typescript
// Added comprehensive logging for troubleshooting
console.log("Pricing Section - Settings:", settings);
console.log("Pricing Section - Plans:", plans);
console.log("Pricing Section - Plans length:", plans?.length);
```

**✅ Results:**
- ✅ Development server running successfully (200 OK status)
- ✅ Homepage accessible without errors
- ✅ No more webpack module loading errors
- ✅ No more 500 internal server errors
- ✅ Static chunks loading properly
- ✅ Pricing section rendering without map errors
- ✅ All previous functionality preserved

**Technical Details:**
- **Webpack Runtime Issues:** Caused by interrupted builds or dependency updates during development
- **Component Timing:** React components trying to render before context data was available
- **Array Safety:** Missing null checks for database-driven arrays that might be undefined initially
- **Cache Corruption:** Build artifacts becoming inconsistent with source code changes

**Prevention Measures:**
- Regular cache clearing during development
- Robust null checking in all array operations
- Proper fallback handling for async data loading
- Enhanced error boundaries and loading states

This fix ensures stable development environment and prevents similar webpack-related issues in the future.

