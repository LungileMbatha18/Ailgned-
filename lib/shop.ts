import type { Product, SiteSettings } from './types';

export function formatPrice(cents: number): string {
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function effectiveSalePercentage(
  product: Pick<Product, 'sale_percentage'>,
  settings: Pick<SiteSettings, 'sale_active' | 'sale_percentage'> | null,
): number {
  if (!settings) return 0;
  if (product.sale_percentage > 0) return product.sale_percentage;
  if (settings.sale_active) return settings.sale_percentage;
  return 0;
}

export function discountedPrice(
  product: Pick<Product, 'price_cents' | 'sale_percentage'>,
  settings: Pick<SiteSettings, 'sale_active' | 'sale_percentage'> | null,
): number {
  const sale = effectiveSalePercentage(product, settings);
  if (sale <= 0) return product.price_cents;
  return Math.round(product.price_cents * (1 - sale / 100));
}

export function saleDiscountAmount(
  product: Pick<Product, 'price_cents' | 'sale_percentage'>,
  settings: Pick<SiteSettings, 'sale_active' | 'sale_percentage'> | null,
): number {
  return product.price_cents - discountedPrice(product, settings);
}
