'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export function StatementSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  const lines = [
    'NOT EVERYONE',
    'CHASES ATTENTION.',
    'SOME CHOOSE',
    'PURPOSE.',
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink px-6 py-32"
    >
      <div className="max-w-5xl text-center">
        {lines.map((line, i) => (
          <motion.h2
            key={i}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: i * 0.25,
              duration: 1,
              ease,
            }}
            className={`font-canela text-4xl leading-[1.1] tracking-tight text-bone sm:text-6xl md:text-7xl lg:text-8xl ${
              i >= 2 ? 'italic text-sage' : ''
            }`}
          >
            {line}
          </motion.h2>
        ))}
      </div>
    </section>
  );
}
