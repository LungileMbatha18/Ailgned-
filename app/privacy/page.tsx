'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageBackLink } from '@/components/page-back-link';
import { FooterSection } from '@/components/sections/footer-section';

const ease = [0.22, 1, 0.36, 1] as const;

type Group = {
  heading?: string;
  items: string[];
};

type Section = {
  number: string;
  title: string;
  intro?: string;
  groups?: Group[];
  closing?: string;
};

const sections: Section[] = [
  {
    number: '1',
    title: 'Information We Collect',
    intro: 'We may collect the following information when you interact with AILGNED.',
    groups: [
      {
        heading: 'Personal Information',
        items: [
          'Full name',
          'Email address',
          'Phone number (if provided)',
          'Shipping address',
          'Billing address',
          'Payment details (processed securely by third-party payment providers)',
          'Social media usernames (if you contact us through social platforms)',
        ],
      },
      {
        heading: 'Account Information',
        items: [
          'Username',
          'Password (encrypted)',
          'Order history',
          'Wishlist',
          'Preferences',
        ],
      },
      {
        heading: 'Newsletter & Waitlist',
        items: [
          'Email address',
          'Country or region (optional)',
          'Marketing preferences',
        ],
      },
    ],
  },
  {
    number: '2',
    title: 'Information We Automatically Collect',
    intro:
      'When you visit our website, certain information may be collected automatically, including:',
    groups: [
      {
        items: [
          'Device type',
          'Browser type',
          'IP address',
          'Operating system',
          'Language settings',
          'Website activity',
          'Pages visited',
          'Time spent on pages',
          'Referral source',
          'Cookies and similar technologies',
        ],
      },
    ],
    closing: 'This information helps us improve the performance and experience of our website.',
  },
  {
    number: '3',
    title: 'How We Use Your Information',
    intro: 'We use your information to:',
    groups: [
      {
        items: [
          'Process and fulfill orders',
          'Deliver products',
          'Send order confirmations',
          'Provide customer support',
          'Respond to enquiries',
          'Improve our products and website',
          'Personalize your shopping experience',
          'Send newsletters and launch announcements',
          'Notify you of new collections',
          'Share exclusive promotions and early-access opportunities',
          'Prevent fraud and protect our business',
          'Comply with legal obligations',
        ],
      },
    ],
  },
  {
    number: '4',
    title: 'Email Marketing',
    intro: 'If you subscribe to our newsletter or waitlist, we may send:',
    groups: [
      {
        items: [
          'Collection launch announcements',
          'Exclusive access invitations',
          'Product updates',
          'Promotional offers',
          'Event invitations',
          'Brand news',
          'Limited edition release notifications',
        ],
      },
    ],
    closing:
      'You can unsubscribe at any time by clicking the "Unsubscribe" link included in our emails.',
  },
  {
    number: '5',
    title: 'Cookies',
    intro: 'Our website uses cookies to:',
    groups: [
      {
        items: [
          'Remember your preferences',
          'Improve website performance',
          'Analyze visitor behaviour',
          'Enhance security',
          'Measure marketing effectiveness',
        ],
      },
    ],
    closing:
      'You may disable cookies through your browser settings, although some website features may not function correctly.',
  },
  {
    number: '6',
    title: 'Sharing Your Information',
    intro: 'AILGNED does not sell your personal information.',
    closing:
      'We may share your information only with trusted service providers required to operate our business, including payment processors, shipping and logistics providers, email marketing platforms, website hosting providers, analytics providers, and customer support services. These providers are only permitted to use your information for services performed on our behalf.',
  },
  {
    number: '7',
    title: 'Payment Information',
    intro:
      'Payments are processed securely through trusted third-party payment providers. AILGNED does not store your complete credit or debit card information on our servers.',
  },
  {
    number: '8',
    title: 'Data Security',
    intro:
      'We implement appropriate technical and organizational measures to protect your information against unauthorized access, loss, misuse, disclosure, alteration, and destruction. While we strive to protect your data, no method of electronic storage or internet transmission is completely secure.',
  },
  {
    number: '9',
    title: 'Data Retention',
    intro:
      'We retain personal information only for as long as necessary to complete purchases, provide customer service, meet legal obligations, resolve disputes, and enforce agreements. When no longer required, your information is securely deleted or anonymized.',
  },
  {
    number: '10',
    title: 'Your Rights',
    intro: 'Depending on your location, you may have the right to:',
    groups: [
      {
        items: [
          'Access your personal information',
          'Correct inaccurate information',
          'Delete your information',
          'Restrict processing',
          'Object to marketing communications',
          'Withdraw consent',
          'Request a copy of your data',
          'Lodge a complaint with your local data protection authority',
        ],
      },
    ],
    closing: 'To exercise these rights, please contact us using the details in Section 16.',
  },
  {
    number: '11',
    title: 'Third-Party Services',
    intro:
      'Our website may contain links to third-party websites or services. AILGNED is not responsible for the privacy practices or content of external websites. We encourage you to review their privacy policies before providing any personal information.',
  },
  {
    number: '12',
    title: "Children's Privacy",
    intro:
      'Our website is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has submitted personal information, we will promptly delete it.',
  },
  {
    number: '13',
    title: 'International Users',
    intro:
      'If you access our website from outside South Africa, your information may be transferred, processed, and stored in countries where our service providers operate. By using our website, you consent to these transfers where permitted by applicable law.',
  },
  {
    number: '14',
    title: 'Compliance with POPIA',
    intro:
      'AILGNED is committed to protecting personal information in accordance with the Protection of Personal Information Act, 2013 (POPIA) of South Africa. We process personal information lawfully, transparently, and only for legitimate business purposes. Where required, we obtain consent before collecting or processing personal information.',
  },
  {
    number: '15',
    title: 'Changes to This Policy',
    intro:
      'We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.',
  },
];

