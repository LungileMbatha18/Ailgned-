'use client';

import { SmoothScroll } from '@/components/smooth-scroll';
import { LoadingScreen } from '@/components/loading-screen';
import { HeroSection } from '@/components/sections/hero-section';
import { StatementSection } from '@/components/sections/statement-section';
import { PhilosophySection } from '@/components/sections/philosophy-section';
import { SneakPeekSection } from '@/components/sections/sneak-peek-section';
import { JoinSection } from '@/components/sections/join-section';
import { CountdownSection } from '@/components/sections/countdown-section';
import { InstagramSection } from '@/components/sections/instagram-section';
import { FooterSection } from '@/components/sections/footer-section';

export default function Home() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <div className="grain-overlay" />
      <main className="relative w-full bg-ink">
        <HeroSection />
        <StatementSection />
        <PhilosophySection />
        <SneakPeekSection />
        <JoinSection />
        <CountdownSection />
        <InstagramSection />
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}
