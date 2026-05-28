'use client';

import { useEffect, useRef } from 'react';

export default function CareersCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#faf8f5] py-28 lg:py-36">
      {/* Decorative image panel — right half */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 hidden lg:block"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#faf8f5]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="lg:w-1/2 lg:pr-16">
          <div className="reveal-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-[#b8975a]" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Ready to Start?</span>
            </div>

            <h2 className="font-['Cormorant_Garamond'] text-[clamp(38px,5vw,68px)] font-light text-[#1a1714] leading-[0.95] mb-8">
              Come Build<br />
              <em className="italic text-[#b8975a]">With Us.</em>
            </h2>

            <p className="text-[#5c5550] text-base font-light leading-relaxed max-w-md mb-10">
              We're a company that's growing with intention — and every person we bring on shapes what we become. If you take pride in your work and want to be somewhere that notices, we want to hear from you.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#positions" className="btn-primary">
                <span>See All Open Roles</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
                  <path d="M6.5 2v9M3 8l3.5 3.5L10 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="mailto:careers@graysonsservices.com" className="btn-outline">
                <span>Email Your Resume</span>
              </a>
            </div>

            {/* Contact nudge */}
            <div className="border-t border-[#e8e2da] pt-8 space-y-4">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#a39890] font-medium">Hiring questions?</p>
              <div className="flex flex-col sm:flex-row gap-5">
                {[
                  { label: 'Email HR', value: 'careers@graysonsservices.com', href: 'mailto:careers@graysonsservices.com' },
                  { label: 'Call Us', value: '(555) 123-4567', href: 'tel:+15551234567' },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="group flex items-center gap-3 text-sm text-[#1a1714] hover:text-[#b8975a] transition-colors duration-200"
                  >
                    <div className="w-8 h-8 border border-[#e8e2da] group-hover:border-[#b8975a]/40 flex items-center justify-center transition-colors shrink-0">
                      {c.label === 'Email HR' ? (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <rect x="1.5" y="2.5" width="10" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M1.5 3.5l5 4 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 2.5h2.5l1 2.5-1.5 1a7 7 0 003.5 3.5l1-1.5 2.5 1V11A1 1 0 0110 12C5.6 12 1 7.4 1 3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.2em] uppercase text-[#a39890] group-hover:text-[#b8975a]/60 transition-colors">{c.label}</div>
                      <div className="font-medium">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
