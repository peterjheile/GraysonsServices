'use client';

import { useState, useEffect, useRef } from 'react';
import { projects, categories, type Project } from './projectsData';
import FeaturedProject from '@/components/pages/projects/FeaturedProject';
import ProjectCard from '@/components/pages/projects/ProjectCard';

export default function ProjectsGrid() {
  const [activeCategory, setActiveCategory] = useState('All');
  const ref = useRef<HTMLDivElement>(null);

  const featured = projects.filter(
    (p) => p.featured && (activeCategory === 'All' || p.category === activeCategory)
  );
  const rest = projects.filter(
    (p) => !p.featured && (activeCategory === 'All' || p.category === activeCategory)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.08 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-scale');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory]);

  return (
    <div ref={ref} className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8 reveal">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-300 border ${
              activeCategory === cat
                ? 'bg-[#b8975a] border-[#b8975a] text-[#1a1714]'
                : 'border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40 hover:text-[#5c5550]'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="self-center ml-auto text-[10px] tracking-[0.2em] uppercase text-[#a39890]">
          {featured.length + rest.length} project{featured.length + rest.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Featured spotlight projects */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center gap-4 reveal">
            <div className="w-6 h-[1px] bg-[#b8975a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Featured Work</span>
          </div>
          {featured.map((project, i) => (
            <FeaturedProject key={project.id} project={project} index={i} />
          ))}
        </section>
      )}

      {/* Compact card grid for remaining projects */}
      {rest.length > 0 && (
        <section className="mt-24">
          <div className="flex items-center gap-4 mb-12 reveal">
            <div className="w-6 h-[1px] bg-[#e8e2da]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#a39890] font-medium">More Projects</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {rest.map((project, i) => (
              <div key={project.id} style={{ transitionDelay: `${i * 80}ms` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {featured.length === 0 && rest.length === 0 && (
        <div className="text-center py-32">
          <p className="font-['Cormorant_Garamond'] text-3xl text-[#a39890] font-light">
            No projects in this category yet.
          </p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-6 btn-outline"
          >
            <span>View All Projects</span>
          </button>
        </div>
      )}
    </div>
  );
}
