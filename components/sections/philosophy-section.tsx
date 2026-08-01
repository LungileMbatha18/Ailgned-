'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export function PhilosophySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  const lines = [
    'Purpose isn\'t found.',
    'It\'s built.',
    'One decision.',
    'One discipline.',
    'One day at a time.',
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink-deep px-6 py-32"
    >
      <div className="max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted"
        >
          Brand Philosophy
        </motion.p>

        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.8, ease }}
            className="font-canela text-2xl leading-relaxed text-bone sm:text-3xl md:text-4xl"
          >
            {line}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.8, ease }}
          className="mx-auto mt-12 h-px w-16 bg-sage"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.8, ease }}
          className="mt-8 font-canela text-xl italic text-sage sm:text-2xl"
        >
          Everything begins with alignment.
        </motion.p>
      </div>
    </section>
  );
}
