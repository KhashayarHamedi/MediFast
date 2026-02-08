# MediFast

> Medicine delivered. Night & weekend. Vienna only.

A PWA-capable web app for Vienna, Austria: 24h/Notdienst pharmacy visibility and medicine delivery. Built for stressed users (night, weekend, holiday) with low cognitive load and dark mode by default.

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
4. Create storage buckets in Supabase Dashboard → Storage:
   - `prescriptions` (public or private) — prescription photos
   - `id-documents` (private) — courier ID/Führerschein uploads
5. Enable Email auth in Supabase Dashboard → Authentication → Providers

### 4. Push schema & seed Vienna pharmacies

```bash
npm run db:push
npm run db:seed
```

(Seed script adds ~20 real Vienna 24h/Notdienst pharmacies.)

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

- ✅ **Vienna only**: Real 24h/Notdienst pharmacies (seeded from nachtapotheke.wien / apo24.at style data)
- ✅ **Landing**: Dark mode default, hero (8 words), single CTA “Request Medicine Now”, reassurance blocks, live map below fold, emergency copy (144/112)
- ✅ **Patient**: Sign-up with PLZ, street, house number; profile with optional health summary (allergies, conditions, meds) + voice-to-text (de/en)
- ✅ **Prescription**: Upload to Supabase `prescriptions` bucket, preview
- ✅ **Courier**: Sign-up with DOB, mandatory ID/Führerschein upload (`id-documents` bucket), vehicle type
- ✅ **Map**: Leaflet + react-leaflet, Vienna center, blinking markers for open/urgent, “Center on me” geolocation
- ✅ Request flow, delivery status (pending → accepted → picked_up → delivering → delivered), cash on delivery
- ✅ German/English only (no RTL)

## Out of Scope (Later)

- Iranian payment gateway
- AI OCR for prescriptions
- Real-time GPS tracking
- Pharmacy sign-up portal
- Ratings/reviews

## License

MIT
