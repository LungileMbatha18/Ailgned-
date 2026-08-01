import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Space_Grotesk } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sohne', display: 'swap' });
const canela = Playfair_Display({ subsets: ['latin'], variable: '--font-canela', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });

export const metadata: Metadata = {
  title: 'AILGNED | Align Your Purpose',
  description:
    'Premium contemporary apparel built with intention. Luxury streetwear, performance wear and essentials. Collection 01 launching soon.',
  keywords: [
    'AILGNED',
    'luxury fashion',
    'contemporary apparel',
    'streetwear',
    'Collection 01',
    'premium essentials',
    'purpose-driven clothing',
  ],
  authors: [{ name: 'AILGNED' }],
  themeColor: '#111111',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  openGraph: {
    title: 'AILGNED | Align Your Purpose',
    description:
      'Premium contemporary apparel built with intention. Collection 01 launching soon.',
    type: 'website',
    siteName: 'AILGNED',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AILGNED | Align Your Purpose',
    description:
      'Premium contemporary apparel built with intention. Collection 01 launching soon.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${canela.variable} ${grotesk.variable}`}>
      <body className="bg-ink text-bone font-sohne antialiased">
        <CartProvider>
          <Navbar />
          {children}
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
