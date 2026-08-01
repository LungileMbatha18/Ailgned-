'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';
import { EmailCapture } from '@/components/email-capture';

const ease = [0.22, 1, 0.36, 1] as const;

const benefits = [
  'Early Collection Access',
  'Exclusive Launch Discounts',
  'Members-only Drops',
  'Editorial Journal',
  'First Release Notifications',
];

export function JoinSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink-deep px-6 py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted"
        >
          Join The First Alignment
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="mt-6 font-canela text-4xl leading-tight text-bone sm:text-5xl md:text-6xl"
        >
          Become one of the first
          <br />
          to experience{' '}
          <span className="italic text-sage">AILGNED.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6, ease }}
          className="mx-auto mt-8 h-px w-12 bg-white/15"
        />

        <motion.ul
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mt-10 max-w-md space-y-3 text-left"
        >
          {benefits.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease }}
              className="flex items-center gap-3 font-sohne text-sm text-bone"
            >
              <Check className="h-4 w-4 shrink-0 text-sage" strokeWidth={2.5} />
              {b}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.8, ease }}
          className="mx-auto mt-12 max-w-lg"
        >
          <EmailCapture variant="full" />
        </motion.div>
      </div>
    </section>
  );
}
