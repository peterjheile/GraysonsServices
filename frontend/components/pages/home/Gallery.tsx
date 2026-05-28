'use client';

import { useEffect, useRef, useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'Simple Wooden Deck',
    category: 'Decks',
    location: 'Bloomington, IN',
    size: 'large',
    img: '/services/Deck1.jpg',
  },
  {
    id: 2,
    title: 'Quality Retaining Wall',
    category: 'Retaining Walls',
    location: 'Bloomington, IN',
    size: 'small',
    img: '/services/RetainingWall1.jpg',
  },
  {
    id: 3,
    title: 'Curved Walkways',
    category: 'Walkways',
    location: 'Bloomington, IN',
    size: 'small',
    img: '/services/Walkway1.jpg',
  },
  {
    id: 4,
    title: 'Gravel Driveway Touch Up',
    category: 'Driveways',
    location: 'Bloomington, IN',
    size: 'small',
    img: '/services/Driveway1.jpg',
  },
  {
    id: 6,
    title: 'Layered Stone Retaining Wall',
    category: 'Retaining Walls',
    location: 'Bloomington, IN',
    size: 'large',
    img: '/services/RetainingWall2.jpg',
  },
  {
    id: 5,
    title: 'Floating Wooden Deck',
    category: 'Decks',
    location: 'Bloomington, IN',
    size: 'small',
    img: '/services/Deck2.jpg',
  },
];

const categories = ['All', 'Decks', 'Driveways', 'Retaining Walls', 'Walkways'];

export default function Gallery() {
  const [active, setActive] = useState('All');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-scale');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <section id="gallery" ref={ref} className="bg-[#1a1714] py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Our Work</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-[#faf8f5] mt-3 leading-tight">
              Featured Projects
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="reveal flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 border ${
                  active === cat
                    ? 'bg-[#b8975a] border-[#b8975a] text-[#1a1714]'
                    : 'border-[#2d2926] text-[#a39890] hover:border-[#b8975a]/50 hover:text-[#faf8f5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-3">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`project-card relative reveal-scale cursor-pointer ${
                project.size === 'large' ? 'lg:row-span-2' : ''
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <img
                src={project.img}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/90 via-[#1a1714]/20 to-transparent" />

              {/* Always-visible category pill */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#b8975a] text-[9px] tracking-[0.25em] uppercase font-semibold text-[#1a1714]">
                {project.category}
              </div>

              {/* Hover overlay content */}
              <div className="card-overlay absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#b8975a] mb-2">
                  {project.location}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-medium text-[#faf8f5] mb-4">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#faf8f5]/70">
                  <span>View Project</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 reveal">
          <a href="#contact" className="btn-outline" style={{ borderColor: '#b8975a', color: '#b8975a' }}>
            <span>View Full Portfolio</span>
          </a>
        </div>
      </div>
    </section>
  );
}
