'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useShopData, useLaunchStatus } from '@/hooks/use-shop';
import { ShoppingBag, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { settings } = useShopData();
  const { isLaunched, mounted } = useLaunchStatus(settings);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (!mounted || !isLaunched) return null;

  const isHome = pathname === '/';
  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? 'border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-20 sm:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="font-canela text-xl tracking-[0.05em] text-bone transition-opacity hover:opacity-80 sm:text-2xl"
          >
            AILGNED
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sohne text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-bone ${
                    active ? 'text-bone' : 'text-bone-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: cart + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative flex items-center transition-opacity hover:opacity-80"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 text-bone" strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sage font-sohne text-[9px] font-medium text-ink">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center text-bone md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className={`font-canela text-3xl tracking-[0.05em] transition-colors hover:text-sage ${
                        active ? 'text-sage' : 'text-bone'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
