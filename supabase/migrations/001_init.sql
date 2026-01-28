-- 001_init.sql
create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  long_description_md text,
  category_id uuid references public.categories(id) on delete set null,
  difficulty text,
  teacher_friendly boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(short_description,''))
  ) stored
);

create table if not exists public.product_sections (
  product_id uuid primary key references public.products(id) on delete cascade,
  overview_md text,
  quickstart_md text,
  intended_use_md text,
  good_practice_md text,
  bad_practice_md text
);

create table if not exists public.product_tags (
  product_id uuid references public.products(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  difficulty text,
  est_minutes integer,
  content_md text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,''))
  ) stored
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  learning_goals_json jsonb,
  prerequisites_json jsonb,
  duration_minutes integer,
  content_md text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,''))
  ) stored
);

create table if not exists public.guide_links (
  guide_id uuid references public.guides(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  primary key (guide_id, product_id)
);

create table if not exists public.lesson_links (
  lesson_id uuid references public.lessons(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  primary key (lesson_id, product_id)
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  question text not null,
  answer_md text,
  order_index integer not null default 0,
  search tsvector generated always as (
    to_tsvector('english', coalesce(question,''))
  ) stored
);

create table if not exists public.media_youtube (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  title text not null,
  youtube_url text not null,
  order_index integer not null default 0
);

create table if not exists public.media_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  title text,
  alt_text text,
  caption text,
  storage_path text not null,
  width integer,
  height integer,
  order_index integer not null default 0
);

create table if not exists public.downloads_pdfs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  title text not null,
  description text,
  kind text not null default 'other',
  version text,
  storage_path text not null,
  order_index integer not null default 0
);

create table if not exists public.cad_embeds (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  title text not null,
  embed_url text not null,
  notes_md text,
  order_index integer not null default 0
);

create table if not exists public.models_3d (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  title text not null,
  storage_path text not null,
  format text not null default 'glb',
  notes_md text,
  order_index integer not null default 0
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists products_search_idx on public.products using gin (search);
create index if not exists guides_search_idx on public.guides using gin (search);
create index if not exists lessons_search_idx on public.lessons using gin (search);
create index if not exists faqs_search_idx on public.faqs using gin (search);
create index if not exists product_tags_product_idx on public.product_tags(product_id);
create index if not exists guide_links_product_idx on public.guide_links(product_id);
create index if not exists lesson_links_product_idx on public.lesson_links(product_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

create trigger set_guides_updated_at before update on public.guides
for each row execute function public.set_updated_at();

create trigger set_lessons_updated_at before update on public.lessons
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable;

create or replace function public.is_admin_uid(uid uuid)
returns boolean as $$
  select exists (
    select 1 from public.user_profiles
    where id = uid and role = 'admin'
  );
$$ language sql stable security definer;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.user_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.products enable row level security;
alter table public.product_sections enable row level security;
alter table public.product_tags enable row level security;
alter table public.guides enable row level security;
alter table public.lessons enable row level security;
alter table public.guide_links enable row level security;
alter table public.lesson_links enable row level security;
alter table public.faqs enable row level security;
alter table public.media_youtube enable row level security;
alter table public.media_images enable row level security;
alter table public.downloads_pdfs enable row level security;
alter table public.cad_embeds enable row level security;
alter table public.models_3d enable row level security;
alter table public.contact_submissions enable row level security;

-- Public read policies
create policy "Public read categories" on public.categories
for select using (true);

create policy "Users read own profile" on public.user_profiles
for select using (id = auth.uid());

create policy "Public read tags" on public.tags
for select using (true);

create policy "Public read published products" on public.products
for select using (published = true);

create policy "Public read product sections" on public.product_sections
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read product tags" on public.product_tags
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read guides" on public.guides
for select using (published = true);

create policy "Public read lessons" on public.lessons
for select using (published = true);

create policy "Public read guide links" on public.guide_links
for select using (
  exists (select 1 from public.guides g where g.id = guide_id and g.published = true)
);

create policy "Public read lesson links" on public.lesson_links
for select using (
  exists (select 1 from public.lessons l where l.id = lesson_id and l.published = true)
);

create policy "Public read faqs" on public.faqs
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read media youtube" on public.media_youtube
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read media images" on public.media_images
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read pdfs" on public.downloads_pdfs
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read cad" on public.cad_embeds
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public read models" on public.models_3d
for select using (
  exists (select 1 from public.products p where p.id = product_id and p.published = true)
);

create policy "Public submit contact" on public.contact_submissions
for insert with check (true);

-- Admin policies
create policy "Admin manage profiles" on public.user_profiles
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage categories" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage tags" on public.tags
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage products" on public.products
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage product sections" on public.product_sections
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage product tags" on public.product_tags
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage guides" on public.guides
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage lessons" on public.lessons
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage guide links" on public.guide_links
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage lesson links" on public.lesson_links
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage faqs" on public.faqs
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage media youtube" on public.media_youtube
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage media images" on public.media_images
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage pdfs" on public.downloads_pdfs
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage cad" on public.cad_embeds
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin manage models" on public.models_3d
for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read contact" on public.contact_submissions
for select using (public.is_admin());

-- Grants (required for anon/authenticated clients)
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.tags, public.products, public.product_sections, public.product_tags, public.guides, public.lessons, public.guide_links, public.lesson_links, public.faqs, public.media_youtube, public.media_images, public.downloads_pdfs, public.cad_embeds, public.models_3d to anon, authenticated;
grant select on public.user_profiles to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant execute on function public.is_admin_uid(uuid) to anon, authenticated;
grant insert, update, delete on public.products, public.product_sections, public.product_tags, public.guides, public.lessons, public.guide_links, public.lesson_links, public.faqs, public.media_youtube, public.media_images, public.downloads_pdfs, public.cad_embeds, public.models_3d, public.categories, public.tags to authenticated;
grant select, insert, update, delete on public.products, public.product_sections, public.product_tags, public.guides, public.lessons, public.guide_links, public.lesson_links, public.faqs, public.media_youtube, public.media_images, public.downloads_pdfs, public.cad_embeds, public.models_3d, public.categories, public.tags to service_role;
grant select on public.user_profiles to service_role;
