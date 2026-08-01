'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Check } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const benefits = [
  'Early Access',
  'Collection Previews',
  'Exclusive Offers',
  'Members-only Releases',
];

export function EmailCapture({ variant = 'hero' }: { variant?: 'hero' | 'full' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'landing_page' });

      if (error) {
        if (error.code === '23505') {
          setStatus('success');
          return;
        }
        throw error;
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const isFull = variant === 'full';

  return (
    <div className={isFull ? 'w-full' : 'w-full max-w-md'}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-sm p-8 text-center sm:p-12"
          >
            <h3 className="font-canela text-2xl text-bone sm:text-3xl">
              WELCOME TO AILGNED.
            </h3>
            <p className="mt-3 font-sohne text-sm tracking-wide text-bone-muted">
              You&apos;re now aligned.
            </p>
            <div className="mx-auto my-6 h-px w-12 bg-white/15" />
            <p className="font-sohne text-xs uppercase tracking-[0.2em] text-bone-muted">
              You&apos;ll receive:
            </p>
            <ul className="mt-4 space-y-2">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center justify-center gap-2 font-sohne text-sm text-bone"
                >
                  <Check className="h-3.5 w-3.5 text-sage" strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-canela text-lg italic text-bone-muted">
              See you soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div
              className={`flex flex-col gap-3 ${
                isFull ? 'sm:flex-row sm:items-center' : ''
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your email"
                disabled={status === 'loading'}
                className="flex-1 border-b border-white/15 bg-transparent px-1 py-3 font-sohne text-sm text-bone placeholder:text-bone-muted/50 focus:border-sage focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-luxury group flex items-center justify-center gap-3 border border-white/15 px-8 py-3 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-bone border-t-transparent" />
                ) : (
                  <>
                    Join
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </>
                )}
              </button>
            </div>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 font-sohne text-xs text-red-400/80"
              >
                {errorMsg}
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
