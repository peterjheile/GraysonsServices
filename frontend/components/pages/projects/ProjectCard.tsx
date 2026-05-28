'use client';

import { useState } from 'react';
import type { Project } from './projectsData';

export default function ProjectCard({ project }: { project: Project }) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="reveal-scale group">
      {/* Image toggle area */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4 cursor-pointer" onClick={() => setShowAfter(!showAfter)}>
        {/* After */}
        <img
          src={project.after}
          alt={`${project.title} — after`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showAfter ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Before */}
        <img
          src={project.before}
          alt={`${project.title} — before`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showAfter ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/70 via-transparent to-transparent" />

        {/* Toggle pill */}
        <button
          className="absolute bottom-3 left-3 flex overflow-hidden bg-[#1a1714]/70 backdrop-blur-sm"
          onClick={(e) => { e.stopPropagation(); setShowAfter(!showAfter); }}
        >
          <span className={`px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 ${!showAfter ? 'bg-[#faf8f5] text-[#1a1714]' : 'text-[#5c5550]'}`}>
            Before
          </span>
          <span className={`px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 ${showAfter ? 'bg-[#b8975a] text-[#1a1714]' : 'text-[#5c5550]'}`}>
            After
          </span>
        </button>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-[#1a1714]/80 backdrop-blur-sm text-[9px] tracking-[0.2em] uppercase text-[#b8975a]">
            {project.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714] leading-tight group-hover:text-[#b8975a] transition-colors duration-200">
            {project.title}
          </h3>
          <span className="text-[10px] tracking-[0.1em] text-[#a39890] shrink-0 mt-1">{project.year}</span>
        </div>
        <div className="text-[10px] tracking-[0.2em] uppercase text-[#a39890] mb-3">{project.location}</div>
        <p className="text-xs text-[#5c5550] font-light leading-relaxed line-clamp-2">{project.summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 border border-[#e8e2da] text-[9px] tracking-[0.1em] uppercase text-[#a39890]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
