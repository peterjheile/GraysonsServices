'use client';

import { useEffect, useRef, useState } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import type { Project } from './projectsData';

export default function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const flip = index % 2 === 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.06 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="py-24 lg:py-32 border-b border-[#e8e2da] last:border-none"
    >
      {/* Project index + category tag */}
      <div className="flex items-center gap-4 mb-10 reveal">
        <span className="font-['Cormorant_Garamond'] text-5xl font-light text-[#e8e2da]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-px h-10 bg-[#e8e2da]" />
        <div>
          <span className="inline-block px-3 py-1 bg-[#b8975a] text-[9px] tracking-[0.3em] uppercase font-semibold text-[#1a1714]">
            {project.category}
          </span>
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#a39890] mt-1.5">{project.location} · {project.year}</div>
        </div>
      </div>

      <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>

        {/* ── Visual column ── */}
        <div className={`reveal-${flip ? 'right' : 'left'} space-y-3`}>
          {/* Before / After slider — main feature */}
          <BeforeAfterSlider
            before={project.before}
            after={project.after}
            className="w-full aspect-[4/3]"
          />

          {/* After gallery thumbnails */}
          {project.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {/* Active slot — bigger */}
              <div className="col-span-2 project-card relative aspect-[3/2] overflow-hidden cursor-pointer">
                <img
                  src={project.gallery[galleryIdx]}
                  alt={`${project.title} detail ${galleryIdx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-[#1a1714]/70 text-[9px] tracking-[0.2em] uppercase text-[#faf8f5]">After</span>
                </div>
              </div>
              {/* Thumbnail picker */}
              <div className="flex flex-col gap-3">
                {project.gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    className={`relative flex-1 overflow-hidden transition-all duration-200 ${
                      i === galleryIdx ? 'ring-2 ring-[#b8975a]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Detail column ── */}
        <div className={`reveal-${flip ? 'left' : 'right'}`}>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(30px,3.8vw,50px)] font-light text-[#1a1714] leading-tight mb-3">
            {project.title}
          </h2>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 mb-6">
            {[
              project.duration && { label: 'Duration', val: project.duration },
              project.sqft && { label: 'Area', val: project.sqft },
            ].filter(Boolean).map((m: any) => (
              <div key={m.label} className="text-xs">
                <span className="text-[#a39890]">{m.label}: </span>
                <span className="text-[#1a1714] font-medium">{m.val}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((t) => (
              <span key={t} className="px-3 py-1 border border-[#e8e2da] text-[10px] tracking-[0.15em] uppercase text-[#a39890]">
                {t}
              </span>
            ))}
          </div>

          <p className="text-[#5c5550] text-sm leading-relaxed font-light mb-8">
            {project.summary}
          </p>

          {/* Challenge / Solution / Result */}
          <div className="space-y-5 mb-8">
            {[
              { label: 'The Challenge', text: project.challenge, color: 'border-[#e8e2da]' },
              { label: 'Our Approach', text: project.solution, color: 'border-[#b8975a]/50' },
              { label: 'The Result', text: project.result, color: 'border-[#b8975a]' },
            ].map((block) => (
              <div key={block.label} className={`pl-4 border-l-2 ${block.color}`}>
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#a39890] font-medium mb-1">{block.label}</div>
                <p className="text-sm text-[#5c5550] font-light leading-relaxed">{block.text}</p>
              </div>
            ))}
          </div>

          {/* Materials */}
          <div className="mb-8">
            <div className="text-[9px] tracking-[0.3em] uppercase text-[#a39890] font-medium mb-3">Materials Used</div>
            <div className="flex flex-wrap gap-2">
              {project.materials.map((m) => (
                <span key={m} className="flex items-center gap-1.5 text-xs text-[#5c5550] font-light">
                  <span className="w-1 h-1 rounded-full bg-[#b8975a] inline-block" />
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="bg-[#f5f1eb] border-l-4 border-[#b8975a] p-5 mb-8">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="mb-3">
                <path d="M0 16V9.6C0 4.267 3.2 1.067 9.6 0L10.4 1.6C7.467 2.4 6 4.267 6 7.2H9.6V16H0ZM10.4 16V9.6C10.4 4.267 13.6 1.067 20 0L20.8 1.6C17.867 2.4 16.4 4.267 16.4 7.2H20V16H10.4Z" fill="#b8975a" fillOpacity="0.3"/>
              </svg>
              <p className="text-sm text-[#5c5550] italic font-light leading-relaxed mb-3">
                {project.testimonial.quote}
              </p>
              <div className="text-xs font-medium text-[#1a1714]">{project.testimonial.author}</div>
              <div className="text-[10px] text-[#a39890]">{project.testimonial.role}</div>
            </div>
          )}

          <a href="#contact" className="btn-primary">
            <span>Start a Similar Project</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
              <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
