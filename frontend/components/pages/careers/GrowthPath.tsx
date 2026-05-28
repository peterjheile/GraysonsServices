'use client';

import { useEffect, useRef } from 'react';

const paths = [
  {
    track: 'Field Operations',
    color: 'border-[#b8975a]',
    accentBg: 'bg-[#b8975a]',
    steps: [
      { role: 'Seasonal Laborer', range: '$17–20/hr', note: 'Entry point — no experience required' },
      { role: 'Hardscape Installer', range: '$20–28/hr', note: 'After 1–2 seasons with demonstrated skill' },
      { role: 'Senior Installer', range: '$28–38/hr', note: 'Leads a crew of 2–4 on complex installs' },
      { role: 'Lead Foreman', range: '$38–48/hr', note: 'Runs multiple crews, owns site quality' },
      { role: 'Field Superintendent', range: 'Salaried', note: 'Oversees all field operations across projects' },
    ],
  },
  {
    track: 'Operations & Design',
    color: 'border-[#7a9e9a]',
    accentBg: 'bg-[#7a9e9a]',
    steps: [
      { role: 'Design & Estimating Specialist', range: '$50–68k', note: 'Client-facing, proposal building' },
      { role: 'Project Manager', range: '$55–75k', note: 'Owns 8–15 concurrent project lifecycles' },
      { role: 'Senior Project Manager', range: '$75–95k', note: 'Handles our largest & most complex jobs' },
      { role: 'Director of Operations', range: 'Exec-level', note: 'Leads the entire operations function' },
    ],
  },
];

export default function GrowthPath() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#1a1714] py-28 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20 items-end">
          <div className="reveal-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#b8975a]" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Career Growth</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,56px)] font-light text-[#faf8f5] leading-tight">
              Where This Job<br />
              <em className="italic text-[#b8975a]">Can Take You</em>
            </h2>
          </div>
          <div className="reveal-right">
            <p className="text-[#5c5550] text-sm font-light leading-relaxed max-w-md">
              78% of our leadership team was promoted from within. These aren't aspirational org charts — they're the actual paths our people have walked. We show you this because we want you to believe it.
            </p>
          </div>
        </div>

        {/* Tracks */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {paths.map((path, pi) => (
            <div key={path.track} className={pi === 0 ? 'reveal-left' : 'reveal-right'}>
              {/* Track label */}
              <div className={`inline-flex items-center gap-3 mb-8 pb-4 border-b ${path.color} w-full`}>
                <div className={`w-2 h-2 rounded-full ${path.accentBg}`} />
                <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-[#faf8f5]">{path.track}</span>
              </div>

              {/* Steps */}
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[15px] top-6 bottom-6 w-px bg-[#2d2926]" />

                <div className="space-y-0">
                  {path.steps.map((step, i) => (
                    <div key={step.role} className="relative flex gap-6 pb-8 last:pb-0">
                      {/* Node */}
                      <div className="relative z-10 shrink-0 mt-1">
                        <div className={`w-[30px] h-[30px] border-2 flex items-center justify-center transition-all duration-300 ${
                          i === 0 ? `${path.color} ${path.accentBg}` : `${path.color} bg-[#1a1714]`
                        }`}>
                          {i === 0 ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6h8M7 3l3 3-3 3" stroke="#1a1714" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : i === path.steps.length - 1 ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="#b8975a">
                              <path d="M6 1l1.3 2.7L11 4.3 8.5 6.6l.6 3L6 8.2 2.9 9.6l.6-3L1 4.3l3.7-.6L6 1z"/>
                            </svg>
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full ${path.accentBg} opacity-60`} />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-baseline justify-between gap-4 mb-1">
                          <h3 className={`font-['Cormorant_Garamond'] font-semibold leading-tight ${
                            i === path.steps.length - 1 ? 'text-[#b8975a] text-xl' : 'text-[#faf8f5] text-lg'
                          }`}>
                            {step.role}
                          </h3>
                          <span className="text-xs font-['Cormorant_Garamond'] text-[#b8975a] shrink-0">{step.range}</span>
                        </div>
                        <p className="text-xs text-[#5c5550] font-light">{step.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-20 pt-12 border-t border-[#2d2926] grid sm:grid-cols-3 gap-8 reveal">
          {[
            { stat: '78%', label: 'Promoted Internally', note: 'Of all leadership hires came from within' },
            { stat: '4.2yr', label: 'Average Tenure', note: 'People stay because growth is real' },
            { stat: '100%', label: 'Training Reimbursed', note: 'Every cert, every course — on us' },
          ].map((item) => (
            <div key={item.label} className="text-center lg:text-left">
              <div className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-[#b8975a] leading-none mb-2">{item.stat}</div>
              <div className="text-sm font-semibold text-[#faf8f5] mb-1">{item.label}</div>
              <div className="text-xs text-[#5c5550] font-light">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
