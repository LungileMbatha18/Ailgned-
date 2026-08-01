'use client';

const links = [
  { label: 'Shop', href: '/shop' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Instagram', href: 'https://instagram.com/ailgned.studio' },
  { label: 'TikTok', href: 'https://tiktok.com/@ailgned.studio' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export function FooterSection() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/[0.06] bg-ink px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-canela text-5xl tracking-[0.05em] text-bone sm:text-7xl">
            AILGNED
          </h2>
          <p className="mt-3 font-sohne text-[10px] uppercase tracking-[0.4em] text-bone-muted">
            Align Your Purpose.
          </p>
        </div>

        <nav className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="font-sohne text-xs uppercase tracking-[0.2em] text-bone-muted transition-colors hover:text-bone"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-auto mt-16 h-px w-full max-w-md bg-white/[0.06]" />

        <p className="mt-8 text-center font-sohne text-[10px] uppercase tracking-[0.3em] text-bone-muted/60">
          Copyright © 2026 AILGNED.
        </p>
      </div>
    </footer>
  );
}
