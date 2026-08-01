'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

const products = [
  { name: 'Heavyweight Tee', webp: '/images/products/heavyweight-tee.webp', png: '/images/products/heavyweight-tee.png' },
  { name: 'Oversized Hoodie', webp: '/images/products/oversized-hoodie.webp', png: '/images/products/oversized-hoodie.png' },
  { name: 'Tracksuit', webp: '/images/products/tracksuit.webp', png: '/images/products/tracksuit.png' },
  { name: 'Beanie', webp: '/images/products/beanie.webp', png: '/images/products/beanie.png' },
  { name: 'Gym Collection', webp: '/images/products/gym-collection.webp', png: '/images/products/gym-collection.png' },
  { name: 'Tennis Collection', webp: '/images/products/tennis-collection.webp', png: '/images/products/tennis-collection.png' },
];

export function SneakPeekSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-ink px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="mb-16 text-center"
        >
          <p className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted">
            Sneak Peek
          </p>
          <h2 className="mt-4 font-canela text-4xl text-bone sm:text-6xl md:text-7xl">
            Collection 01
          </h2>
          <p className="mt-4 font-sohne text-sm text-bone-muted">
            Silhouettes only. No prices. No shopping. Only anticipation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.9, ease }}
              className="group relative aspect-[3/4] overflow-hidden bg-ink-deep"
            >
              {/* Silhouette image */}
              <picture>
                <source srcSet={p.webp} type="image/webp" />
                <img
                  src={p.png}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-40 brightness-[0.3] contrast-125 transition-all duration-700 group-hover:opacity-60 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

              {/* Name */}
              <div className="absolute inset-0 flex items-end justify-center p-8">
                <div className="text-center">
                  <p className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
                    0{i + 1}
                  </p>
                  <h3 className="mt-2 font-canela text-xl text-bone sm:text-2xl">
                    {p.name}
                  </h3>
                </div>
              </div>

              {/* Hover line */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-sage transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
