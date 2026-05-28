'use client';

import { useEffect, useRef } from 'react';

export default function ProjectsCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.15 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#1a1714] py-28 lg:py-36">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url('/HomeHero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714] via-[#1a1714]/90 to-[#1a1714]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal-left">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Your Project, Next</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,64px)] font-light text-[#faf8f5] mt-3 leading-tight">
              Ready to Write<br />
              <em className="italic text-[#b8975a]">Your Before & After?</em>
            </h2>
            <p className="text-[#5c5550] text-base font-light leading-relaxed mt-6 max-w-md">
              Again, a short description will go here. It is a call to action so should be more inspirational rather than facts.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="/contact" className="btn-primary">
                <span>Get a Free Estimate</span>
              </a>
              <a href="/services" className="btn-outline">
                <span>View Our Services</span>
              </a>
            </div>
          </div>

          {/* Trust signals */}
          <div className="reveal-right grid grid-cols-2 gap-3">
            {[
              { value: 'xxx', label: 'Projects Completed', sub: 'Across 8 service categories' },
              { value: 'xxx', label: 'Years in Business', sub: 'Serving the Greater Ohio Region' },
              { value: '100%', label: 'Satisfaction Rate', sub: 'Across verified reviews' },
              { value: '$0', label: 'Estimate Cost', sub: 'No obligation, ever' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1e1b18] border border-[#2d2926] p-6">
                <div className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[#b8975a]">{stat.value}</div>
                <div className="text-xs font-semibold text-[#faf8f5] mt-2 tracking-wide">{stat.label}</div>
                <div className="text-[10px] text-[#5c5550] mt-1 leading-tight">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
