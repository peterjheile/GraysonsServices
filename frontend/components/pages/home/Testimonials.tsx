'use client';

import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Billy (names here)',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      "Super Good Review will go here. One that is thought out from a client - maybe a trusted member of the community. This is the FEATURED review that will go here.",
    project: 'Project Name in Gallery',
    featured: true,
  },
  {
    id: 2,
    name: 'Billy Bob',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      'The review will go here. Again, ioptimally something well thought out, not too long and not too short. Many can go here.',
    project: 'Project Name in Gallery',
    featured: false,
  },
  {
    id: 3,
    name: 'Billy Bob',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      'The review will go here. Again, ioptimally something well thought out, not too long and not too short. Many can go here.',
    project: 'Project Name in Gallery',
    featured: false,
  },
  {
    id: 4,
    name: 'Billy Bob',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      'The review will go here. Again, ioptimally something well thought out, not too long and not too short. Many can go here.',
    project: 'Project Name in Gallery',
    featured: false,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#b8975a">
          <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const featured = testimonials[0];
  const cards = testimonials.slice(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={ref} className="bg-[#f5f1eb] py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-20 reveal">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Client Testimonials</span>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-[#1a1714] mt-3">
            What Clients Say
          </h2>
          <p className="text-[#5c5550] text-base font-light mt-4 max-w-lg mx-auto">
            Over xxx completed projects. Over xxx stories we're proud to be part of.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="grid lg:grid-cols-5 gap-3 mb-6">
          <div className="lg:col-span-3 reveal-left bg-[#1a1714] p-10 lg:p-16 relative overflow-hidden">
            {/* Large quote mark */}
            <div
              className="absolute -top-4 -left-4 font-['Cormorant_Garamond'] text-[200px] leading-none text-[#b8975a]/10 select-none pointer-events-none"
              aria-hidden
            >
              "
            </div>

            <div className="relative z-10">
              <Stars count={featured.stars} />
              <blockquote className="font-['Cormorant_Garamond'] text-[clamp(22px,2.5vw,32px)] font-light text-[#faf8f5] italic leading-[1.45] mt-6 mb-8">
                "{featured.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#b8975a]/20 flex items-center justify-center text-[#b8975a] font-['Cormorant_Garamond'] text-lg font-semibold">
                  {featured.name[0]}
                </div>
                <div>
                  <div className="text-[#faf8f5] font-medium text-sm">{featured.name}</div>
                  <div className="text-[#a39890] text-xs mt-0.5">{featured.role}</div>
                </div>
                <div className="ml-auto hidden sm:block text-right">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-[#b8975a]">Project</div>
                  <div className="text-xs text-[#a39890] mt-0.5 max-w-[160px]">{featured.project}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side image */}
          <div
            className="lg:col-span-2 reveal-right min-h-[280px] bg-cover bg-center relative"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=700&q=80')` }}
          >
            <div className="absolute inset-0 bg-[#b8975a]/20" />
            <div className="absolute bottom-6 left-6 bg-[#1a1714]/80 backdrop-blur-sm px-5 py-3">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#b8975a] font-medium">5-Star Rated</div>
              <div className="text-[#faf8f5] font-['Cormorant_Garamond'] text-2xl font-semibold">Google & Facebook</div>
            </div>
          </div>
        </div>

        {/* Card row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((t, i) => (
            <div
              key={t.id}
              className={`testimonial-card reveal bg-[#faf8f5] border border-[#e8e2da] p-8`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Stars count={t.stars} />
              <blockquote className="text-[#5c5550] text-sm leading-relaxed font-light mt-5 mb-6 italic">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-[#e8e2da]">
                <div className="w-8 h-8 rounded-full bg-[#b8975a]/15 flex items-center justify-center text-[#b8975a] font-['Cormorant_Garamond'] text-base font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-[#1a1714] font-medium text-xs tracking-wide">{t.name}</div>
                  <div className="text-[#a39890] text-[10px] mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div className="reveal bg-[#b8975a] p-8 flex flex-col justify-between" style={{ transitionDelay: '300ms' }}>
            <div>
              <div className="font-['Cormorant_Garamond'] text-4xl font-light text-[#1a1714] leading-tight mb-4">
                CTA Here - such as: Ready to Start Your Project?
              </div>
              <p className="text-[#1a1714]/70 text-sm font-light">
                Join dozens (or hundreds) of satisfied homeowners. Get your free, estimate today.
              </p>
            </div>
            <a href="#contact" className="mt-8 inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1a1714] group">
              <span>Get a Quote</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
