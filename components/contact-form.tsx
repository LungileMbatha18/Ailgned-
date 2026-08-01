'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Check, ArrowRight } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('error');
      setErrorMsg('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({ name: form.name, email: form.email, subject: form.subject, message: form.message });

      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const fields = [
    { key: 'name' as const, label: 'Name', type: 'text', placeholder: 'Your full name' },
    { key: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { key: 'subject' as const, label: 'Subject', type: 'text', placeholder: 'What is this about?' },
  ];

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease }}
          className="glass rounded-sm p-8 text-center sm:p-12"
        >
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-sage/30 bg-sage/10">
            <Check className="h-5 w-5 text-sage" strokeWidth={2.5} />
          </div>
          <h3 className="font-canela text-2xl text-bone sm:text-3xl">
            MESSAGE SENT.
          </h3>
          <p className="mt-3 font-sohne text-sm tracking-wide text-bone-muted">
            Thank you for reaching out. We&apos;ll get back to you shortly.
          </p>
          <div className="mx-auto my-6 h-px w-12 bg-white/15" />
          <button
            onClick={() => setStatus('idle')}
            className="font-sohne text-xs uppercase tracking-[0.2em] text-bone-muted transition-colors hover:text-bone"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full space-y-8"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className={field.key === 'subject' ? 'sm:col-span-2' : ''}
              >
                <label className="mb-3 block font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={handleChange(field.key)}
                  placeholder={field.placeholder}
                  disabled={status === 'loading'}
                  className="w-full border-b border-white/15 bg-transparent px-1 py-3 font-sohne text-sm text-bone placeholder:text-bone-muted/40 transition-colors focus:border-sage focus:outline-none disabled:opacity-50"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-3 block font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
              Message
            </label>
            <textarea
              rows={6}
              value={form.message}
              onChange={handleChange('message')}
              placeholder="Tell us what's on your mind..."
              disabled={status === 'loading'}
              className="w-full resize-none border-b border-white/15 bg-transparent px-1 py-3 font-sohne text-sm text-bone placeholder:text-bone-muted/40 transition-colors focus:border-sage focus:outline-none disabled:opacity-50"
            />
          </div>

          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-sohne text-xs text-red-400/80"
            >
              {errorMsg}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-luxury group flex items-center justify-center gap-3 border border-white/15 px-8 py-4 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border border-bone border-t-transparent" />
            ) : (
              <>
                Send Message
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
