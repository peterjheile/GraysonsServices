'use client';

import { useState, useEffect, useRef } from 'react';
import { jobs, departments, jobTypes, type JobListing } from './careersData';
import ApplicationForm from '@/components/pages/careers/ApplicationForm';

const levelColors: Record<string, string> = {
  'Entry Level': 'bg-[#e8e2da] text-[#5c5550]',
  'Mid Level':   'bg-[#dde8da] text-[#3a5e36]',
  'Senior':      'bg-[#dde0e8] text-[#364a5e]',
  'Lead':        'bg-[#e8dada] text-[#5e3636]',
  'Management':  'bg-[#e8e4da] text-[#5e5036]',
};

const typeColors: Record<string, string> = {
  'Full-Time': 'border-[#b8975a] text-[#b8975a]',
  'Part-Time': 'border-[#7a9e7e] text-[#7a9e7e]',
  'Seasonal':  'border-[#9e8a7a] text-[#9e8a7a]',
  'Contract':  'border-[#7a7e9e] text-[#7a7e9e]',
};

function JobCard({ job }: { job: JobListing }) {
  const [expanded, setExpanded]   = useState(false);
  const [applying, setApplying]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    if (applying) { setApplying(false); return; }
    setExpanded((e) => !e);
  };

  const openApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(false);
    setApplying(true);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const closeApply = () => { setApplying(false); };

  return (
    <div
      ref={cardRef}
      className={`border transition-all duration-300 ${
        expanded || applying
          ? 'border-[#b8975a]/50 shadow-[0_8px_40px_rgba(26,23,20,0.10)]'
          : 'border-[#e8e2da] hover:border-[#b8975a]/30 hover:shadow-[0_4px_24px_rgba(26,23,20,0.06)]'
      } bg-white`}
    >
      {/* ── Row header — always visible ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 lg:p-8 cursor-pointer select-none"
        onClick={toggleExpand}
      >
        {/* Left: title block */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {job.urgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#b8975a] text-[9px] tracking-[0.25em] uppercase font-bold text-[#1a1714]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a1714] inline-block" />
                Urgent
              </span>
            )}
            <span className={`px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-semibold rounded-sm ${levelColors[job.level]}`}>
              {job.level}
            </span>
            <span className={`px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase border ${typeColors[job.type]}`}>
              {job.type}
            </span>
          </div>
          <h3 className="font-['Cormorant_Garamond'] text-[clamp(18px,2vw,24px)] font-semibold text-[#1a1714] leading-tight">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-[#a39890]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="5" r="2" stroke="#a39890" strokeWidth="1.1"/><path d="M6 2a3 3 0 013 3c0 3-3 6-3 6S3 8 3 5a3 3 0 013-3z" stroke="#a39890" strokeWidth="1.1"/></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#a39890]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="#a39890" strokeWidth="1.1"/><path d="M6 3.5V6l1.5 1.5" stroke="#a39890" strokeWidth="1.1" strokeLinecap="round"/></svg>
              Posted {job.posted}
            </span>
            <span className="text-xs text-[#a39890]">{job.department}</span>
          </div>
        </div>

        {/* Right: pay + chevron */}
        <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-2">
          <div className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714]">{job.pay}</div>
          <div
            className={`w-8 h-8 border border-[#e8e2da] flex items-center justify-center text-[#a39890] transition-all duration-300 ${
              expanded || applying ? 'rotate-180 border-[#b8975a] text-[#b8975a]' : ''
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && !applying && (
        <div className="border-t border-[#e8e2da] px-6 lg:px-8 py-8 animate-[expandDown_0.35s_cubic-bezier(0.16,1,0.3,1)_both]">
          {/* Summary */}
          <p className="text-[#5c5550] text-sm font-light leading-relaxed mb-8 max-w-3xl">{job.summary}</p>

          <div className="grid lg:grid-cols-2 gap-10 mb-8">
            {/* Responsibilities */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-semibold mb-4">What You'll Do</h4>
              <ul className="space-y-3">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-[#1a1714] font-light">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#b8975a] shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              {/* Requirements */}
              <div>
                <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-semibold mb-4">What We Need</h4>
                <ul className="space-y-3">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-sm text-[#1a1714] font-light">
                      <span className="mt-[5px] shrink-0">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" stroke="#b8975a" strokeWidth="1"/>
                          <path d="M3.5 6l2 2 3-3" stroke="#b8975a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to have */}
              {job.niceToHave && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#a39890] font-semibold mb-4">Nice to Have</h4>
                  <ul className="space-y-2">
                    {job.niceToHave.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-sm text-[#a39890] font-light italic">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#c5bdb5] shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Apply CTA */}
          <div className="pt-6 border-t border-[#f0ece6] flex flex-wrap items-center gap-4">
            <button onClick={openApply} className="btn-primary">
              <span>Apply for This Role</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
                <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <a
              href={`mailto:careers@graysonsservices.com?subject=Application: ${job.title}`}
              className="text-[11px] tracking-[0.2em] uppercase text-[#a39890] hover:text-[#5c5550] transition-colors"
            >
              Or email your resume →
            </a>
          </div>
        </div>
      )}

      {/* ── Inline application form ── */}
      {applying && (
        <div className="border-t border-[#b8975a]/30 animate-[expandDown_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <ApplicationForm job={job} onClose={closeApply} />
        </div>
      )}

      <style jsx>{`
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function JobBoard() {
  const [activeDept, setActiveDept]   = useState('All');
  const [activeType, setActiveType]   = useState('All');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = jobs.filter((j) => {
    const d = activeDept === 'All' || j.department === activeDept;
    const t = activeType === 'All' || j.type === activeType;
    return d && t;
  });

  const urgent   = filtered.filter((j) => j.urgent);
  const standard = filtered.filter((j) => !j.urgent);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.06 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered.length]);

  return (
    <section id="positions" ref={ref} className="bg-[#faf8f5] py-28 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div className="reveal">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#b8975a]" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Open Positions</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,56px)] font-light text-[#1a1714] leading-tight">
              Where You<br />
              <em className="italic text-[#b8975a]">Fit In</em>
            </h2>
          </div>
          <div className="reveal">
            <p className="text-[#5c5550] text-sm font-light leading-relaxed max-w-md">
              {filtered.length} open position{filtered.length !== 1 ? 's' : ''}. Click any role to read the full description and apply directly — no account, no third-party portal.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="reveal flex flex-col sm:flex-row gap-4 mb-12 pb-10 border-b border-[#e8e2da]">
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-medium border transition-all duration-200 ${
                  activeDept === d
                    ? 'bg-[#b8975a] border-[#b8975a] text-[#1a1714]'
                    : 'border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40 hover:text-[#5c5550]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="hidden sm:block w-px bg-[#e8e2da]" />
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-medium border transition-all duration-200 ${
                  activeType === t
                    ? 'bg-[#1a1714] border-[#1a1714] text-[#faf8f5]'
                    : 'border-[#e8e2da] text-[#a39890] hover:border-[#1a1714]/30 hover:text-[#5c5550]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Urgent roles */}
        {urgent.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5 reveal">
              <span className="w-2 h-2 rounded-full bg-[#b8975a] animate-pulse" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-medium">Urgent Openings</span>
            </div>
            <div className="space-y-3">
              {urgent.map((job) => (
                <div key={job.id} className="reveal-scale">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard roles */}
        {standard.length > 0 && (
          <div>
            {urgent.length > 0 && (
              <div className="flex items-center gap-3 mb-5 reveal">
                <div className="w-6 h-px bg-[#e8e2da]" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#a39890] font-medium">All Openings</span>
              </div>
            )}
            <div className="space-y-3">
              {standard.map((job, i) => (
                <div key={job.id} className="reveal-scale" style={{ transitionDelay: `${i * 60}ms` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24 border border-dashed border-[#e8e2da]">
            <p className="font-['Cormorant_Garamond'] text-3xl text-[#a39890] font-light mb-6">
              No positions match these filters.
            </p>
            <button
              onClick={() => { setActiveDept('All'); setActiveType('All'); }}
              className="btn-outline"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        )}

        {/* General interest nudge */}
        <div className="mt-16 bg-[#f5f1eb] border border-[#e8e2da] p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-6 reveal">
          <div className="flex-1">
            <div className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714] mb-2">
              Don't See the Right Fit?
            </div>
            <p className="text-sm text-[#5c5550] font-light leading-relaxed max-w-xl">
              We're growing quickly and occasionally hire for roles before we post them. If you're exceptional at what you do and believe in the craft, send us your details — we keep every inquiry on file.
            </p>
          </div>
          <a
            href="mailto:careers@graysonsservices.com"
            className="btn-primary shrink-0"
          >
            <span>Send a General Inquiry</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
              <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
