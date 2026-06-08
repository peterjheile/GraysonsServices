'use client';

import { useEffect, useRef } from 'react';
import { ValueCard } from './types';


import { FiAward, FiCheckSquare, FiShield } from "react-icons/fi";

const ICONS = {
  award: FiAward,
  check: FiCheckSquare,
  shield: FiShield,
};


const credentials = [
  { label: 'Credential 1', detail: 'Hopefully a liscense of some sort.' },
  { label: 'Credential 2', detail: 'Best is a warranty' },
  { label: 'Credential 3', detail: 'Another credential (gov issued)' },
  { label: 'Credential 4', detail: 'Soft cred, like 100% satisfaction gaurunteed.' },
];


type AboutProps = {
  values: [ValueCard, ValueCard, ValueCard, ValueCard];
}




export default function About({values}: AboutProps) {
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
    <section id="about" ref={ref} className="bg-white py-28 lg:py-40">
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
        <div className="hidden section-rule mb-28" />





        {/* Values modules */}
        <div className="hidden mb-28">
          <div className="text-center mb-16 reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">What Drives Us</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,52px)] font-light text-[#1a1714] mt-3">
              Core Values Title Here
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e2da]">
{values.map((v, i) => {
  const Icon = ICONS[v.icon];

  return (
    <div
      key={v.title}
      className="
        reveal
        bg-white
        p-8 lg:p-10
        group
        hover:bg-stone-darkest
        transition-colors
        duration-500
      "
      style={{ transitionDelay: `${i * 80}ms` }}
    >
      <div className="mb-6">
        <Icon className="h-7 w-7 text-gold" />
      </div>

      <h3 className="mb-3 font-['Cormorant_Garamond'] text-xl font-semibold text-stone-darkest transition-colors group-hover:text-white">
        {v.title}
      </h3>

      <p className="text-sm font-light leading-relaxed text-stone-mid transition-colors group-hover:text-stone-light">
        {v.body}
      </p>
    </div>
  );
})}
          </div>
        </div>

        {/* Section rule */}
        <div className="hidden section-rule mb-28" />

        {/* Credentials */}
        <div>
          <div className="hidden flex flex-col lg:flex-row gap-12 items-start">
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