export default function PrivacyPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-10%' });

  return (
    <>
      <div className="grain-overlay" />
      <main className="relative w-full bg-ink">
        {/* Back link */}
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
            Legal
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.2, ease }}
            className="mt-6 font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl md:text-8xl"
          >
            Privacy Policy
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <p className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
              Effective Date — January 1, 2026
            </p>
            <p className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted/60">
              Last Updated — January 1, 2026
            </p>
          </motion.div>
        </section>

        {/* Intro statement */}
        <section className="relative w-full px-6 pb-16">
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease }}
            className="mx-auto max-w-3xl"
          >
            <div className="glass rounded-sm p-8 sm:p-12">
              <p className="font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base">
                At <span className="text-bone">AILGNED</span>, we value your privacy and
                are committed to protecting your personal information. This Privacy Policy
                explains how we collect, use, store, and protect your information when you
                visit our website, subscribe to our newsletter, join our waitlist, or
                purchase our products.
              </p>
              <div className="mx-auto mt-8 h-px w-12 bg-white/15" />
              <p className="mt-8 text-center font-canela text-lg italic text-bone-muted">
                By using our website, you agree to the practices described in this Privacy
                Policy.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Sections */}
        <section className="relative w-full px-6 pb-32">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-24">
              {sections.map((section) => (
                <PrivacySection key={section.number} section={section} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section className="relative w-full px-6 pb-32">
          <div className="mx-auto max-w-3xl">
            <ContactBlock />
          </div>
        </section>

        {/* Commitment */}
        <section className="relative w-full px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-6 font-canela text-3xl tracking-[0.05em] text-bone sm:text-4xl">
              Our Commitment
            </h2>
            <div className="mx-auto mb-8 h-px w-12 bg-white/15" />
            <p className="font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base">
              At <span className="text-bone">AILGNED</span>, we believe that trust is
              built through transparency. Just as we are intentional in designing every
              garment, we are equally committed to protecting the information you share
              with us. Your privacy is respected, your data is handled responsibly, and
              your experience with AILGNED is designed to be secure, seamless, and worthy
              of your trust.
            </p>
          </motion.div>
        </section>

        <FooterSection />
      </main>
    </>
  );
}

function PrivacySection({ section }: { section: Section }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease }}
    >
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-canela text-2xl text-sage/70">
          {section.number}
        </span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <h2 className="mb-5 font-canela text-2xl tracking-wide text-bone sm:text-3xl">
        {section.title}
      </h2>

      {section.intro && (
        <p className="mb-6 font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base">
          {section.intro}
        </p>
      )}

      {section.groups?.map((group, i) => (
        <div key={i} className={group.heading ? 'mb-6' : ''}>
          {group.heading && (
            <h3 className="mb-3 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone">
              {group.heading}
            </h3>
          )}
          <ul className="space-y-2.5">
            {group.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-sohne text-sm leading-relaxed text-bone-muted"
              >
                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-sage/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {section.closing && (
        <p className="mt-6 font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base">
          {section.closing}
        </p>
      )}
    </motion.article>
  );
}

function ContactBlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease }}
      className="glass rounded-sm p-8 sm:p-12"
    >
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-canela text-2xl text-sage/70">16</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <h2 className="mb-5 font-canela text-2xl tracking-wide text-bone sm:text-3xl">
        Contact Us
      </h2>

      <p className="mb-8 font-sohne text-sm leading-relaxed tracking-wide text-bone-muted sm:text-base">
        If you have any questions about this Privacy Policy or how your information is
        handled, please contact us.
      </p>

      <div className="space-y-6">
        <div>
          <p className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone">
            AILGNED
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ContactRow
            label="Email"
            value="privacy@ailgned.com"
            href="mailto:privacy@ailgned.com"
          />
          <ContactRow
            label="Customer Support"
            value="support@ailgned.com"
            href="mailto:support@ailgned.com"
          />
        </div>

        <div className="h-px w-full bg-white/[0.08]" />

        <div>
          <p className="mb-1 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
            Website
          </p>
          <a
            href="http://www.ailgned.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sohne text-sm text-bone transition-colors hover:text-sage"
          >
            www.ailgned.com
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div>
      <p className="mb-1 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
        {label}
      </p>
      <a
        href={href}
        className="font-sohne text-sm text-bone transition-colors hover:text-sage"
      >
        {value}
      </a>
    </div>
  );
}
