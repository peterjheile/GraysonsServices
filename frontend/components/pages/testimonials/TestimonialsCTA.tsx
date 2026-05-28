'use client';

import { useEffect, useRef } from 'react';

export default function TestimonialsCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#1a1714] py-28 lg:py-36">
      {/* Subtle BG image */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=40')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714] via-[#1a1714]/90 to-[#1a1714]" />

      {/* Decorative large quote */}
      <div
        className="absolute top-0 right-8 font-['Cormorant_Garamond'] text-[280px] leading-none text-[#b8975a]/5 select-none pointer-events-none font-bold"
        aria-hidden
      >
        "
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="reveal-left">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">
              Your Story, Next
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,64px)] font-light text-[#faf8f5] mt-3 leading-tight">
              Ready to Become<br />
              <em className="italic text-[#b8975a]">Our Next Review?</em>
            </h2>
            <p className="text-[#5c5550] text-base font-light leading-relaxed mt-6 max-w-md">
              Every testimonial on this page started with a single conversation. Tell us about your project and we'll tell you what's possible.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="/contact" className="btn-primary">
                <span>Get a Free Estimate</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
                  <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/projects" className="btn-outline">
                <span>See Our Projects</span>
              </a>
            </div>
          </div>

          {/* Right: quote pullout */}
          <div className="reveal-right">
            <div className="border border-[#2d2926] p-10 lg:p-12 relative">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#b8975a] -translate-y-[1px] translate-x-[1px]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#b8975a] translate-y-[1px] -translate-x-[1px]" />

              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill="#b8975a">
                    <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
                  </svg>
                ))}
              </div>

              <blockquote className="font-['Cormorant_Garamond'] text-[clamp(18px,2vw,26px)] font-light text-[#faf8f5] italic leading-[1.55] mb-8">
                "From the consultation to the final walkthrough, Grayson's made the process effortless. The fire pit area is the centerpiece of our summers now."
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b8975a]/20 flex items-center justify-center">
                  <span className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#b8975a]">JW</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#faf8f5]">James & Carol Whitmore</div>
                  <div className="text-[11px] text-[#5c5550] mt-0.5">Homeowners · Oakmont, OH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
