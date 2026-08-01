'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useShopData, useLaunchStatus } from '@/hooks/use-shop';
import { ShoppingBag } from 'lucide-react';

export function FloatingCartButton() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { settings } = useShopData();
  const { isLaunched, mounted } = useLaunchStatus(settings);

  // Only show on shop pages, not on cart/checkout themselves
  if (pathname === '/cart' || pathname === '/checkout') return null;
  if (itemCount === 0) return null;

  // Navbar (post-launch) has its own cart icon
  if (mounted && isLaunched) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 border border-sage/30 bg-ink/90 px-4 py-3 backdrop-blur-md transition-all hover:border-sage hover:bg-sage/10 sm:bottom-8 sm:right-8"
    >
      <ShoppingBag className="h-4 w-4 text-bone" strokeWidth={2} />
      <span className="font-sohne text-xs text-bone">
        {itemCount} item{itemCount > 1 ? 's' : ''}
      </span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage font-sohne text-[10px] font-medium text-ink">
        {itemCount}
      </span>
    </Link>
  );
}
