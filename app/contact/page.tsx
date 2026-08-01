'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, Instagram, Music2 } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { PageBackLink } from '@/components/page-back-link';
import { FooterSection } from '@/components/sections/footer-section';

const ease = [0.22, 1, 0.36, 1] as const;

const CONTACT_EMAIL = 'lungile_mbatha@outlook.com';

const channels = [
  {
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    icon: Mail,
  },
  {
    label: 'Instagram',
    value: '@ailgned.studio',
    href: 'https://instagram.com/ailgned.studio',
    icon: Instagram,
  },
  {
    label: 'TikTok',
    value: '@ailgned.studio',
    href: 'https://tiktok.com/@ailgned.studio',
    icon: Music2,
  },
];

export default function ContactPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-10%' });

  const channelsRef = useRef(null);
  const channelsInView = useInView(channelsRef, { once: true, margin: '-10%' });

  return (
    <>
      <div className="grain-overlay" />
      <main className="relative w-full bg-ink">
        {/* Back link */}
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
            Get in Touch
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.2, ease }}
            className="mt-6 font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl md:text-8xl"
          >
            Contact
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8, ease }}
            className="mt-6 max-w-xl font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base"
          >
            Questions, collaborations, press inquiries, or just want to say hello —
            we&apos;d love to hear from you.
          </motion.p>
        </section>

        {/* Form + Channels */}
        <section
          ref={formRef}
          className="relative w-full px-6 pb-32"
        >
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.5fr_1fr]">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease }}
              className="glass rounded-sm p-8 sm:p-12"
            >
              <h2 className="mb-2 font-canela text-2xl text-bone sm:text-3xl">
                Send a Message
              </h2>
              <p className="mb-10 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
                We typically respond within 48 hours
              </p>
              <ContactForm />
            </motion.div>

            {/* Channels */}
            <motion.div
              ref={channelsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={channelsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 1, ease }}
              className="flex flex-col gap-8"
            >
              <div>
                <h3 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                  Other Channels
                </h3>
                <ul className="space-y-6">
                  {channels.map((c) => {
                    const Icon = c.icon;
                    return (
                      <li key={c.label}>
                        <a
                          href={c.href}
                          target={c.href.startsWith('http') ? '_blank' : undefined}
                          rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="group flex items-start gap-4"
                        >
                          <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-colors group-hover:border-sage/40 group-hover:bg-sage/5">
                            <Icon className="h-4 w-4 text-bone-muted transition-colors group-hover:text-sage" strokeWidth={1.75} />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
                              {c.label}
                            </span>
                            <span className="mt-1 font-sohne text-sm text-bone transition-colors group-hover:text-sage">
                              {c.value}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="h-px w-full bg-white/[0.06]" />

              <div>
                <h3 className="mb-3 font-canela text-xl text-bone sm:text-2xl">
                  Studio
                </h3>
                <p className="font-sohne text-sm leading-relaxed text-bone-muted">
                  AILGNED is a purpose-driven apparel studio. We operate remotely and
                  ship worldwide.
                </p>
                <p className="mt-4 font-canela text-lg italic text-bone-muted">
                  Align Your Purpose.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <FooterSection />
      </main>
    </>
  );
}
