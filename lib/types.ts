export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price_cents: number;
  sale_percentage: number;
  image_webp: string | null;
  image_png: string | null;
  sizes: string[];
  is_active: boolean;
  sort_order: number;
};

export type SiteSettings = {
  launch_date: string;
  sale_active: boolean;
  sale_percentage: number;
  delivery_fee_cents: number;
  paxi_fee_cents: number;
};

export type PromoCode = {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
};

export type CartItem = {
  product_id: string;
  name: string;
  slug: string;
  price_cents: number;
  sale_percentage: number;
  image_webp: string | null;
  image_png: string | null;
  size: string;
  quantity: number;
};
