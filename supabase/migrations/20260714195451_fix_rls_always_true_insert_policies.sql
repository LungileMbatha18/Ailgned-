/*
# Fix RLS policies with always-true WITH CHECK clauses

## Problem
Two INSERT policies had `WITH CHECK (true)`, which effectively bypasses
row-level security and allows unrestricted inserts by anon/authenticated roles:

1. `anon_insert_contact_submissions` on `contact_submissions`
2. `anon_insert_subscribers` on `newsletter_subscribers`

## Solution
Replace the always-true WITH CHECK clauses with meaningful data-validation
predicates. These are public-facing forms on a no-auth landing page, so
ownership checks (auth.uid()) do not apply. Instead, the policies now
validate the shape and content of inserted rows:

- email must match a basic email pattern
- required text fields must be non-empty and within reasonable length limits
- newsletter source must be 'landing_page' (the only value the frontend sends)

## Tables affected
- `newsletter_subscribers` — INSERT policy tightened
- `contact_submissions` — INSERT policy tightened

## Security changes
- `anon_insert_subscribers`: WITH CHECK now validates email format and source
- `anon_insert_contact_submissions`: WITH CHECK now validates email format
  and enforces non-empty, length-bounded name/subject/message fields

## Notes
1. The frontend (email-capture.tsx, contact-form.tsx) already validates
   email format client-side and only sends the expected fields, so these
   policy constraints will not break existing insert flows.
2. The unique constraint on newsletter_subscribers.email still prevents
   duplicate signups.
3. SELECT policies are unchanged.
*/

-- ── newsletter_subscribers ──────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_subscribers" ON newsletter_subscribers;
CREATE POLICY "anon_insert_subscribers"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND source = 'landing_page'
);

-- ── contact_submissions ─────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(name) BETWEEN 1 AND 200
  AND length(subject) BETWEEN 1 AND 200
  AND length(message) BETWEEN 1 AND 5000
);
