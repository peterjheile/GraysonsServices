'use client';

import { useEffect, useRef, useState } from 'react';

const metrics = [
  {
    value: 191,
    suffix: '+',
    label: 'Verified Reviews',
    sub: 'Across Google, Houzz & Facebook',
  },
  {
    value: 4.9,
    suffix: '',
    label: 'Average Star Rating',
    sub: 'Out of 5.0 across all platforms',
    decimal: true,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Would Re-hire',
    sub: 'Based on post-project surveys',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Projects Completed',
    sub: 'Since 2009',
  },
];

function useCountUp(target: number, duration = 1600, active = false, decimal = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(decimal ? Math.round(target * eased * 10) / 10 : Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration, decimal]);
  return val;
}

function CountMetric({ value, suffix, label, sub, decimal = false, active }: {
  value: number; suffix: string; label: string; sub: string; decimal?: boolean; active: boolean;
}) {
  const count = useCountUp(value, 1800, active, decimal);
  return (
    <div className="flex flex-col items-center text-center px-6 py-2 group">
      <div className="font-['Cormorant_Garamond'] text-[clamp(40px,5vw,72px)] font-light text-[#b8975a] leading-none mb-2 group-hover:scale-105 transition-transform duration-300">
        {decimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm font-medium text-[#faf8f5] tracking-wide mb-1">{label}</div>
      <div className="text-[11px] text-[#5c5550] font-light">{sub}</div>
    </div>
  );
}

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          ref.current?.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#1a1714] py-20 lg:py-24 relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=30')`,
          backgroundSize: 'cover',
          filter: 'grayscale(100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714] via-transparent to-[#1a1714]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="reveal text-center mb-14">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">The Numbers</span>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(28px,3.5vw,44px)] font-light text-[#faf8f5] mt-3">
            Earned Over 15 Years of Work
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#2d2926]">
          {metrics.map((m, i) => (
            <CountMetric key={m.label} {...m} active={active} />
          ))}
        </div>

        {/* Bottom guarantee strip */}
        <div className="mt-16 pt-10 border-t border-[#2d2926] grid sm:grid-cols-3 gap-6 reveal">
          {[
            { icon: '✦', label: 'Free Estimates', detail: 'No cost, no obligation — ever' },
            { icon: '✦', label: '5-Year Warranty', detail: 'On all hardscaping installations' },
            { icon: '✦', label: '48-Hour Response', detail: 'We follow up on every inquiry' },
          ].map((g) => (
            <div key={g.label} className="flex items-start gap-4">
              <span className="text-[#b8975a] text-lg leading-none mt-0.5">{g.icon}</span>
              <div>
                <div className="text-sm font-semibold text-[#faf8f5] tracking-wide">{g.label}</div>
                <div className="text-[11px] text-[#5c5550] mt-0.5">{g.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
