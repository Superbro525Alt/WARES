-- Seed data for WARES
with cat as (
  insert into public.categories (slug, name)
  values ('kits', 'Kits'), ('electronics', 'Electronics')
  returning id, slug
),
prod as (
  insert into public.products (slug, name, short_description, long_description_md, category_id, difficulty, teacher_friendly, published)
  values
    (
      'starter-drive-kit',
      'Starter Drive Kit',
      'Entry-level drivetrain kit with pre-cut rails and teaching notes.',
      'A reliable drivetrain kit built for new teams. Includes rails, wheels, and motor mounts. Use this as your base for the first build season.',
      (select id from cat where slug = 'kits'),
      'Beginner',
      true,
      true
    ),
    (
      'control-hub',
      'Control Hub',
      'All-in-one control unit with labeled ports and classroom-safe wiring.',
      'The Control Hub is a compact controller for classroom setups. Includes PWM and CAN support with labeling for students.',
      (select id from cat where slug = 'electronics'),
      'Intermediate',
      true,
      true
    )
  returning id, slug
),
sect as (
  insert into public.product_sections (product_id, overview_md, quickstart_md, intended_use_md, good_practice_md, bad_practice_md)
  select
    id,
    '## Overview\nDesigned for quick assembly and early-season success.',
    '1. Inventory parts\n2. Assemble rails\n3. Install wheels\n4. Power-on test',
    'Great for teachers introducing drivetrain basics and classroom safety.',
    '> [!TIP]\nLabel all student tool trays before assembly.',
    '> [!MISTAKE]\nSkipping axle spacing checks leads to binding.'
  from prod
),
faq as (
  insert into public.faqs (product_id, question, answer_md, order_index)
  select id, 'What tools are required?', 'A 2.5mm hex key, 10mm wrench, and safety goggles.', 0
  from prod
),
media_y as (
  insert into public.media_youtube (product_id, title, youtube_url, order_index)
  select id, 'Assembly walkthrough', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 0
  from prod
),
media_i as (
  insert into public.media_images (product_id, title, alt_text, caption, storage_path, width, height, order_index)
  select id, 'Kit overview', 'Kit overview', 'Starter kit layout', 'https://images.unsplash.com/photo-1581091012184-5c8b1c2b0a1a?auto=format&fit=crop&w=1200&q=80', 1200, 800, 0
  from prod
),
media_p as (
  insert into public.downloads_pdfs (product_id, title, description, kind, version, storage_path, order_index)
  select id, 'Quickstart Guide', 'PDF quickstart for teachers', 'manual', 'v1.0', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 0
  from prod
),
media_c as (
  insert into public.cad_embeds (product_id, title, embed_url, notes_md, order_index)
  select id, 'Onshape CAD', 'https://cad.onshape.com/documents/12345/w/67890/e/abcd', 'Embed preview from Onshape.', 0
  from prod
),
media_m as (
  insert into public.models_3d (product_id, title, storage_path, format, notes_md, order_index)
  select id, 'GLB model', 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', 'glb', 'Demo GLB model.', 0
  from prod
),
base_guides as (
  insert into public.guides (slug, title, summary, difficulty, est_minutes, content_md, published)
  values
    ('classroom-setup', 'Classroom Setup Checklist', 'Prepare a safe and organized robotics classroom.', 'Beginner', 30, '## Checklist\n- Safety briefing\n- Tool stations\n- Student roles', true),
    ('drive-kit-assembly', 'Drive Kit Assembly', 'Step-by-step assembly for the Starter Drive Kit.', 'Beginner', 60, '## Assembly\nFollow the quickstart steps with photos.', true)
  returning id, slug
),
base_lessons as (
  insert into public.lessons (slug, title, summary, learning_goals_json, prerequisites_json, duration_minutes, content_md, published)
  values
    ('intro-to-drivetrain', 'Intro to Drivetrain Systems', 'Students learn drivetrain basics and safe assembly.', '["Identify drivetrain parts","Assemble drivetrain"]', '["Basic tool safety"]', 50, '## Lesson\nDiscuss power transmission and test run.', true),
    ('control-hub-wiring', 'Control Hub Wiring Basics', 'Teach safe wiring and labeling for controllers.', '["Wire a controller","Test ports"]', '["Safety briefing"]', 45, '## Lesson\nWalk through wiring diagrams.', true)
  returning id, slug
),
link_guides as (
  insert into public.guide_links (guide_id, product_id)
  select g.id, p.id
  from base_guides g
  join prod p on p.slug = 'starter-drive-kit'
  where g.slug = 'drive-kit-assembly'
  returning guide_id
),
link_lessons as (
  insert into public.lesson_links (lesson_id, product_id)
  select l.id, p.id
  from base_lessons l
  join prod p on p.slug = 'control-hub'
  where l.slug = 'control-hub-wiring'
  returning lesson_id
)
select 1;
