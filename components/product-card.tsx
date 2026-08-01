'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';
import type { Product, SiteSettings } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice, discountedPrice, saleDiscountAmount, effectiveSalePercentage } from '@/lib/shop';

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductCard({
  product,
  settings,
  index,
}: {
  product: Product;
  settings: SiteSettings | null;
  index: number;
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  const sale = effectiveSalePercentage(product, settings);
  const finalPrice = discountedPrice(product, settings);
  const originalPrice = product.price_cents;
  const hasSale = sale > 0;
  const savings = saleDiscountAmount(product, settings);

  const handleAdd = () => {
    if (!selectedSize && product.sizes.length > 1) return;
    const size = selectedSize || product.sizes[0] || 'One Size';
    addItem(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ delay: index * 0.1, duration: 0.8, ease }}
      className="group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-deep">
        {product.image_webp && (
          <picture>
            {product.image_webp && (
              <source srcSet={product.image_webp} type="image/webp" />
            )}
            <img
              src={product.image_png ?? product.image_webp}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
            />
          </picture>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

        {/* Sale badge */}
        {hasSale && (
          <div className="absolute left-4 top-4 border border-sage/40 bg-ink/80 px-3 py-1 font-sohne text-[10px] uppercase tracking-[0.2em] text-sage backdrop-blur-sm">
            {sale}% Off
          </div>
        )}

        {/* Hover line */}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-sage transition-all duration-700 group-hover:w-full" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col pt-5">
        <p className="font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
          {product.category}
        </p>
        <h3 className="mt-2 font-canela text-xl text-bone sm:text-2xl">
          {product.name}
        </h3>
        <p className="mt-2 font-sohne text-sm leading-relaxed text-bone-muted line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-sohne text-lg text-bone">
            {formatPrice(finalPrice)}
          </span>
          {hasSale && (
            <span className="font-sohne text-sm text-bone-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {hasSale && (
            <span className="font-sohne text-[10px] uppercase tracking-[0.2em] text-sage">
              Save {formatPrice(savings)}
            </span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes.length > 1 && (
          <div className="mt-5">
            <p className="mb-2 font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted">
              Select Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[2.75rem] border px-3 py-2 font-sohne text-xs tracking-wide transition-colors ${
                    selectedSize === size
                      ? 'border-sage bg-sage/10 text-bone'
                      : 'border-white/10 text-bone-muted hover:border-white/30 hover:text-bone'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={product.sizes.length > 1 && !selectedSize}
          className="btn-luxury group/btn mt-auto flex items-center justify-center gap-3 border border-white/15 px-6 py-3.5 font-sohne text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-sage hover:bg-sage/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:bg-transparent"
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sage"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                Added
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
                {product.sizes.length > 1 && !selectedSize ? 'Select Size' : 'Add to Cart'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
