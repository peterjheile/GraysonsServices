'use client';

import { useEffect, useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Free Consultation',
    body: 'Description of what all this entails for the client. Should be slightly longer than this',
    duration: '1–2 hours',
  },
  {
    number: '02',
    title: 'Step 2 Title',
    body: 'Description of what all this entails for the client. Should be slightly longer than this',
    duration: '1–2 hours',
  },
  {
    number: '03',
    title: 'Step 3 Title',
    body: 'Description of what all this entails for the client. Should be slightly longer than this',
    duration: '1–2 hours',
  },
  {
    number: '04',
    title: 'Step 4 Title',
    body: 'Description of what all this entails for the client. Should be slightly longer than this',
    duration: '1–2 hours',
  },
  {
    number: '05',
    title: 'Step 5 Title',
    body: 'Description of what all this entails for the client. Should be slightly longer than this',
    duration: '1–2 hours',
  },
    {
    number: '06',
    title: 'Step 6 Title',
    body: 'Description of what all this entails for the client. Should be slightly longer than this',
    duration: '1–2 hours',
  },

];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-scale');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-stone-darkest py-28 lg:py-40">
      <div className="max-w-360 mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20 items-end">
          <div className="reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">Our Process</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-white mt-3 leading-tight">
              How Every Project<br />
              <em className="italic text-gold">Gets Done</em>
            </h2>
          </div>
          <div className="reveal">
            <p className="text-stone-mid text-base font-light leading-relaxed">
              A description about how we know this is the BEST process, such as: we have refined this process of however many project and from the feedback of satisfied clients.
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-darkest">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="reveal bg-stone-darkest p-8 lg:p-10 group hover:bg-[#1e1b18] transition-colors duration-300 relative overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Large background number */}
              <div className="absolute -bottom-4 -right-2 font-['Cormorant_Garamond'] text-[100px] leading-none text-stone-dark select-none pointer-events-none font-bold group-hover:text-stone-dark/80 transition-colors">
                {step.number}
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <span className="font-['Cormorant_Garamond'] text-4xl font-semibold text-gold">
                    {step.number}
                  </span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white border border-white px-2.5 py-1.5 mt-1">
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#d6c8b2] leading-relaxed font-light">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
