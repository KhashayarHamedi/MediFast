# MediFast


A web app (PWA-capable) that connects sick people with available couriers/pharmacies to get prescription or OTC medicines delivered fast — like Uber Eats but only for medicines.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4** + shadcn/ui
- **Supabase** (Auth, Postgres, Storage)
- **Drizzle ORM**
- **Leaflet** (maps)
- **Zod** (validation)
- **Sonner** (toasts)

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/KhashayarHamedi/MediFast.git
cd MediFast
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run Drizzle migrations:

   ```bash
   npm run db:push
   ```

3. Run the RLS setup SQL in Supabase SQL Editor (see `supabase/setup.sql`)
4. Create storage bucket `prescriptions` (private) for prescription photos
5. Enable Email auth in Supabase Dashboard → Authentication → Providers

### 4. Seed Pharmacies

```bash
npm run db:seed
```

### 5. Run

```bash
npm run dev
```

## Project Structure

```
/app
  /dashboard    - Protected dashboard (patient/delivery)
  /login, /signup
/actions        - Server actions (auth, profile, request, upload)
/components     - UI components
/drizzle        - Schema & migrations
/lib            - Supabase clients, db, utils, validations
/scripts        - Seed scripts
```

## Features (MVP)

- ✅ Patient sign-up + profile (name, phone, address, health summary, voice-to-text)
- ✅ Prescription photo upload
- ✅ Map with Tehran 24h pharmacies (Leaflet) — blinking markers for open/urgent
- ✅ Delivery sign-up + availability toggle (online/offline)
- ✅ Request creation (medicines + address)
- ✅ Delivery accepts job → status updates (picked up → delivering → delivered)
- ✅ Patient dashboard (active/completed requests)
- ✅ Patient delivery tracking (status timeline + 5s polling for active requests)
- ✅ Cash on delivery placeholder
- ✅ Dark mode, RTL, Persian UI

## Out of Scope (Later)

- Iranian payment gateway
- AI OCR for prescriptions
- Real-time GPS tracking
- Pharmacy sign-up portal
- Ratings/reviews

## License

MIT
