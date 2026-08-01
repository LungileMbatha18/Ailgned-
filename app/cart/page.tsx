'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { PageBackLink } from '@/components/page-back-link';
import { FooterSection } from '@/components/sections/footer-section';
import { useCart } from '@/lib/cart-context';
import { useShopData } from '@/hooks/use-shop';
import { formatPrice, discountedPrice, saleDiscountAmount, effectiveSalePercentage } from '@/lib/shop';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const { settings } = useShopData();

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const totalSaleSavings = items.reduce(
    (sum, i) => sum + saleDiscountAmount(i, settings) * i.quantity,
    0,
  );
  const discountedSubtotal = items.reduce(
    (sum, i) => sum + discountedPrice(i, settings) * i.quantity,
    0,
  );

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
            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'Empty'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 1.2, ease }}
            className="mt-4 font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl"
          >
            Your Cart
          </motion.h1>
        </section>

        {/* Cart content */}
        <section className="relative w-full px-6 pb-32">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
                {/* Items */}
                <div className="space-y-px bg-white/[0.06]">
                  {items.map((item) => {
                    const sale = effectiveSalePercentage(item, settings);
                    const finalPrice = discountedPrice(item, settings);
                    const originalPrice = item.price_cents;

                    return (
                      <div
                        key={`${item.product_id}-${item.size}`}
                        className="flex gap-4 bg-ink-deep p-5 sm:gap-6 sm:p-6"
                      >
                        {/* Image */}
                        <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden bg-ink sm:h-32 sm:w-28">
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

                        {/* Details */}
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-canela text-lg text-bone">
                                {item.name}
                              </h3>
                              <p className="mt-1 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
                                Size — {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product_id, item.size)}
                              className="text-bone-muted transition-colors hover:text-red-400"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-end justify-between pt-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-white/10">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.size,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="flex h-8 w-8 items-center justify-center text-bone-muted transition-colors hover:text-bone disabled:opacity-30"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" strokeWidth={2} />
                              </button>
                              <span className="w-8 text-center font-sohne text-sm tabular-nums text-bone">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.size,
                                    item.quantity + 1,
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-bone-muted transition-colors hover:text-bone"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" strokeWidth={2} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="font-sohne text-sm text-bone">
                                {formatPrice(finalPrice * item.quantity)}
                              </p>
                              {sale > 0 && (
                                <p className="font-sohne text-xs text-bone-muted line-through">
                                  {formatPrice(originalPrice * item.quantity)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="lg:sticky lg:top-8 lg:self-start">
                  <div className="glass rounded-sm p-6 sm:p-8">
                    <h2 className="mb-6 font-canela text-xl text-bone sm:text-2xl">
                      Order Summary
                    </h2>

                    <div className="space-y-3">
                      <div className="flex justify-between font-sohne text-sm text-bone-muted">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>

                      {totalSaleSavings > 0 && (
                        <div className="flex justify-between font-sohne text-sm text-sage">
                          <span>Opening Sale Discount</span>
                          <span>−{formatPrice(totalSaleSavings)}</span>
                        </div>
                      )}

                      <div className="h-px w-full bg-white/[0.08]" />

                      <div className="flex justify-between font-sohne text-base text-bone">
                        <span>Total</span>
                        <span>{formatPrice(discountedSubtotal)}</span>
                      </div>

                      {totalSaleSavings > 0 && (
                        <p className="pt-2 font-sohne text-[10px] uppercase tracking-[0.2em] text-sage">
                          You save {formatPrice(totalSaleSavings)}
                        </p>
                      )}
                    </div>

                    <p className="mt-6 font-sohne text-[10px] uppercase tracking-[0.2em] text-bone-muted">
                      Delivery &amp; promo codes applied at checkout
                    </p>

                    <Link
                      href="/checkout"
                      className="btn-luxury group mt-6 flex items-center justify-center gap-3 border border-white/15 px-6 py-3.5 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10"
                    >
                      Proceed to Checkout
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={2}
                      />
                    </Link>

                    <Link
                      href="/shop"
                      className="mt-4 flex items-center justify-center gap-2 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted transition-colors hover:text-bone"
                    >
                      <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <FooterSection />
      </main>
    </>
  );
}

function EmptyCart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[50vh] w-full flex-col items-center justify-center px-6 py-32 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
          <ShoppingBag className="h-6 w-6 text-bone-muted" strokeWidth={1.5} />
        </div>
        <h2 className="font-canela text-2xl text-bone sm:text-3xl">
          Your cart is empty
        </h2>
        <p className="mt-3 max-w-sm font-sohne text-sm leading-relaxed text-bone-muted">
          Explore the collection and add pieces to your cart.
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
      </motion.div>
    </section>
  );
}
