/*
# Harden increment_promo_usage function

## Problems
1. Function has a mutable search_path (security risk for SECURITY DEFINER)
2. anon and authenticated roles can execute the SECURITY DEFINER function
   via the REST API, allowing anyone to increment promo code usage

## Fixes
1. Recreate function with fixed `search_path = public, pg_temp`
2. REVOKE EXECUTE from PUBLIC, anon, and authenticated
3. The service role (used by the edge function) bypasses these grants
   and can still call the function
*/

-- Drop and recreate with a locked search_path
DROP FUNCTION IF EXISTS public.increment_promo_usage(text);

CREATE OR REPLACE FUNCTION public.increment_promo_usage(code_input text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE promo_codes
  SET used_count = used_count + 1
  WHERE code = code_input AND is_active = true;
END;
$$;

-- Revoke execute from all public roles
REVOKE EXECUTE ON FUNCTION public.increment_promo_usage(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_promo_usage(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_promo_usage(text) FROM authenticated;
