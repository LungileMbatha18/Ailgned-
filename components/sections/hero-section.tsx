'use client';

import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/countdown-timer';
import { EmailCapture } from '@/components/email-capture';

const LAUNCH_DATE = new Date('2026-09-01T10:00:00');

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/images/hero/hero-bg.webp" type="image/webp" />
          <img
            src="/images/hero/hero-bg.png"
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center px-6 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted sm:text-xs"
        >
          Est. 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease }}
          className="mt-6 font-canela text-6xl tracking-[0.05em] text-bone sm:text-8xl md:text-9xl"
        >
          AILGNED
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease }}
          className="mt-4 font-sohne text-xs uppercase tracking-[0.35em] text-bone-muted sm:text-sm"
        >
          Align Your Purpose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <span className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
            Collection 01
          </span>
          <span className="font-canela text-lg italic text-bone">Coming Soon</span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease }}
          className="mt-12"
        >
          <CountdownTimer target={LAUNCH_DATE} />
        </motion.div>

        {/* Email capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease }}
          className="mt-14 w-full max-w-md"
        >
          <p className="mb-4 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
            Join the Priority List
          </p>
          <EmailCapture variant="hero" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sohne text-[9px] uppercase tracking-[0.3em] text-bone-muted">
            Scroll
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-bone-muted/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
