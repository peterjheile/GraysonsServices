'use client';

import { useEffect, useRef } from 'react';
import { perks } from './careersData';

const icons: Record<string, React.ReactNode> = {
  health: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 22s-9-5.6-9-12a6 6 0 0112 0 6 6 0 0112 0c0 6.4-9 12-9 12z" stroke="#b8975a" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M10 13h6M13 10v6" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  pay: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10" stroke="#b8975a" strokeWidth="1.4"/>
      <path d="M13 7v12M10 9.5c0-1.1.9-2 2-2h2a2 2 0 010 4h-2a2 2 0 000 4h2.5a2 2 0 002-2" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  growth: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M4 20l5-6 4 3 5-7 4-4" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 9h4v4" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  training: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="3" y="5" width="20" height="14" rx="1" stroke="#b8975a" strokeWidth="1.4"/>
      <path d="M9 21h8M13 19v2" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10 11l4-2 4 2-4 2-4-2z" stroke="#b8975a" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M18 11v4" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  tools: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M14.5 4a5 5 0 00-5 7L4 16.5a2 2 0 002.8 2.8L12 14a5 5 0 007-5l-3 3-2-1-1-2 3-3a5 5 0 00-1.5-.97z" stroke="#b8975a" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  schedule: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="4" y="5" width="18" height="17" rx="1" stroke="#b8975a" strokeWidth="1.4"/>
      <path d="M4 10h18M9 4v2M17 4v2" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M13 14l2 2 3-3" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bonus: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 3l2.5 5 5.5.8-4 3.9.95 5.5L13 15.8l-4.95 2.4L9 12.7 5 8.8l5.5-.8L13 3z" stroke="#b8975a" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  culture: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="10" cy="9" r="3" stroke="#b8975a" strokeWidth="1.4"/>
      <circle cx="18" cy="9" r="3" stroke="#b8975a" strokeWidth="1.4"/>
      <path d="M4 21c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6" stroke="#b8975a" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

export default function PerksGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-scale, .reveal-left').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#f5f1eb] py-28 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20 items-end">
          <div className="reveal-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#b8975a]" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Why Grayson's</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,56px)] font-light text-[#1a1714] leading-[1.1]">
              What You Get<br />
              <em className="italic text-[#b8975a]">When You Join Us</em>
            </h2>
          </div>
          <div className="reveal">
            <p className="text-[#5c5550] text-sm font-light leading-relaxed max-w-md">
              We built this benefits package . . . A short description will go here essentiually to "hype up" the perks of joining the crew.
            </p>
          </div>
        </div>

        {/* Perks grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e2da]">
          {perks.map((perk, i) => (
            <div
              key={perk.title}
              className="reveal-scale bg-[#f5f1eb] p-8 lg:p-10 group hover:bg-[#1a1714] transition-all duration-500 cursor-default"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Icon */}
              <div className="mb-7 w-12 h-12 border border-[#e8e2da] group-hover:border-[#b8975a]/30 flex items-center justify-center transition-colors duration-500">
                {icons[perk.icon]}
              </div>

              <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714] group-hover:text-[#faf8f5] transition-colors duration-500 mb-3">
                {perk.title}
              </h3>
              <p className="text-sm text-[#5c5550] group-hover:text-[#a39890] font-light leading-relaxed transition-colors duration-500">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight band */}
        <div className="mt-16 bg-[#1a1714] p-8 lg:p-12 grid lg:grid-cols-3 gap-8 reveal">
          {[
            {
              stat: 'xxx',
              label: 'A perk summary, or new perk here.',
              sub: 'Short description of that perk.',
            },
            {
              stat: '100%',
              label: 'Training & Certs Paid',
              sub: 'Short training desc.',
            },
            {
              stat: '$0',
              label: 'Out-of-Pocket Tools',
              sub: 'We supply tools or something similar',
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-6">
              <div className="font-['Cormorant_Garamond'] text-5xl font-light text-[#b8975a] leading-none shrink-0">{item.stat}</div>
              <div>
                <div className="text-sm font-semibold text-[#faf8f5] tracking-wide mb-1">{item.label}</div>
                <div className="text-xs text-[#b9aca2] font-light leading-relaxed">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
