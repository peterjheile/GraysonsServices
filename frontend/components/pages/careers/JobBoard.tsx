'use client';

import { useMemo, useState } from 'react';

import JobCard from '@/components/pages/careers/JobCard';
import type { JobListing, JobPosting } from '@/features/careers/types';

import {
  getFilterOptions,
  toJobListing,
  type FilterOption,
} from './job-board-utils';

interface JobBoardProps {
  readonly jobPostings: readonly JobPosting[];
}

interface FilterGroupProps {
  readonly label: string;
  readonly activeValue: string;
  readonly options: readonly FilterOption[];
  readonly selectedClasses: string;
  readonly unselectedClasses: string;
  readonly onChange: (value: string) => void;
}

const filterButtonBase =
  'border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a]';

function FilterGroup({
  label,
  activeValue,
  options,
  selectedClasses,
  unselectedClasses,
  onChange,
}: FilterGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      <button
        type="button"
        onClick={() => onChange('all')}
        aria-pressed={activeValue === 'all'}
        className={`${filterButtonBase} ${
          activeValue === 'all' ? selectedClasses : unselectedClasses
        }`}
      >
        All
      </button>

      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={activeValue === option.value}
          className={`${filterButtonBase} ${
            activeValue === option.value
              ? selectedClasses
              : unselectedClasses
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function JobList({
  jobs,
  stagger = false,
}: {
  readonly jobs: readonly JobListing[];
  readonly stagger?: boolean;
}) {
  return (
    <div className="space-y-3">
      {jobs.map((job, index) => (
        <div
          key={job.slug}
          className="reveal-scale"
          style={
            stagger
              ? { transitionDelay: `${Math.min(index * 60, 300)}ms` }
              : undefined
          }
        >
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}

export default function JobBoard({ jobPostings }: JobBoardProps) {
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const { jobs, departments, jobTypes } = useMemo(() => {
    const mappedJobs = jobPostings.map(toJobListing);

    return {
      jobs: mappedJobs,
      departments: getFilterOptions(
        mappedJobs,
        (job) => job.departmentSlug,
        (job) => job.department,
      ),
      jobTypes: getFilterOptions(
        mappedJobs,
        (job) => job.typeValue,
        (job) => job.type,
      ),
    };
  }, [jobPostings]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          (activeDepartment === 'all' ||
            job.departmentSlug === activeDepartment) &&
          (activeType === 'all' || job.typeValue === activeType),
      ),
    [activeDepartment, activeType, jobs],
  );

  const urgentJobs = filteredJobs.filter((job) => job.urgent);
  const standardJobs = filteredJobs.filter((job) => !job.urgent);
  const clearFilters = () => {
    setActiveDepartment('all');
    setActiveType('all');
  };

  return (
    <section id="positions" className="bg-[#faf8f5] py-28 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-16 grid items-end gap-12 lg:grid-cols-2">
          <div className="reveal">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-8 bg-[#b8975a]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#b8975a]">
                Open Positions
              </span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,56px)] font-light leading-tight text-[#1a1714]">
              Where You
              <br />
              <em className="italic text-[#b8975a]">Fit In</em>
            </h2>
          </div>

          <div className="reveal">
            <p
              className="max-w-md text-sm font-light leading-relaxed text-[#5c5550]"
              aria-live="polite"
            >
              {filteredJobs.length} open position
              {filteredJobs.length === 1 ? '' : 's'}. Click any role to read
              the full description and apply directly &mdash; no account, no
              third-party portal.
            </p>
          </div>
        </div>

        {jobs.length > 0 && (
          <div className="reveal mb-12 flex flex-col gap-4 border-b border-[#e8e2da] pb-10 sm:flex-row">
            <FilterGroup
              label="Filter by department"
              activeValue={activeDepartment}
              options={departments}
              selectedClasses="border-[#b8975a] bg-[#b8975a] text-[#1a1714]"
              unselectedClasses="border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40 hover:text-[#5c5550]"
              onChange={setActiveDepartment}
            />

            <div className="hidden w-px bg-[#e8e2da] sm:block" />

            <FilterGroup
              label="Filter by employment type"
              activeValue={activeType}
              options={jobTypes}
              selectedClasses="border-[#1a1714] bg-[#1a1714] text-[#faf8f5]"
              unselectedClasses="border-[#e8e2da] text-[#a39890] hover:border-[#1a1714]/30 hover:text-[#5c5550]"
              onChange={setActiveType}
            />
          </div>
        )}

        {urgentJobs.length > 0 && (
          <div className="mb-10">
            <div className="reveal mb-5 flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8975a] motion-reduce:animate-none" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#b8975a]">
                Urgent Openings
              </span>
            </div>
            <JobList jobs={urgentJobs} />
          </div>
        )}

        {standardJobs.length > 0 && (
          <div>
            {urgentJobs.length > 0 && (
              <div className="reveal mb-5 flex items-center gap-3">
                <div className="h-px w-6 bg-[#e8e2da]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#a39890]">
                  All Openings
                </span>
              </div>
            )}
            <JobList jobs={standardJobs} stagger />
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="border border-dashed border-[#e8e2da] py-24 text-center">
            <p className="mb-6 font-['Cormorant_Garamond'] text-3xl font-light text-[#a39890]">
              {jobs.length === 0
                ? 'There are no open positions right now.'
                : 'No positions match these filters.'}
            </p>

            {jobs.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-outline"
              >
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        )}

        <div className="reveal mt-16 flex flex-col gap-6 border border-[#e8e2da] bg-[#f5f1eb] p-8 lg:flex-row lg:items-center lg:p-10">
          <div className="flex-1">
            <div className="mb-2 font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
              Don&apos;t See the Right Fit?
            </div>
            <p className="max-w-xl text-sm font-light leading-relaxed text-[#5c5550]">
              We are always interested in dependable people who take pride in
              good work. Send us your information and we will keep it on file
              for future openings.
            </p>
          </div>
          <a
            href="mailto:careers@graysonsservices.com"
            className="btn-primary shrink-0"
          >
            <span>Send a General Inquiry</span>
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
          </a>
        </div>
      </div>

      <style>{`
        @keyframes jobBoardExpandDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}