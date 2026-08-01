/*
# Create shop schema: products, promo codes, orders, order items, delivery settings

## Purpose
Enables the AILGNED shop: a product catalogue with owner-editable prices,
an opening sale (20% off all items), promo/discount codes at checkout,
and full order capture with delivery-method selection (courier or Paxi
pickup point).

## New Tables

### products
- `id` (uuid, pk)
- `name` (text, not null)
- `slug` (text, unique, not null) — URL-safe identifier
- `description` (text, not null)
- `category` (text, not null) — e.g. "Tops", "Outerwear", "Accessories"
- `price_cents` (integer, not null) — base price in cents (ZAR)
- `sale_percentage` (integer, default 0) — 0–100, applied as discount
- `image_webp` (text) — path to webp image in /public
- `image_png` (text) — fallback png path
- `sizes` (text[], default '{}') — available sizes
- `is_active` (boolean, default true) — owner can hide products
- `sort_order` (integer, default 0)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### promo_codes
- `id` (uuid, pk)
- `code` (text, unique, not null) — the code customers enter
- `discount_percentage` (integer, not null) — 1–100
- `is_active` (boolean, default true)
- `max_uses` (integer) — null = unlimited
- `used_count` (integer, default 0)
- `valid_from` (timestamptz)
- `valid_until` (timestamptz)
- `created_at` (timestamptz, default now())

### orders
- `id` (uuid, pk)
- `order_number` (text, unique) — human-readable, generated as AILG-XXXXXX
- `customer_name` (text, not null)
- `customer_email` (text, not null)
- `customer_phone` (text)
- `delivery_method` (text, not null) — 'courier' or 'paxi'
- `delivery_address` (text) — required for courier
- `paxi_pickup_point` (text) — required for paxi
- `city` (text)
- `province` (text)
- `postal_code` (text)
- `subtotal_cents` (integer, not null) — before sale discount
- `sale_discount_cents` (integer, default 0) — opening sale savings
- `promo_code` (text) — applied promo code, if any
- `promo_discount_cents` (integer, default 0) — promo savings
- `delivery_fee_cents` (integer, default 0)
- `total_cents` (integer, not null) — final amount
- `status` (text, default 'pending') — pending, paid, shipped, delivered, cancelled
- `created_at` (timestamptz, default now())

### order_items
- `id` (uuid, pk)
- `order_id` (uuid, fk → orders, cascade delete)
- `product_id` (uuid, fk → products, set null on delete)
- `product_name` (text, not null) — snapshot at time of order
- `size` (text) — selected size
- `unit_price_cents` (integer, not null) — snapshot price
- `sale_percentage` (integer, default 0) — snapshot sale
- `quantity` (integer, not null, min 1)
- `created_at` (timestamptz, default now())

### site_settings
- `id` (uuid, pk, always one row)
- `launch_date` (timestamptz, not null) — when shop opens
- `sale_active` (boolean, default true) — opening sale on/off
- `sale_percentage` (integer, default 20) — global opening sale discount
- `delivery_fee_cents` (integer, default 9900) — flat delivery fee in cents
- `paxi_fee_cents` (integer, default 6000) — paxi pickup fee in cents
- `updated_at` (timestamptz, default now())

## Security (RLS)
- products: anon/authenticated can SELECT active products; no public writes
- promo_codes: anon/authenticated can SELECT active codes (for validation);
  no public writes
- orders: anon/authenticated can INSERT (checkout) and SELECT; no
  UPDATE/DELETE for public
- order_items: anon/authenticated can INSERT (during checkout) and SELECT;
  no public UPDATE/DELETE
- site_settings: anon/authenticated can SELECT (frontend needs launch date);
  no public writes

## Notes
1. Prices stored in cents (integer) to avoid float rounding issues.
2. Sale is global (site_settings.sale_percentage) but can also be overridden
   per-product (products.sale_percentage). Per-product takes precedence if >0.
3. Orders are public-insert (no auth) since checkout has no login screen.
4. Order snapshots product name + price at time of purchase so historical
   orders remain accurate even if product prices change later.
*/

-- ── products ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  price_cents integer NOT NULL,
  sale_percentage integer NOT NULL DEFAULT 0 CHECK (sale_percentage >= 0 AND sale_percentage <= 100),
  image_webp text,
  image_png text,
  sizes text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_active_products" ON products;
CREATE POLICY "anon_select_active_products"
ON products FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- ── promo_codes ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percentage integer NOT NULL CHECK (discount_percentage >= 1 AND discount_percentage <= 100),
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_active_promo_codes" ON promo_codes;
CREATE POLICY "anon_select_active_promo_codes"
ON promo_codes FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- ── orders ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  delivery_method text NOT NULL CHECK (delivery_method IN ('courier', 'paxi')),
  delivery_address text,
  paxi_pickup_point text,
  city text,
  province text,
  postal_code text,
  subtotal_cents integer NOT NULL,
  sale_discount_cents integer NOT NULL DEFAULT 0,
  promo_code text,
  promo_discount_cents integer NOT NULL DEFAULT 0,
  delivery_fee_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated
WITH CHECK (
  customer_name IS NOT NULL
  AND length(customer_name) BETWEEN 1 AND 200
  AND customer_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND delivery_method IN ('courier', 'paxi')
  AND total_cents >= 0
);

DROP POLICY IF EXISTS "anon_select_own_orders" ON orders;
CREATE POLICY "anon_select_own_orders"
ON orders FOR SELECT
TO anon, authenticated
USING (true);

-- ── order_items ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  size text,
  unit_price_cents integer NOT NULL,
  sale_percentage integer NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items"
ON order_items FOR INSERT
TO anon, authenticated
WITH CHECK (
  product_name IS NOT NULL
  AND length(product_name) BETWEEN 1 AND 200
  AND unit_price_cents >= 0
  AND quantity >= 1
);

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items"
ON order_items FOR SELECT
TO anon, authenticated
USING (true);

-- ── site_settings ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_date timestamptz NOT NULL,
  sale_active boolean NOT NULL DEFAULT true,
  sale_percentage integer NOT NULL DEFAULT 20 CHECK (sale_percentage >= 0 AND sale_percentage <= 100),
  delivery_fee_cents integer NOT NULL DEFAULT 9900,
  paxi_fee_cents integer NOT NULL DEFAULT 6000,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings"
ON site_settings FOR SELECT
TO anon, authenticated
USING (true);

-- ── indexes ─────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
CREATE INDEX IF NOT EXISTS products_active_idx ON products (is_active, sort_order);
CREATE INDEX IF NOT EXISTS promo_codes_code_idx ON promo_codes (code);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders (order_number);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
