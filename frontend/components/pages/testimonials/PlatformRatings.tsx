'use client';

import { useEffect, useRef, useState } from 'react';
import { platformStats } from './testimonialsData';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 12 12">
            {partial ? (
              <>
                <defs>
                  <linearGradient id={`grad-${i}`}>
                    <stop offset="60%" stopColor="#b8975a" />
                    <stop offset="60%" stopColor="#e8e2da" />
                  </linearGradient>
                </defs>
                <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" fill={`url(#grad-${i})`} />
              </>
            ) : (
              <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" fill={filled ? '#b8975a' : '#e8e2da'} />
            )}
          </svg>
        );
      })}
    </div>
  );
}

const starBreakdown = [
  { stars: 5, pct: 94 },
  { stars: 4, pct: 5 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 },
];

export default function PlatformRatings() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => el.classList.add('visible'));
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const totalReviews = platformStats.reduce((s, p) => s + p.count, 0);
  const overallRating = (platformStats.reduce((s, p) => s + p.rating * p.count, 0) / totalReviews).toFixed(1);

  return (
    <section ref={ref} className="bg-[#faf8f5] py-24 lg:py-32 border-b border-[#e8e2da]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">

          {/* Overall score */}
          <div className="reveal-left lg:col-span-1">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Verified Ratings</span>
            <div className="mt-6 flex items-end gap-4">
              <span className="font-['Cormorant_Garamond'] text-[80px] lg:text-[96px] font-light text-[#1a1714] leading-none">
                {overallRating}
              </span>
              <div className="pb-3">
                <Stars rating={Number(overallRating)} />
                <div className="text-xs text-[#a39890] mt-2 font-light">{totalReviews} verified reviews</div>
              </div>
            </div>

            {/* Star breakdown bars */}
            <div className="mt-8 space-y-3">
              {starBreakdown.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-[11px] text-[#a39890] w-4 text-right">{stars}</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="#b8975a" className="shrink-0">
                    <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
                  </svg>
                  <div className="flex-1 h-1.5 bg-[#e8e2da] overflow-hidden">
                    <div
                      className="h-full bg-[#b8975a] transition-all duration-1000 ease-out"
                      style={{ width: animated ? `${pct}%` : '0%', transitionDelay: `${(5 - stars) * 80}ms` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#a39890] w-7">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
            {platformStats.map((p, i) => (
              <div
                key={p.platform}
                className="reveal-scale border border-[#e8e2da] p-8 flex flex-col items-center text-center group hover:border-[#b8975a]/40 hover:shadow-lg transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Platform name */}
                <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#a39890] mb-5">{p.platform}</span>

                {/* Big rating */}
                <div className="font-['Cormorant_Garamond'] text-6xl font-light text-[#1a1714] leading-none mb-3 group-hover:text-[#b8975a] transition-colors duration-300">
                  {p.rating.toFixed(1)}
                </div>

                <Stars rating={p.rating} />

                <div className="text-[11px] text-[#a39890] mt-3 font-light">{p.count} reviews</div>

                {/* Verified badge */}
                <div className="mt-5 flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#b8975a]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#b8975a" strokeWidth="1"/>
                    <path d="M2.5 5l1.5 1.5 3-3" stroke="#b8975a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
