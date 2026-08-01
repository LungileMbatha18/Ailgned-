'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CountdownTimer } from '@/components/countdown-timer';

const ease = [0.22, 1, 0.36, 1] as const;

const LAUNCH_DATE = new Date('2026-09-01T10:00:00');

export function CountdownSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink px-6 py-32"
    >
      <div className="flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted"
        >
          Collection 01
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="mt-6 font-canela text-4xl text-bone sm:text-6xl md:text-7xl"
        >
          Launching In
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease }}
          className="mt-12"
        >
          <CountdownTimer target={LAUNCH_DATE} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6, ease }}
          className="mt-16 h-px w-16 bg-sage"
        />
      </div>
    </section>
  );
}
