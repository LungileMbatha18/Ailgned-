'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PageBackLink } from '@/components/page-back-link';
import { FooterSection } from '@/components/sections/footer-section';
import { useCart } from '@/lib/cart-context';
import { useShopData } from '@/hooks/use-shop';
import { formatPrice, discountedPrice, saleDiscountAmount, effectiveSalePercentage } from '@/lib/shop';
import { supabase } from '@/lib/supabase';
import { Check, ArrowRight, ArrowLeft, Truck, MapPin, Tag, Loader2, ShoppingBag, type LucideIcon } from 'lucide-react';
import type { PromoCode } from '@/lib/types';

const ease = [0.22, 1, 0.36, 1] as const;

type DeliveryMethod = 'courier' | 'paxi';

type FormData = {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  paxiPoint: string;
  city: string;
  province: string;
  postalCode: string;
};

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  deliveryMethod: 'courier',
  address: '',
  paxiPoint: '',
  city: '',
  province: '',
  postalCode: '',
};

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
];

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { settings } = useShopData();

  const [form, setForm] = useState<FormData>(initialForm);
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-10%' });

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  const saleSavings = items.reduce(
    (sum, i) => sum + saleDiscountAmount(i, settings) * i.quantity,
    0,
  );
  const discountedSubtotal = items.reduce(
    (sum, i) => sum + discountedPrice(i, settings) * i.quantity,
    0,
  );
  const promoDiscount = promoApplied
    ? Math.round(discountedSubtotal * (promoApplied.discount_percentage / 100))
    : 0;
  const deliveryFee = items.length > 0
    ? form.deliveryMethod === 'paxi'
      ? (settings?.paxi_fee_cents ?? 6000)
      : (settings?.delivery_fee_cents ?? 9900)
    : 0;
  const total = Math.max(0, discountedSubtotal - promoDiscount) + deliveryFee;

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    setPromoApplied(null);

    try {
      const code = promoInput.trim().toUpperCase();
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setPromoError('Invalid or expired promo code.');
        return;
      }

      const promo = data as PromoCode;
      const now = new Date();
      if (promo.valid_from && new Date(promo.valid_from) > now) {
        setPromoError('This promo code is not yet active.');
        return;
      }
      if (promo.valid_until && new Date(promo.valid_until) < now) {
        setPromoError('This promo code has expired.');
        return;
      }
      if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
        setPromoError('This promo code has reached its usage limit.');
        return;
      }

      setPromoApplied(promo);
    } catch {
      setPromoError('Failed to validate promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoInput('');
    setPromoError('');
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (form.deliveryMethod === 'courier') {
      if (!form.address.trim()) return 'Please enter your delivery address.';
      if (!form.city.trim()) return 'Please enter your city.';
      if (!form.province.trim()) return 'Please select your province.';
      if (!form.postalCode.trim()) return 'Please enter your postal code.';
    } else {
      if (!form.paxiPoint.trim()) return 'Please enter your Paxi pickup point.';
      if (!form.city.trim()) return 'Please enter your city.';
      if (!form.province.trim()) return 'Please select your province.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-order`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      };

      const orderPayload = {
        customer_name: form.name.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim() || null,
        delivery_method: form.deliveryMethod,
        delivery_address: form.deliveryMethod === 'courier' ? form.address.trim() : null,
        paxi_pickup_point: form.deliveryMethod === 'paxi' ? form.paxiPoint.trim() : null,
        city: form.city.trim() || null,
        province: form.province.trim() || null,
        postal_code: form.deliveryMethod === 'courier' ? form.postalCode.trim() : null,
        subtotal_cents: subtotal,
        sale_discount_cents: saleSavings,
        promo_code: promoApplied?.code ?? null,
        promo_discount_cents: promoDiscount,
        delivery_fee_cents: deliveryFee,
        total_cents: total,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.name,
          size: item.size,
          unit_price_cents: item.price_cents,
          sale_percentage: effectiveSalePercentage(item, settings),
          quantity: item.quantity,
        })),
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${response.status})`);
      }

      const data = await response.json();
      if (!data.order_number) {
        throw new Error('Order created but no order number returned.');
      }

      setOrderNumber(data.order_number);
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to place order. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (orderNumber) {
    return (
      <>
        <div className="grain-overlay" />
        <main className="relative w-full bg-ink">
          <PageBackLink />
          <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 pt-32 pb-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-sage/30 bg-sage/10">
                <Check className="h-6 w-6 text-sage" strokeWidth={2.5} />
              </div>
              <p className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted">
                Order Confirmed
              </p>
              <h1 className="mt-4 font-canela text-4xl text-bone sm:text-5xl md:text-6xl">
                Thank You
              </h1>
              <div className="mx-auto my-8 h-px w-12 bg-white/15" />
              <p className="max-w-md font-sohne text-sm leading-relaxed text-bone-muted">
                Your order has been placed successfully. We&apos;ll send a
                confirmation to <span className="text-bone">{form.email}</span> shortly.
              </p>
              <div className="mt-8 border border-white/10 bg-ink-deep px-8 py-4">
                <p className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
                  Order Number
                </p>
                <p className="mt-2 font-canela text-2xl tracking-[0.1em] text-sage">
                  {orderNumber}
                </p>
              </div>
              <Link
                href="/shop"
                className="btn-luxury group mt-10 flex items-center justify-center gap-3 border border-white/15 px-8 py-3.5 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10"
              >
                Continue Shopping
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </Link>
            </motion.div>
          </section>
          <FooterSection />
        </main>
      </>
    );
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <>
        <div className="grain-overlay" />
        <main className="relative w-full bg-ink">
          <PageBackLink />
          <section className="relative flex min-h-[70vh] w-full flex-col items-center justify-center px-6 pt-32 pb-32 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
              <ShoppingBag className="h-6 w-6 text-bone-muted" strokeWidth={1.5} />
            </div>
            <h1 className="font-canela text-3xl text-bone sm:text-4xl">
              Your cart is empty
            </h1>
            <p className="mt-3 max-w-sm font-sohne text-sm text-bone-muted">
              Add items to your cart before checking out.
            </p>
            <Link
              href="/shop"
              className="btn-luxury group mt-8 flex items-center justify-center gap-3 border border-white/15 px-8 py-3.5 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10"
            >
              Browse Collection
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </section>
          <FooterSection />
        </main>
      </>
    );
  }

  return (
    <>
      <div className="grain-overlay" />
      <main className="relative w-full bg-ink">
        <PageBackLink />

        {/* Hero */}
        <section
          ref={heroRef}
          className="relative flex w-full flex-col items-center justify-center px-6 pt-32 pb-12 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted"
          >
            Almost There
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.2, ease }}
            className="mt-4 font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl"
          >
            Checkout
          </motion.h1>
        </section>

        {/* Checkout form + summary */}
        <section className="relative w-full px-6 pb-32">
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="mx-auto max-w-5xl"
          >
            <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
              {/* Left: Form fields */}
              <div className="space-y-10">
                {/* Customer details */}
                <div>
                  <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                    Contact Details
                  </h2>
                  <div className="space-y-5">
                    <Field label="Full Name" required>
                      <input
                        type="text"
                        value={form.name}
                        onChange={handleChange('name')}
                        className={inputClass}
                        placeholder="Your full name"
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        className={inputClass}
                        placeholder="you@example.com"
                      />
                    </Field>
                    <Field label="Phone (optional)">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        className={inputClass}
                        placeholder="082 123 4567"
                      />
                    </Field>
                  </div>
                </div>

                {/* Delivery method */}
                <div>
                  <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                    Delivery Method
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DeliveryOption
                      icon={Truck}
                      label="Courier Delivery"
                      description="Door-to-door courier"
                      price={formatPrice(settings?.delivery_fee_cents ?? 9900)}
                      selected={form.deliveryMethod === 'courier'}
                      onClick={() => setForm((p) => ({ ...p, deliveryMethod: 'courier' }))}
                    />
                    <DeliveryOption
                      icon={MapPin}
                      label="Paxi Pickup Point"
                      description="Collect at a Paxi point"
                      price={formatPrice(settings?.paxi_fee_cents ?? 6000)}
                      selected={form.deliveryMethod === 'paxi'}
                      onClick={() => setForm((p) => ({ ...p, deliveryMethod: 'paxi' }))}
                    />
                  </div>
                </div>

                {/* Address fields */}
                <AnimatePresence mode="wait">
                  {form.deliveryMethod === 'courier' ? (
                    <motion.div
                      key="courier"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                        Delivery Address
                      </h2>
                      <div className="space-y-5">
                        <Field label="Street Address" required>
                          <textarea
                            value={form.address}
                            onChange={handleChange('address')}
                            className={`${inputClass} resize-none`}
                            rows={2}
                            placeholder="123 Main Street, Suburb"
                          />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="City" required>
                            <input
                              type="text"
                              value={form.city}
                              onChange={handleChange('city')}
                              className={inputClass}
                              placeholder="Johannesburg"
                            />
                          </Field>
                          <Field label="Province" required>
                            <select
                              value={form.province}
                              onChange={handleChange('province')}
                              className={inputClass}
                            >
                              <option value="">Select province</option>
                              {SA_PROVINCES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                        <Field label="Postal Code" required>
                          <input
                            type="text"
                            value={form.postalCode}
                            onChange={handleChange('postalCode')}
                            className={inputClass}
                            placeholder="2000"
                          />
                        </Field>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="paxi"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                        Paxi Pickup Point
                      </h2>
                      <div className="space-y-5">
                        <Field label="Paxi Pickup Point Name / ID" required>
                          <input
                            type="text"
                            value={form.paxiPoint}
                            onChange={handleChange('paxiPoint')}
                            className={inputClass}
                            placeholder="e.g. Paxi—OK Foods Braamfontein"
                          />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="City" required>
                            <input
                              type="text"
                              value={form.city}
                              onChange={handleChange('city')}
                              className={inputClass}
                              placeholder="Johannesburg"
                            />
                          </Field>
                          <Field label="Province" required>
                            <select
                              value={form.province}
                              onChange={handleChange('province')}
                              className={inputClass}
                            >
                              <option value="">Select province</option>
                              {SA_PROVINCES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Promo code */}
                <div>
                  <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                    Promo Code
                  </h2>
                  {promoApplied ? (
                    <div className="flex items-center justify-between border border-sage/30 bg-sage/10 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Tag className="h-4 w-4 text-sage" strokeWidth={2} />
                        <div>
                          <p className="font-sohne text-sm text-bone">{promoApplied.code}</p>
                          <p className="font-sohne text-[10px] uppercase tracking-[0.2em] text-sage">
                            {promoApplied.discount_percentage}% discount applied
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removePromo}
                        className="font-sohne text-[10px] uppercase tracking-[0.2em] text-bone-muted transition-colors hover:text-bone"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          if (promoError) setPromoError('');
                        }}
                        className={inputClass}
                        placeholder="Enter promo code"
                        disabled={promoLoading}
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={promoLoading || !promoInput.trim()}
                        className="btn-luxury flex-shrink-0 border border-white/15 px-6 py-3 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10 disabled:opacity-40"
                      >
                        {promoLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="mt-2 font-sohne text-xs text-red-400/80">{promoError}</p>
                  )}
                </div>

                {/* Submit error */}
                {submitError && (
                  <div className="border border-red-400/20 bg-red-400/5 px-4 py-3">
                    <p className="font-sohne text-xs text-red-400/80">{submitError}</p>
                  </div>
                )}
              </div>

              {/* Right: Order summary */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="glass rounded-sm p-6 sm:p-8">
                  <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-4">
                    {items.map((item) => {
                      const finalPrice = discountedPrice(item, settings);
                      const sale = effectiveSalePercentage(item, settings);
                      return (
                        <div
                          key={`${item.product_id}-${item.size}`}
                          className="flex gap-3"
                        >
                          <div className="h-16 w-14 flex-shrink-0 overflow-hidden bg-ink">
                            {item.image_webp && (
                              <picture>
                                <source srcSet={item.image_webp} type="image/webp" />
                                <img
                                  src={item.image_png ?? item.image_webp}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = '0';
                                  }}
                                />
                              </picture>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col">
                            <p className="font-sohne text-sm text-bone">{item.name}</p>
                            <p className="font-sohne text-[10px] uppercase tracking-[0.2em] text-bone-muted">
                              {item.size} × {item.quantity}
                            </p>
                            <p className="mt-1 font-sohne text-xs text-bone-muted">
                              {formatPrice(finalPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 h-px w-full bg-white/[0.08]" />

                  {/* Totals */}
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between font-sohne text-sm text-bone-muted">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {saleSavings > 0 && (
                      <div className="flex justify-between font-sohne text-sm text-sage">
                        <span>Opening Sale</span>
                        <span>−{formatPrice(saleSavings)}</span>
                      </div>
                    )}
                    {promoApplied && promoDiscount > 0 && (
                      <div className="flex justify-between font-sohne text-sm text-sage">
                        <span>Promo ({promoApplied.code})</span>
                        <span>−{formatPrice(promoDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-sohne text-sm text-bone-muted">
                      <span>Delivery ({form.deliveryMethod === 'paxi' ? 'Paxi' : 'Courier'})</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>

                    <div className="h-px w-full bg-white/[0.08]" />

                    <div className="flex justify-between font-canela text-xl text-bone">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Place order */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-luxury group mt-8 flex w-full items-center justify-center gap-3 border border-white/15 px-6 py-4 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={2}
                        />
                      </>
                    )}
                  </button>

                  <Link
                    href="/cart"
                    className="mt-4 flex items-center justify-center gap-2 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted transition-colors hover:text-bone"
                  >
                    <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                    Back to Cart
                  </Link>
                </div>
              </div>
            </form>
          </motion.div>
        </section>

        <FooterSection />
      </main>
    </>
  );
}

const inputClass =
  'w-full border-b border-white/10 bg-transparent px-1 py-3 font-sohne text-sm text-bone placeholder:text-bone-muted/40 transition-colors focus:border-sage focus:outline-none';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
        {label} {required && <span className="text-sage">*</span>}
      </label>
      {children}
    </div>
  );
}

function DeliveryOption({
  icon: Icon,
  label,
  description,
  price,
  selected,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  price: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-3 border p-4 text-left transition-all ${
        selected
          ? 'border-sage bg-sage/10'
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon
          className={`h-5 w-5 ${selected ? 'text-sage' : 'text-bone-muted'}`}
          strokeWidth={1.75}
        />
        <span className="font-sohne text-xs text-bone-muted">{price}</span>
      </div>
      <div>
        <p className={`font-sohne text-sm ${selected ? 'text-bone' : 'text-bone'}`}>
          {label}
        </p>
        <p className="mt-1 font-sohne text-[10px] uppercase tracking-[0.2em] text-bone-muted">
          {description}
        </p>
      </div>
    </button>
  );
}
