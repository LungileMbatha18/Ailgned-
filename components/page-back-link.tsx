'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useShopData, useLaunchStatus } from '@/hooks/use-shop';

export function PageBackLink({ href = '/', label = 'Back to Home' }: { href?: string; label?: string }) {
  const { settings } = useShopData();
  const { isLaunched, mounted } = useLaunchStatus(settings);

  if (mounted && isLaunched) return null;

  return (
    <div className="absolute left-6 top-8 z-20 sm:left-10">
      <Link
        href={href}
        className="group inline-flex items-center gap-2 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted transition-colors hover:text-bone"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          strokeWidth={2}
        />
        {label}
      </Link>
    </div>
  );
}
