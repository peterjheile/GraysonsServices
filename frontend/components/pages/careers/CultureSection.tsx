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
            backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 55%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#faf8f5]/30" />
          {/* Corner label */}
          <div className="absolute bottom-8 left-8 bg-[#1a1714]/80 backdrop-blur-sm px-5 py-4">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-medium">The Grayson's Way</div>
            <div className="font-['Cormorant_Garamond'] text-2xl text-[#faf8f5] mt-1">Craft over shortcuts.</div>
          </div>
        </div>

        {/* Right: manifesto copy */}
        <div className="reveal-right flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#b8975a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Who We Are</span>
          </div>

          <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,54px)] font-light text-[#1a1714] leading-[1.1] mb-8">
            A Company That's<br />
            <em className="italic text-[#b8975a]">Growing on Purpose</em>
          </h2>

          <div className="space-y-5 text-[#5c5550] text-sm font-light leading-relaxed max-w-lg">
            <p>
              Grayson's Services isn't a big company pretending to be small, or a small company trying to punch above its weight. We're a focused, 42-person team that's been systematically building the infrastructure — the talent, the systems, the reputation — to scale to the next level.
            </p>
            <p>
              That means the people who join us now grow with us. The crew lead who comes in today becomes the foreman when we open our next division. The project manager who brings discipline to our operations becomes the director of ops when we expand our footprint.
            </p>
            <p>
              We value people who take ownership. Who clean up before they're asked to. Who flag a problem before it becomes a crisis. Who treat a client's property like it's their own. That's who we hire — and that's who we promote.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-[#e8e2da]">
            {[
              { label: 'Founded', value: '2009' },
              { label: 'Avg. Tenure', value: '4.2 yrs' },
              { label: 'Promoted Internal', value: '78%' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#b8975a]">{s.value}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#a39890] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Part 2: Team voice cards ── */}
      <div className="bg-[#1a1714] py-24 lg:py-32">
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
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=75',
          'https://images.unsplash.com/photo-1591588582259-e675bd2e6088?w=600&q=75',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=75',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&q=75',
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
