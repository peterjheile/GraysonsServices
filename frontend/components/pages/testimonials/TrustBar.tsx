'use client';

import { useEffect, useRef, useState } from 'react';

import type { CompanyStats } from '@/features/company-stats/types';
import type { Review } from '@/features/reviews/types';

type TrustBarProps = {
  readonly reviews: readonly Review[];
  readonly companyStats: CompanyStats | null;
};

type Metric = Readonly<{
  value: number;
  suffix: string;
  label: string;
  sub: string;
  decimal?: boolean;
}>;

function getAverageRating(reviews: readonly Review[]): number {
  if (reviews.length === 0) {
    return 0;
  }

  return (
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length
  );
}

function createMetrics(
  reviews: readonly Review[],
  companyStats: CompanyStats | null,
): readonly Metric[] {
  const reviewMetrics: readonly Metric[] = [
    {
      value: reviews.length,
      suffix: '',
      label: 'Published Reviews',
      sub: 'Customer feedback shared on this site',
    },
    {
      value: getAverageRating(reviews),
      suffix: '',
      label: 'Average Star Rating',
      sub:
        reviews.length > 0
          ? 'Across published customer reviews'
          : 'No published ratings yet',
      decimal: true,
    },
  ];

  if (companyStats === null) {
    return reviewMetrics;
  }

  return [
    ...reviewMetrics,
    {
      value: companyStats.projects_completed,
      suffix: '+',
      label: 'Projects Completed',
      sub: 'Across completed customer projects',
    },
  ];
}

function useCountUp(target: number, duration = 1600, active = false, decimal = false) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }

    const start = performance.now();
    let animationFrame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(decimal ? Math.round(target * eased * 10) / 10 : Math.round(target * eased));
      if (progress < 1) animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
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

export default function TrustBar({
  reviews,
  companyStats,
}: TrustBarProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const metrics = createMetrics(reviews, companyStats);
  const yearsInBusiness =
    companyStats !== null && companyStats.years_in_business > 0
      ? companyStats.years_in_business
      : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
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
            {yearsInBusiness === null
              ? 'Earned Through Years of Work'
              : `Earned Over ${yearsInBusiness.toLocaleString()} ${
                  yearsInBusiness === 1 ? 'Year' : 'Years'
                } of Work`}
          </h2>
        </div>

        {/* Metrics grid */}
        <div
          className={`grid divide-y divide-[#2d2926] sm:divide-x sm:divide-y-0 ${
            metrics.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
          }`}
        >
          {metrics.map((m) => (
            <CountMetric key={m.label} {...m} active={active} />
          ))}
        </div>

        {/* Service expectations */}
        <div className="mt-16 pt-10 border-t border-[#2d2926] grid sm:grid-cols-3 gap-6 reveal">
          {[
            { icon: '✦', label: 'Free Estimates', detail: 'Straightforward project consultations' },
            { icon: '✦', label: '48-Hour Response', detail: 'We aim to follow up within 48 hours' },
            { icon: '✦', label: 'Clear Communication', detail: 'Helpful updates from start to finish' },
          ].map((g) => (
            <div key={g.label} className="flex flex-col items-center gap-2 px-4 text-center">
              <span className="text-lg leading-none text-[#b8975a]" aria-hidden="true">{g.icon}</span>
              <div className="flex flex-col items-center">
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