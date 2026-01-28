# WARES Documentation + Education Portal

Production-ready documentation and education portal for WARES (Perth, Western Australia). Built with Next.js App Router, Supabase, Tailwind, shadcn/ui, and Framer Motion.

## Stack
- Next.js (App Router) + TypeScript + pnpm
- TailwindCSS + shadcn/ui
- Supabase (Postgres + Auth + Storage)
- Zustand (UI state)
- Zod + React Hook Form
- Framer Motion

## Getting Started

### 1) Install deps
```bash
pnpm install
```

### 2) Create Supabase project
- Create a new Supabase project.
- Copy the project URL and anon key.
- Create a service role key for admin invites.

### 3) Configure env
Create `.env.local` and set:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4) Run migrations
Use the Supabase SQL editor to run:
- `supabase/migrations/001_init.sql`

### 5) Seed data
Run in Supabase SQL editor:
- `supabase/seed/seed.sql`

### 6) Storage buckets
Create three public buckets:
- `public-images`
- `public-pdfs`
- `public-models`

Suggested storage policies:
```sql
-- Allow public read
create policy "Public read images" on storage.objects for select using (bucket_id = 'public-images');
create policy "Public read pdfs" on storage.objects for select using (bucket_id = 'public-pdfs');
create policy "Public read models" on storage.objects for select using (bucket_id = 'public-models');

-- Allow admin write
create policy "Admin write images" on storage.objects for insert with check (bucket_id = 'public-images' and public.is_admin());
create policy "Admin write pdfs" on storage.objects for insert with check (bucket_id = 'public-pdfs' and public.is_admin());
create policy "Admin write models" on storage.objects for insert with check (bucket_id = 'public-models' and public.is_admin());

create policy "Admin update images" on storage.objects for update using (bucket_id = 'public-images' and public.is_admin());
create policy "Admin update pdfs" on storage.objects for update using (bucket_id = 'public-pdfs' and public.is_admin());
create policy "Admin update models" on storage.objects for update using (bucket_id = 'public-models' and public.is_admin());
```

## Admin setup

### Create the first admin
1. Create a user by signing up in Supabase Auth (email + password).
2. In SQL editor:
```sql
insert into public.user_profiles (id, email, role)
values ('<USER_UUID_FROM_AUTH>', '<EMAIL>', 'admin')
on conflict (id) do update set role = 'admin';
```

### Invite admins
Use `/admin/invites` to send an invite email (Supabase Auth). The invited admin will set a password and log in.

## Development
```bash
pnpm dev
```
Visit `http://localhost:3000`.

## Deployment (Vercel)
- Set the env vars in Vercel.
- Ensure Supabase project allows connections from Vercel.
- Deploy as a Next.js app.

## Data layer
All DB access is abstracted behind a repository layer in `src/lib/db`. UI code should import only from `src/lib/db/index.ts`.

## Notes
- Public pages are server components by default.
- Admin routes are protected by middleware + server checks.
- Teacher Friendly Mode is a client UI toggle on product pages.

