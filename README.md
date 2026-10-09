# Jess Enterprises — Corporate Website & Admin Portal

Production-grade business website, product catalogue, quotation engine, and administrative portal built for **Jess Enterprises** (Goa, India) — Government Authorised Legal Metrology Service Provider, precision laboratory instruments supplier, and custom cleanroom fabrication workshop.

---

## 1. Business Context & Official Registrations

- **Company Name:** Jess Enterprises
- **Tagline:** Innovative Services
- **Location:** Goa, India
- **Primary Email:** `jess.enterprises14@gmail.com`
- **Phone Numbers:**
  - Office / WhatsApp: `+91 9225901519`
  - Mobile: `+91 9158391519`
- **Official Compliance Registrations:**
  - **Legal Metrology Licence No.:** `22000126-CLM` (Government Authorised)
  - **GSTIN:** `30AZCPG5317P1ZG`

---

## 2. Technology Architecture & Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | High-performance React framework with server components and streaming |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety |
| **Styling** | Tailwind CSS v4 + Lucide Icons | Clean styling with corporate color tokens (`#1E5AA8` royal blue, `#DC2626` red) |
| **Database** | MongoDB + Mongoose | Document datastore with cached connection pooling |
| **Authentication** | Auth.js (NextAuth v5 beta) | JWT session authentication with Edge-isolated route middleware |
| **Validation** | Zod + React Hook Form | Schema validation shared between client forms and server actions |
| **Media Storage** | Cloudinary Direct Uploads | Secure direct browser uploads with signed server authorization |
| **Email Delivery** | Resend API + SMTP fallback | Transactional email notifications for client enquiries and quote requests |
| **Spam & Security**| Cloudflare Turnstile + IP Rate Limiter | Bot protection and brute-force prevention |

---

## 3. Project Structure

```text
Jess_Enterprise/
├── scripts/
│   └── seed.ts                  # Idempotent seed script (33 products, 18 clients, 5 services, categories, admin user)
├── src/
│   ├── app/
│   │   ├── (site)/              # Public website group
│   │   │   ├── about/           # About Us & compliance certifications
│   │   │   ├── clients/         # Enterprise clients showcase
│   │   │   ├── contact/         # Direct contact coordinates & map
│   │   │   ├── fabrication/     # Custom cleanroom SS fabrication gallery
│   │   │   ├── privacy/         # Privacy policy
│   │   │   ├── products/        # Catalogue, search & category filtering
│   │   │   │   └── [slug]/      # Equipment specifications & quotation basket
│   │   │   ├── quote/           # RFQ quotation basket & submission
│   │   │   ├── services/        # Legal metrology & technical services
│   │   │   │   └── [slug]/      # Service scope, deliverables & turnaround
│   │   │   ├── terms/           # Terms of service
│   │   │   ├── layout.tsx       # Public site shell (Header, Footer, WhatsApp desk)
│   │   │   └── page.tsx         # High-converting homepage
│   │   ├── admin/               # Protected administration workspace
│   │   │   ├── categories/      # Category manager with item count checks
│   │   │   ├── clients/         # Client logo directory manager
│   │   │   ├── enquiries/       # CRM inbox with status tabs & CSV export
│   │   │   ├── gallery/         # Fabrication project manager
│   │   │   ├── login/           # Admin credentials authentication
│   │   │   ├── products/        # Catalogue table with "Needs Review" filter
│   │   │   │   ├── [id]/        # Product editor form
│   │   │   │   └── new/         # Product creator form
│   │   │   ├── services/        # Service offering editor
│   │   │   ├── settings/        # Site settings, licence numbers & GSTIN
│   │   │   ├── users/           # Admin & editor user accounts
│   │   │   ├── layout.tsx       # Admin sidebar & header shell
│   │   │   └── page.tsx         # Real-time metrics & analytics dashboard
│   │   ├── api/
│   │   │   ├── admin/enquiries/export/ # Secured CSV export endpoint
│   │   │   ├── auth/[...nextauth]/     # NextAuth route handler
│   │   │   ├── enquiries/              # Public lead capture API
│   │   │   └── uploads/sign/           # Cloudinary direct upload signature endpoint
│   │   ├── error.tsx            # Branded client error boundary
│   │   ├── global-error.tsx     # Root error boundary
│   │   ├── not-found.tsx        # Branded 404 landing page
│   │   ├── robots.ts            # SEO search crawler directives
│   │   ├── sitemap.ts           # Dynamic XML sitemap generator
│   │   ├── layout.tsx           # Root HTML layout with OpenGraph & Twitter metadata
│   │   └── globals.css          # Tailwind CSS v4 design system
│   ├── components/
│   │   ├── admin/               # Admin panel interactive components
│   │   ├── site/                # Public website components (Header, Footer, WhatsApp, JsonLd)
│   │   └── ui/                  # Accessible UI primitives (Button, Badge, Input)
│   ├── lib/
│   │   ├── auth.config.ts       # Edge-compatible NextAuth configuration
│   │   ├── auth.ts              # Node.js NextAuth with MongoDB Credentials provider
│   │   ├── cloudinary.ts        # Cloudinary SDK and signature utilities
│   │   ├── db.ts                # Mongoose connection cache
│   │   ├── email.ts             # Email templates and dispatch pipeline
│   │   ├── rate-limit.ts        # In-memory IP rate limiter
│   │   ├── turnstile.ts         # Cloudflare Turnstile token verification
│   │   └── validators/          # Zod schemas for all models and forms
│   ├── models/                  # Mongoose schemas (Product, Category, Service, Enquiry, etc.)
│   ├── server/
│   │   ├── actions/             # Next.js Server Actions for mutations
│   │   └── queries/             # Cached database read queries
│   └── middleware.ts            # Edge protection middleware for /admin routes
├── next.config.ts               # Production security headers and image domains
└── package.json
```

