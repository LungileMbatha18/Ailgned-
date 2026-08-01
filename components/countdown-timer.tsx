'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-start gap-4 sm:gap-8 md:gap-12">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start">
          <div className="flex flex-col items-center">
            <span className="font-canela text-4xl tabular-nums text-bone sm:text-6xl md:text-7xl">
              {mounted ? String(u.value).padStart(2, '0') : '00'}
            </span>
            <span className="mt-2 font-sohne text-[9px] uppercase tracking-[0.3em] text-bone-muted sm:text-[10px]">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="mx-2 self-start font-canela text-4xl text-white/15 sm:mx-4 sm:text-6xl md:mx-6 md:text-7xl">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
