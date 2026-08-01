'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PageBackLink } from '@/components/page-back-link';
import { FooterSection } from '@/components/sections/footer-section';
import { EmailCapture } from '@/components/email-capture';
import { Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const benefits = [
  { title: 'Early Collection Access', desc: 'Shop before the public launch. Priority access to every drop.' },
  { title: 'Exclusive Launch Discounts', desc: 'Subscriber-only pricing on opening day and limited releases.' },
  { title: 'Members-only Drops', desc: 'Capsule releases available exclusively to the priority list.' },
  { title: 'Editorial Journal', desc: 'Studio notes, design philosophy, and behind-the-scenes process.' },
  { title: 'First Release Notifications', desc: 'Be the first to know when new collections go live.' },
  { title: 'Event Invitations', desc: 'Private fittings, pop-ups, and brand experiences.' },
];

export default function NewsletterPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const benefitsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-10%' });

  const signupRef = useRef(null);
  const signupInView = useInView(signupRef, { once: true, margin: '-10%' });

  return (
    <>
      <div className="grain-overlay" />
      <main className="relative w-full bg-ink">
        <PageBackLink />

        {/* Hero */}
        <section
          ref={heroRef}
          className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted sm:text-xs"
          >
            Priority List
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.2, ease }}
            className="mt-6 font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl md:text-8xl"
          >
            Newsletter
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8, ease }}
            className="mt-6 max-w-xl font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base"
          >
            Join the first alignment. Receive early access, exclusive offers, and
            invitations to members-only drops.
          </motion.p>
        </section>

        {/* Benefits */}
        <section
          ref={benefitsRef}
          className="relative w-full px-6 py-20"
        >
          <div className="mx-auto max-w-5xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={benefitsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12 text-center font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted"
            >
              What You Receive
            </motion.p>

            <div className="grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.8, ease }}
                  className="group bg-ink-deep p-8"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-sage/30 bg-sage/10">
                    <Check className="h-4 w-4 text-sage" strokeWidth={2.5} />
                  </div>
                  <h3 className="mb-2 font-canela text-lg text-bone">
                    {b.title}
                  </h3>
                  <p className="font-sohne text-sm leading-relaxed text-bone-muted">
                    {b.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Signup CTA */}
        <section
          ref={signupRef}
          className="relative flex min-h-[60vh] w-full items-center justify-center bg-ink-deep px-6 py-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={signupInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease }}
            className="mx-auto w-full max-w-lg text-center"
          >
            <p className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted">
              Join The First Alignment
            </p>
            <h2 className="mt-4 font-canela text-4xl text-bone sm:text-5xl">
              Become one of the first
            </h2>
            <div className="mx-auto mt-8 h-px w-12 bg-white/15" />
            <div className="mt-10">
              <EmailCapture variant="full" />
            </div>
          </motion.div>
        </section>

        <FooterSection />
      </main>
    </>
  );
}
