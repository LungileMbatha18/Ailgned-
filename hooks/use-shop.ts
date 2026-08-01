'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, SiteSettings } from '@/lib/types';

export function useShopData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        ]);

        if (cancelled) return;

        if (productsRes.error) throw productsRes.error;
        if (settingsRes.error) throw settingsRes.error;

        setProducts((productsRes.data as Product[]) ?? []);
        setSettings((settingsRes.data as SiteSettings) ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load shop data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, settings, loading, error };
}

export function useLaunchStatus(settings: SiteSettings | null) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!settings) return;

    const check = () => {
      const now = new Date().getTime();
      const launch = new Date(settings.launch_date).getTime();
      setIsLaunched(now >= launch);
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  return { isLaunched: mounted && isLaunched, mounted };
}
