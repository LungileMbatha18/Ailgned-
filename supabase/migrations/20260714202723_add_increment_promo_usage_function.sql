/*
# Add increment_promo_usage function

Creates a secure database function that increments the used_count
of a promo code. Called from the create-order edge function after
a successful order with a promo code applied.

1. New Functions
- increment_promo_usage(code_input text) — increments used_count
  for the matching active promo code. Returns void. Safe to call
  even if code doesn't exist (no-op).
2. Security
- SECURITY DEFINER so the edge function (service role) can call it.
- No public access needed — called server-side only.
*/

CREATE OR REPLACE FUNCTION increment_promo_usage(code_input text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE promo_codes
  SET used_count = used_count + 1
  WHERE code = code_input AND is_active = true;
END;
$$;