---

## 4. Getting Started Locally

### Prerequisites
- Node.js `18.18+` or `20+`
- `pnpm` (recommended), `npm`, or `yarn`
- Running MongoDB instance (Local or MongoDB Atlas)

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/your-org/jess-enterprises.git
cd jess-enterprises
pnpm install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your database URI and secrets:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jess_enterprises?retryWrites=true&w=majority
AUTH_SECRET=a_random_32_character_string_for_nextauth
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Seed the Database (automatic)
On an **empty** database the site seeds itself on the first request: 33 instruments (with photos),
18 client logos, 5 services, 6 categories, site settings and the admin account. Nothing is
overwritten once data exists.

You can also run the seed manually at any time. It only adds what is missing (photos are added to
products that have none, logos to clients that have none) and it **resets the admin password**
to `INITIAL_ADMIN_PASSWORD` (or the default below):
```bash
pnpm run seed
```

Default administrator credentials (change the password from **Admin → Users** after first login):
- **Email:** `jess.enterprises14@gmail.com`
- **Password:** `Jess@Admin2026`

### Images
- Built-in product photos live in `public/products/`, client logos in `public/clients/`, the brand logo in `public/brand/`.
- In the admin panel each product can have up to 6 photos: upload a file (auto-resized to WebP) or paste any image link (e.g. from Google Images).
- Uploads go to Cloudinary when its env vars are set; otherwise they are stored in MongoDB and served from `/api/media/<id>` with long-lived caching.

### WhatsApp
The floating WhatsApp button opens a chat with **+91 92259 01519** (office). The message is pre-filled with the
product or service the visitor is viewing. Change the number in `src/lib/contact.ts`.

### Step 4: Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website, or [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the management portal.

---

## 5. Seeded Equipment Catalogue & Review Flag

