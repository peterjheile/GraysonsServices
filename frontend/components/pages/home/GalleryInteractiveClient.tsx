'use client';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { category, Project } from './types';

type GalleryInteractiveProps = {
  projects: Project[];
  categories: category[];
};

export default function GalleryInteractive({
  projects,
  categories,
}: GalleryInteractiveProps) {
  const [active, setActive] = useState<category>('All');

  const filtered =
    active === 'All'
      ? projects
      : projects.filter((p) => p.category === active);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      document
        .querySelectorAll('#gallery .reveal, #gallery .reveal-scale')
        .forEach((el) => el.classList.add('visible'));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [active]);

  return (
    <>
      {/* Filter tabs */}
      <div className="reveal flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
              active === cat
                ? 'border-gold bg-gold text-stone-darkest'
                : 'border-stone-dark text-stone-light hover:border-gold/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-style grid */}
      <div className="mt-10 grid auto-rows-[280px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <div
            key={`${active}-${project.id}`}
            className={`project-card relative cursor-pointer reveal-scale ${
              project.size === 'large' ? 'lg:row-span-2' : ''
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <img
              src={project.img_url}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-stone-darkest/90 via-stone-darkest/20 to-transparent" />

            <div className="absolute left-4 top-4 bg-gold px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#1a1714]">
              {project.category}
            </div>

            <div className="card-overlay absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-gold">
                {project.location}
              </div>

              <h3 className="mb-4 font-['Cormorant_Garamond'] text-2xl font-medium text-white lg:text-3xl">
                {project.title}
              </h3>

              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
                <span>View Project</span>

                <FiArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}