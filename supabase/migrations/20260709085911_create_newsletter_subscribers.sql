/*
# Create newsletter_subscribers table

1. Purpose
- Stores email addresses of visitors who join the AILGNED priority list
  via the "Join the Priority List" form on the coming-soon landing page.
- This is a single-tenant, no-auth app (no sign-in screen), so the
  anon-key frontend must be able to insert rows directly.

2. New Tables
- `newsletter_subscribers`
  - `id` (uuid, primary key, auto-generated)
  - `email` (text, unique, not null) — the subscriber's email address
  - `source` (text, default 'landing_page') — where the signup came from
  - `created_at` (timestamptz, default now()) — signup timestamp

3. Security
- Enable RLS on `newsletter_subscribers`.
- Allow `anon, authenticated` to INSERT (public signup form, no login).
- Allow `authenticated` to SELECT (admin/dashboard reads later).
- No UPDATE or DELETE policies — subscribers are append-only from the
  public form; management happens through the Supabase dashboard.

4. Notes
- `USING (true)` on the INSERT policy is acceptable here because the
  table is intentionally public for signups (no sign-in screen) and the
  only write is an append-only email insert with no ownership semantics.
- A unique constraint on `email` prevents duplicate subscriptions.
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text NOT NULL DEFAULT 'landing_page',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) signups — no sign-in screen on this landing page.
DROP POLICY IF EXISTS "anon_insert_subscribers" ON newsletter_subscribers;
CREATE POLICY "anon_insert_subscribers"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated reads for future admin use.
DROP POLICY IF EXISTS "auth_select_subscribers" ON newsletter_subscribers;
CREATE POLICY "auth_select_subscribers"
ON newsletter_subscribers FOR SELECT
TO authenticated
USING (true);

-- Index for fast duplicate-email lookups.
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx
ON newsletter_subscribers (email);