The seed dataset contains:
1. **25 Fully Documented Instruments:**
   - Semi-Micro & Analytical Balances (0.01 mg / 0.1 mg)
   - Precision Top-Loading Balances
   - High Capacity Industrial Platforms (up to 5 Ton)
   - Moisture Analyzers (Halogen heating)
   - E1, E2, F1, F2 Class Calibration Weights
   - UV-Vis Double Beam Spectrophotometers
   - Dissolution & Disintegration Test Apparatus
   - Digital Flame Photometers & Polarimeters
   - HPLC Column Storage Cabinets (SS 304 / SS 316)
   - Dynamic & Static Cleanroom Pass Boxes
2. **8 Profile Equipment Items flagged with `needsReview: true`:**
   - Atomic Absorption Spectrophotometer
   - Gas Chromatograph (GC) System
   - Cleanroom Laminar Air Flow Workbench
   - Fume Hood Chemical Exhaust Station
   - Stability Chambers (ICH Guidelines)
   - Precision Digital Refractometer
   - TOC Analyzer for Purified Water
   - Cleanroom SS 316 Garment Locker
3. **18 Institutional & Pharmaceutical Clients (Text/Logo Directory):**
   - Cipla Ltd, Glenmark Pharmaceuticals, Indoco Remedies, Sanofi India, Lupin Pharma, Unichem Labs, Syngenta India, VerGo Pharma, Micro Labs, Centaur Pharma, Blue Cross Labs, Geno Pharmaceuticals, Colorcon Asia, ACG Worldwide, Wallace Pharmaceuticals, Goa Antibiotics, Encube Ethicals, Watson Pharma.
4. **5 Service Scopes:**
   - Legal Metrology Stamping & Verification (Licence `22000126-CLM`)
   - Weighing Balance Annual Maintenance Contracts (AMC)
   - Instrument Breakdown Repair & Troubleshooting
   - Certified Weights Recalibration & Mass Comparison
   - Custom Cleanroom SS/Acrylic Fabrication

---

## 6. Quotation & Enquiry Pipeline

1. **Quote Basket Flow:**
   - Clients can add instruments to an active quote basket across catalogue and detail pages.
   - The `/quote` review page collects organization details, quantities, client notes, and triggers Cloudflare Turnstile spam verification.
2. **Instant WhatsApp Generation:**
   - In addition to standard email routing, one-click WhatsApp message links pre-populate the full quote basket and item list directly to `+91 9158391519`.
3. **Internal Notifications:**
   - Submissions dispatch immediate HTML email notifications to `jess.enterprises14@gmail.com` via Resend / SMTP.
4. **Admin CRM Tracking:**
   - All enquiries are logged into the database with a 6-stage lifecycle (`new` ➔ `contacted` ➔ `quoted` ➔ `won` ➔ `lost` ➔ `closed`).
   - Admins can add internal timestamped notes and export full historical logs to CSV at any time.

---

## 7. Production Deployment Guide

### Deploying to Vercel (Recommended)
1. Push the repository to GitHub/GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables in the Vercel project dashboard:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://jessenterprises.in`)
   - `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `BUSINESS_NOTIFICATION_EMAIL`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
4. Deploy. Vercel automatically configures Edge middleware and serverless routes.

### Production Build Validation
Verify build correctness locally before deploying:
```bash
pnpm run build
pnpm run lint
```

---

## 8. Client Handover Checklist

- [x] Initial admin user created and verified.
- [x] Seed data populated with Legal Metrology Licence No. `22000126-CLM` and GSTIN `30AZCPG5317P1ZG`.
- [x] WhatsApp direct communication buttons linked to `+91 9158391519`.
- [x] Dynamic sitemap generated at `/sitemap.xml`.
- [x] Robots directives generated at `/robots.txt`.
- [x] JSON-LD LocalBusiness, Product, and Service schemas tested.
- [x] Production security headers configured in `next.config.ts`.
- [x] 8 equipment items flagged with `needsReview: true` for the client to review and update specs via the `/admin/products` panel.

---

© 2026 Jess Enterprises. All rights reserved.
