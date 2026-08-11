'use client';

import { useRef, useState } from 'react';

import ApplicationForm from '@/components/pages/careers/ApplicationForm';
import type { JobListing, JobPosting } from '@/features/careers/types';

interface JobCardProps {
  readonly job: JobListing;
}

interface DetailListProps {
  readonly heading: string;
  readonly items: readonly string[];
  readonly variant?: 'check' | 'muted';
}

const levelColors: Readonly<Record<string, string>> = {
  'Entry Level': 'bg-[#e8e2da] text-[#5c5550]',
  'Mid-Level': 'bg-[#dde8da] text-[#3a5e36]',
  Senior: 'bg-[#dde0e8] text-[#364a5e]',
  Lead: 'bg-[#e8dada] text-[#5e3636]',
  Manager: 'bg-[#e8e4da] text-[#5e5036]',
};

const typeColors: Readonly<
  Record<JobPosting['employment_type'], string>
> = {
  'full-time': 'border-[#b8975a] text-[#b8975a]',
  'part-time': 'border-[#7a9e7e] text-[#7a9e7e]',
  seasonal: 'border-[#9e8a7a] text-[#9e8a7a]',
  temporary: 'border-[#9e7a7a] text-[#9e7a7a]',
  contract: 'border-[#7a7e9e] text-[#7a7e9e]',
  internship: 'border-[#6f8f9e] text-[#6f8f9e]',
};

function DetailList({ heading, items, variant }: DetailListProps) {
  const isMuted = variant === 'muted';

  return (
    <div>
      <h4
        className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] ${
          isMuted ? 'text-[#a39890]' : 'text-[#b8975a]'
        }`}
      >
        {heading}
      </h4>
      <ul className={isMuted ? 'space-y-2' : 'space-y-3'}>
        {items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className={`flex items-start gap-3 text-sm font-light ${
              isMuted ? 'italic text-[#a39890]' : 'text-[#1a1714]'
            }`}
          >
            {variant === 'check' ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="mt-[5px] shrink-0"
                aria-hidden="true"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="#b8975a"
                  strokeWidth="1"
                />
                <path
                  d="M3.5 6l2 2 3-3"
                  stroke="#b8975a"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span
                className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                  isMuted ? 'bg-[#c5bdb5]' : 'bg-[#b8975a]'
                }`}
              />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JobCard({ job }: JobCardProps) {
  const [view, setView] = useState<'closed' | 'details' | 'application'>(
    'closed',
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const isOpen = view !== 'closed';
  const panelId = `job-${job.slug}-panel`;
  const titleId = `job-${job.slug}-title`;

  const toggleDetails = () => {
    setView((current) => (current === 'closed' ? 'details' : 'closed'));
  };

  const openApplication = () => {
    setView('application');

    window.setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <article
      ref={cardRef}
      aria-labelledby={titleId}
      className={`scroll-mt-24 border bg-white transition-all duration-300 ${
        isOpen
          ? 'border-[#b8975a]/50 shadow-[0_8px_40px_rgba(26,23,20,0.10)]'
          : 'border-[#e8e2da] hover:border-[#b8975a]/30 hover:shadow-[0_4px_24px_rgba(26,23,20,0.06)]'
      }`}
    >
      <button
        type="button"
        className="flex w-full cursor-pointer select-none flex-col gap-4 p-6 text-left sm:flex-row sm:items-center lg:p-8"
        onClick={toggleDetails}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {job.urgent && (
              <span className="inline-flex items-center gap-1 bg-[#b8975a] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#1a1714]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1a1714]" />
                Urgent
              </span>
            )}

            {job.level && (
              <span
                className={`rounded-sm px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${
                  levelColors[job.level] ??
                  'bg-[#e8e2da] text-[#5c5550]'
                }`}
              >
                {job.level}
              </span>
            )}

            <span
              className={`border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${typeColors[job.typeValue]}`}
            >
              {job.type}
            </span>
          </div>

          <h3
            id={titleId}
            className="font-['Cormorant_Garamond'] text-[clamp(18px,2vw,24px)] font-semibold leading-tight text-[#1a1714]"
          >
            {job.title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <span className="flex items-center gap-1.5 text-xs text-[#a39890]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="6"
                  cy="5"
                  r="2"
                  stroke="#a39890"
                  strokeWidth="1.1"
                />
                <path
                  d="M6 2a3 3 0 013 3c0 3-3 6-3 6S3 8 3 5a3 3 0 013-3z"
                  stroke="#a39890"
                  strokeWidth="1.1"
                />
              </svg>
              {job.location}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-[#a39890]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4"
                  stroke="#a39890"
                  strokeWidth="1.1"
                />
                <path
                  d="M6 3.5V6l1.5 1.5"
                  stroke="#a39890"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              Posted {job.posted}
            </span>

            <span className="text-xs text-[#a39890]">{job.department}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-2">
          <div className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714]">
            {job.pay}
          </div>
          <span
            className={`flex h-8 w-8 items-center justify-center border border-[#e8e2da] text-[#a39890] transition-all duration-300 ${
              isOpen ? 'rotate-180 border-[#b8975a] text-[#b8975a]' : ''
            }`}
            aria-hidden="true"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </button>

      {view === 'details' && (
        <div
          id={panelId}
          className="animate-[jobBoardExpandDown_0.35s_cubic-bezier(0.16,1,0.3,1)_both] border-t border-[#e8e2da] px-6 py-8 motion-reduce:animate-none lg:px-8"
        >
          <p className="mb-8 max-w-3xl text-sm font-light leading-relaxed text-[#5c5550]">
            {job.summary}
          </p>

          <div className="mb-8 grid gap-10 lg:grid-cols-2">
            {job.responsibilities.length > 0 && (
              <DetailList
                heading="What You'll Do"
                items={job.responsibilities}
              />
            )}

            <div className="space-y-8">
              {job.requirements.length > 0 && (
                <DetailList
                  heading="What We Need"
                  items={job.requirements}
                  variant="check"
                />
              )}

              {job.niceToHave.length > 0 && (
                <DetailList
                  heading="Nice to Have"
                  items={job.niceToHave}
                  variant="muted"
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-[#f0ece6] pt-6">
            <button
              type="button"
              onClick={openApplication}
              className="btn-primary"
            >
              <span>Apply for This Role</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="relative z-10"
                aria-hidden="true"
              >
                <path
                  d="M1.5 6.5h10M8 3l3.5 3.5L8 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <a
              href={`mailto:careers@graysonsservices.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
              className="text-[11px] uppercase tracking-[0.2em] text-[#a39890] transition-colors hover:text-[#5c5550] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8975a]"
            >
              Or email your resume &rarr;
            </a>
          </div>
        </div>
      )}

      {view === 'application' && (
        <div
          id={panelId}
          className="animate-[jobBoardExpandDown_0.4s_cubic-bezier(0.16,1,0.3,1)_both] border-t border-[#b8975a]/30 motion-reduce:animate-none"
        >
          <ApplicationForm job={job} onClose={() => setView('closed')} />
        </div>
      )}
    </article>
  );
}