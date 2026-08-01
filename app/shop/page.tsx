'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PageBackLink } from '@/components/page-back-link';
import { FooterSection } from '@/components/sections/footer-section';
import { CountdownTimer } from '@/components/countdown-timer';
import { ProductCard } from '@/components/product-card';
import { useShopData, useLaunchStatus } from '@/hooks/use-shop';
import type { Product, SiteSettings } from '@/lib/types';
import { Sparkles } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function ShopPage() {
  const { products, settings, loading, error } = useShopData();
  const { isLaunched, mounted } = useLaunchStatus(settings);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const launchDate = settings ? new Date(settings.launch_date) : null;

  return (
    <>
      <div className="grain-overlay" />
      <main className="relative w-full bg-ink">
        <PageBackLink />

        {/* Hero */}
        <section
          ref={heroRef}
          className="relative flex min-h-[55vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted sm:text-xs"
          >
            Collection 01
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.2, ease }}
            className="mt-6 font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl md:text-8xl"
          >
            Shop
          </motion.h1>

          {mounted && isLaunched && settings?.sale_active && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex items-center gap-2 border border-sage/30 bg-sage/10 px-4 py-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-sage" strokeWidth={2} />
              <span className="font-sohne text-[10px] uppercase tracking-[0.3em] text-sage">
                Opening Sale — {settings.sale_percentage}% Off Everything
              </span>
            </motion.div>
          )}

          {mounted && !isLaunched && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.8, ease }}
              className="mt-6 max-w-xl font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base"
            >
              The shop opens on launch day. Until then, explore the silhouettes
              and join the priority list for early access.
            </motion.p>
          )}
        </section>

        {/* Content */}
        {mounted && !isLaunched ? (
          <ComingSoonSection launchDate={launchDate} settings={settings} />
        ) : (
          <CatalogueSection
            products={products}
            settings={settings}
            loading={loading}
            error={error}
          />
        )}

        <FooterSection />
      </main>
    </>
  );
}

function ComingSoonSection({
  launchDate,
  settings,
}: {
  launchDate: Date | null;
  settings: SiteSettings | null;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70vh] w-full flex-col items-center justify-center px-6 py-32 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease }}
        className="flex flex-col items-center"
      >
        <p className="font-canela text-3xl italic text-bone-muted sm:text-4xl">
          Coming Soon
        </p>

        {launchDate && (
          <div className="mt-12">
            <CountdownTimer target={launchDate} />
          </div>
        )}

        {settings?.sale_active && (
          <p className="mt-12 font-sohne text-sm tracking-wide text-bone-muted">
            Opening with{' '}
            <span className="text-sage">{settings.sale_percentage}% off</span>{' '}
            everything on launch day.
          </p>
        )}

        <a
          href="/newsletter"
          className="btn-luxury group mt-10 flex items-center justify-center gap-3 border border-white/15 px-8 py-3.5 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10"
        >
          Join Priority List
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </a>
      </motion.div>
    </section>
  );
}

function CatalogueSection({
  products,
  settings,
  loading,
  error,
}: {
  products: Product[];
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <section className="relative w-full px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-ink-deep" />
                <div className="mt-5 h-4 w-20 bg-white/[0.06]" />
                <div className="mt-3 h-6 w-40 bg-white/[0.06]" />
                <div className="mt-3 h-4 w-24 bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative flex min-h-[40vh] w-full items-center justify-center px-6 py-32 text-center">
        <p className="font-sohne text-sm text-red-400/80">
          Something went wrong loading the shop. Please try again later.
        </p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="relative flex min-h-[40vh] w-full items-center justify-center px-6 py-32 text-center">
        <p className="font-sohne text-sm text-bone-muted">
          Products are being prepared. Check back soon.
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full px-6 py-16 pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
