'use client';

import { useEffect, useRef } from 'react';

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L17.5 10.5L26 11.5L20 17.5L21.5 26L14 22L6.5 26L8 17.5L2 11.5L10.5 10.5L14 3Z"
          stroke="#b8975a" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Value One Here',
    body: 'A short description of the first value goes here. Could be quality control, could be honestly, could be local roots, etc.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="2" stroke="#b8975a" strokeWidth="1.5"/>
        <path d="M8 14l4 4 8-8" stroke="#b8975a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Value two Here',
    body: 'A short description of the first value goes here. Could be quality control, could be honestly, could be local roots, etc.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2C8 2 3 7 3 14c0 5 3 9.5 7.5 11.5M14 2c6 0 11 5 11 12 0 5-3 9.5-7.5 11.5M14 2v24"
          stroke="#b8975a" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 14h22" stroke="#b8975a" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Value Three Here',
    body: 'A short description of the first value goes here. Could be quality control, could be honestly, could be local roots, etc.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 25C14 25 4 19 4 11a10 10 0 0118 0c0 8-8 14-8 14z"
          stroke="#b8975a" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="14" cy="11" r="3" stroke="#b8975a" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Value Four Here',
    body: 'A short description of the first value goes here. Could be quality control, could be honestly, could be local roots, etc.',
  },
];

const credentials = [
  { label: 'Credential 1', detail: 'Hopefully a liscense of some sort.' },
  { label: 'Credential 2', detail: 'Best is a warranty' },
  { label: 'Credential 3', detail: 'Another credential (gov issued)' },
  { label: 'Credential 4', detail: 'Soft cred, like 100% satisfaction gaurunteed.' },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const els = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="bg-[#faf8f5] py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Top: Story */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 mb-28 items-center">

          {/* Image block */}
          <div className="reveal-left relative">
            <div
              className="w-full aspect-[4/5] lg:aspect-[3/4] bg-cover bg-center"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80')` }}
            />
            {/* Offset accent box */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#b8975a]/10 border border-[#b8975a]/30 hidden lg:block" />
            {/* Floating info chip */}
            <div className="absolute -bottom-4 left-8 lg:left-0 lg:-translate-x-12 bg-[#1a1714] px-6 py-5 shadow-xl">
              <div className="font-['Cormorant_Garamond'] text-4xl text-[#b8975a] font-semibold">5+</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#a39890] mt-1">Years of Excellence</div>
            </div>
          </div>

          {/* Text block */}
          <div className="reveal-right">
            <div className="gold-line" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Our Story</span>

            <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-[#1a1714] leading-[1.1] mt-4 mb-8">
              Our Story Header,<br />
              <em className="italic text-[#b8975a]">Goes Right Here</em>
            </h2>

            <div className="space-y-5 text-[#5c5550] leading-relaxed text-base font-light">
              <p>
                Grayson's Services about us paragraph one will go right here. It will talk about the start of the company and the "core values" derived from that beginning. Should be a tiny bit longer but any length works.
              </p>
              <p>
                This paragraph will talk about what these values mean and what they do for the company. No cutting corners, prioritizing client, etc. Should also be a tiny bit longer.
              </p>
              <p>
                A small gauruntee of quality and unchanging services likely should go here. Especially as you scale.
              </p>
            </div>

            <div className="mt-10">
              <a href="#contact" className="btn-primary">
                <span>Meet the Team</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section rule */}
        <div className="section-rule mb-28" />

        {/* Values modules */}
        <div className="mb-28">
          <div className="text-center mb-16 reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">What Drives Us</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,52px)] font-light text-[#1a1714] mt-3">
              Core Values Title Here
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e2da]">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`reveal bg-[#faf8f5] p-8 lg:p-10 group hover:bg-[#1a1714] transition-colors duration-500 delay-${i * 100}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mb-6 group-hover:[&_path]:stroke-[#b8975a] group-hover:[&_rect]:stroke-[#b8975a] group-hover:[&_circle]:stroke-[#b8975a]">
                  {v.icon}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714] group-hover:text-[#faf8f5] transition-colors mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-[#5c5550] group-hover:text-[#a39890] transition-colors leading-relaxed font-light">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section rule */}
        <div className="section-rule mb-28" />

        {/* Credentials */}
        <div>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-80 shrink-0 reveal-left">
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Trust & Credentials</span>
              <h2 className="font-['Cormorant_Garamond'] text-[clamp(30px,3.5vw,44px)] font-light text-[#1a1714] mt-3 leading-tight">
                Licensed,<br />Certified &<br /><em className="italic text-[#b8975a]">Accountable</em>
              </h2>
            </div>

            <div className="flex-1 grid sm:grid-cols-2 gap-6">
              {credentials.map((c, i) => (
                <div
                  key={c.label}
                  className={`reveal flex items-start gap-5 p-6 border border-[#e8e2da] hover:border-[#b8975a]/40 transition-colors duration-300`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[#b8975a]/50 rounded-full mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#b8975a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1714] text-sm tracking-wide">{c.label}</div>
                    <div className="text-xs text-[#a39890] mt-1 font-light">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
