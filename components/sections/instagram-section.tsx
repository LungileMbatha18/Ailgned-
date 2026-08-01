'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const images = [
  { webp: '/images/campaign/campaign-01.webp', png: '/images/campaign/campaign-01.png' },
  { webp: '/images/campaign/campaign-02.webp', png: '/images/campaign/campaign-02.png' },
  { webp: '/images/campaign/campaign-03.webp', png: '/images/campaign/campaign-03.png' },
  { webp: '/images/campaign/campaign-04.webp', png: '/images/campaign/campaign-04.png' },
  { webp: '/images/campaign/campaign-05.webp', png: '/images/campaign/campaign-05.png' },
  { webp: '/images/campaign/campaign-06.webp', png: '/images/campaign/campaign-06.png' },
];

export function InstagramSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-ink-deep px-6 py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="mb-12 text-center"
        >
          <p className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted">
            Campaign
          </p>
          <h2 className="mt-4 font-canela text-4xl text-bone sm:text-6xl">
            @ailgned.studio
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
          {images.map((img, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/ailgned.studio"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease }}
              className="group relative aspect-square overflow-hidden bg-ink"
            >
              <picture>
                <source srcSet={img.webp} type="image/webp" />
                <img
                  src={img.png}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
              </picture>
              <div className="absolute inset-0 bg-ink/30 transition-opacity duration-500 group-hover:bg-ink/10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-bone" strokeWidth={1.5} />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 text-center"
        >
          <a
            href="https://instagram.com/ailgned.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury inline-flex items-center gap-2 border border-white/15 px-8 py-3 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
            Follow @ailgned.studio
          </a>
        </motion.div>
      </div>
    </section>
  );
}
