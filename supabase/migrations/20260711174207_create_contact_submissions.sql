/*
# Create contact_submissions table (single-tenant, no auth)

1. New Tables
- `contact_submissions`
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's full name
  - `email` (text, not null) — sender's email address
  - `subject` (text, not null) — message subject line
  - `message` (text, not null) — the body of the inquiry
  - `created_at` (timestamptz, defaults to now())
2. Security
- Enable RLS on `contact_submissions`.
- Allow anon + authenticated INSERT only (public can submit contact forms).
- No SELECT/UPDATE/DELETE for anon — submissions are private to the brand owner.
- Authenticated users also cannot read; only service-role (server-side) can read submissions.
3. Notes
- This is a no-auth landing page. Public visitors submit the form as the anon role.
- The brand owner retrieves submissions server-side using the service role key.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_select_contact_submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (false);
