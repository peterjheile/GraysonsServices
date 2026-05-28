'use client';

import { useEffect, useRef } from 'react';
import { teamQuotes } from './careersData';

export default function CultureSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="culture" ref={ref} className="bg-[#faf8f5]">

      {/* ── Part 1: Split manifesto ── */}
      <div className="grid lg:grid-cols-2 min-h-[70vh]">

        {/* Left: large photo */}
        <div
          className="reveal-left relative min-h-[420px] lg:min-h-full overflow-hidden"
          style={{
            backgroundImage: `url('/HomeHero.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 55%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#faf8f5]/30" />
          {/* Corner label */}
          <div className="absolute bottom-8 left-8 bg-[#1a1714]/80 backdrop-blur-sm px-5 py-4">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-medium">The Grayson's Way</div>
            <div className="font-['Cormorant_Garamond'] text-2xl text-[#faf8f5] mt-1">Something Here.</div>
          </div>
        </div>

        {/* Right: manifesto copy */}
        <div className="reveal-right flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#b8975a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Who We Are</span>
          </div>

          <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,54px)] font-light text-[#1a1714] leading-[1.1] mb-8">
            A snazzy Title<br />
            <em className="italic text-[#b8975a]">Will go Here</em>
          </h2>

          <div className="space-y-5 text-[#5c5550] text-sm font-light leading-relaxed max-w-lg">
            <p>
              There will be three paragraphs here (or less). This first will talk about the company and what its initial values are (essentially what is expected of anyone applying to work here)
            </p>
            <p>
              This paragraph will talk about how this will effect the people that will work here. How they will grow, learn, lead, ect.
            </p>
            <p>
              Hard things that the company values in employees paragraph. Such as We value people who are proactive, who clean flag problems, who are willing to clean up, etc - and then a final send off such as "thats who we promote."
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-[#e8e2da]">
            {[
              { label: 'Founded', value: 'xxx' },
              { label: 'Avg. Tenure', value: 'xxx' },
              { label: 'Promoted Internal', value: 'xxx' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#b8975a]">{s.value}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#a39890] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-[#1a1714] py-24 lg:py-32 hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

          <div className="text-center mb-16 reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Hear It From Them</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(30px,3.8vw,50px)] font-light text-[#faf8f5] mt-3">
              Our Team, In Their <em className="italic text-[#b8975a]">Own Words</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {teamQuotes.map((tq, i) => (
              <div
                key={tq.name}
                className="reveal-scale relative overflow-hidden group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Photo background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${tq.image}')` }}
                />
                {/* Dark scrim — lightens on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/70 to-[#1a1714]/30 group-hover:via-[#1a1714]/60 transition-colors duration-500" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end p-8 lg:p-10 min-h-[440px]">
                  {/* Big quote mark */}
                  <div className="font-['Cormorant_Garamond'] text-[100px] leading-none text-[#b8975a]/20 select-none -mb-4">
                    "
                  </div>

                  <blockquote className="font-['Cormorant_Garamond'] text-xl lg:text-2xl font-light italic text-[#faf8f5] leading-[1.5] mb-6">
                    {tq.quote}
                  </blockquote>

                  <div className="flex items-center gap-4 pt-5 border-t border-[#faf8f5]/10">
                    <div className="w-10 h-10 rounded-full bg-[#b8975a]/20 border border-[#b8975a]/40 flex items-center justify-center shrink-0">
                      <span className="font-['Cormorant_Garamond'] text-base font-semibold text-[#b8975a]">{tq.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#faf8f5]">{tq.name}</div>
                      <div className="text-[11px] text-[#a39890] mt-0.5">{tq.title}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[10px] tracking-[0.15em] uppercase text-[#b8975a]">{tq.years}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Part 3: Photo grid strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 h-56 lg:h-72 reveal">
        {[
          'services/d8.jpg',
          'services/RetainingWall1.jpg',
          'services/retainingWall2.jpg',
          'services/Walkway1.jpg',
        ].map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden group"
            style={{ backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-[#1a1714]/30 group-hover:bg-[#1a1714]/10 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
