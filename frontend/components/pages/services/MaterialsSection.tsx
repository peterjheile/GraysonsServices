'use client';

import { useEffect, useRef } from 'react';

const materials = [
  {
    name: 'Bluestone',
    origin: 'Pennsylvania & New York',
    best: 'Patios, walkways, steps',
    character: 'Cool blue-grey tones, natural cleft or thermal finish, extremely durable.',
    img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80',
  },
  {
    name: 'Travertine',
    origin: 'Turkey & Italy',
    best: 'Pool surrounds, patios',
    character: 'Warm ivory and walnut tones, naturally porous surface stays cool underfoot.',
    img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&q=80',
  },
  {
    name: 'Fieldstone',
    origin: 'Regional sourcing',
    best: 'Retaining walls, fire features',
    character: 'Raw, natural character. Every stone unique. Ties hard features to the landscape.',
    img: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=500&q=80',
  },
  {
    name: 'Concrete Pavers',
    origin: 'Domestic manufacturing',
    best: 'Driveways, patios, commercial',
    character: '50+ color and texture profiles. ICPI-rated load capacity. Replaceable individually.',
    img: 'https://images.unsplash.com/photo-1591588582259-e675bd2e6088?w=500&q=80',
  },
];

export default function MaterialsSection() {
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
    <section ref={ref} className="bg-[#f5f1eb] py-28 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start mb-16">
          <div className="reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Premium Materials</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,52px)] font-light text-[#1a1714] mt-3 leading-tight">
              We Only Work With<br />
              <em className="italic text-[#b8975a]">The Best</em>
            </h2>
          </div>
          <div className="reveal lg:pt-16 lg:max-w-md">
            <p className="text-[#5c5550] text-sm font-light leading-relaxed">
              Material quality is the single biggest determinant of how your project looks in 20 years. We've vetted every supplier, handled every stone type, and we'll guide you honestly to the right choice for your budget and conditions.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.map((m, i) => (
            <div
              key={m.name}
              className="reveal-scale group cursor-default"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              {/* Swatch image */}
              <div className="project-card relative aspect-[3/2] overflow-hidden mb-4">
                <img
                  src={m.img}
                  alt={m.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>

              {/* Info */}
              <div className="px-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714]">{m.name}</h3>
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#b8975a] mb-2">{m.origin}</div>
                <p className="text-xs text-[#5c5550] font-light leading-relaxed mb-3">{m.character}</p>
                <div className="text-[10px] text-[#a39890] font-medium">
                  <span className="text-[#1a1714]">Best for: </span>{m.best}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
