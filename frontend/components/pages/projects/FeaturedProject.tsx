import Link from 'next/link';

import type { Project } from '@/features/projects/types';

import FeaturedProjectMedia from './FeaturedProjectMedia';

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

export default function FeaturedProject({
  project,
  index,
}: FeaturedProjectProps) {
  const flip = index % 2 === 1;
  const headingId = `featured-project-${project.id}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className="border-b border-stone-pale py-16 first:pt-0 last:border-none md:py-20 lg:py-24"
    >
      <div className="reveal lg:hidden">
        <ProjectHeader
          project={project}
          number={index + 1}
        />
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div
          className={`${
            flip ? 'reveal-right lg:order-2' : 'reveal-left'
          } min-w-0`}
        >
          <FeaturedProjectMedia
            key={project.id}
            project={project}
          />
        </div>

        <ProjectContent
          project={project}
          headingId={headingId}
          flip={flip}
          number={index + 1}
        />
      </div>
    </article>
  );
}

function ProjectHeader({
  project,
  number,
}: {
  project: Project;
  number: number;
}) {
  const meta = [
    project.location,
    project.completion_year,
  ].filter(Boolean);

  return (
    <div className="mb-8 flex items-center gap-4 sm:mb-10">
      <span
        aria-hidden="true"
        className="font-['Cormorant_Garamond'] text-5xl leading-none font-light text-stone-pale"
      >
        {String(number).padStart(2, '0')}
      </span>

      <span
        aria-hidden="true"
        className="h-10 w-px bg-stone-pale"
      />

      <div>
        {project.category && (
          <span className="inline-block bg-gold px-3 py-1 text-[9px] font-semibold tracking-[0.3em] text-stone-darkest uppercase">
            {project.category}
          </span>
        )}

        {meta.length > 0 && (
          <p className="mt-1.5 text-[10px] tracking-[0.2em] text-stone-light uppercase">
            {meta.join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}

function ProjectContent({
  project,
  headingId,
  flip,
  number,
}: {
  project: Project;
  headingId: string;
  flip: boolean;
  number: number;
}) {
  return (
    <div
      className={`${
        flip ? 'reveal-left lg:order-1' : 'reveal-right'
      } min-w-0`}
    >
      <div className="hidden lg:block">
        <ProjectHeader
          project={project}
          number={number}
        />
      </div>

      <h2
        id={headingId}
        className="mb-3 font-['Cormorant_Garamond'] text-[clamp(2rem,3.8vw,3.125rem)] leading-tight font-light text-stone-darkest"
      >
        {project.title}
      </h2>

      {(project.duration || project.area) && (
        <dl className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          {project.duration && (
            <ProjectMeta
              label="Duration"
              value={project.duration}
            />
          )}

          {project.area && (
            <ProjectMeta
              label="Area"
              value={project.area}
            />
          )}
        </dl>
      )}

      {project.caption && (
        <p className="mb-8 text-sm leading-relaxed font-light text-stone">
          {project.caption}
        </p>
      )}

      {(project.challenge || project.approach || project.result) && (
        <div className="mb-8 space-y-5">
          {project.challenge && (
            <DetailBlock
              label="The Challenge"
              text={project.challenge}
              borderClassName="border-stone-pale"
            />
          )}

          {project.approach && (
            <DetailBlock
              label="Our Approach"
              text={project.approach}
              borderClassName="border-gold/50"
            />
          )}

          {project.result && (
            <DetailBlock
              label="The Result"
              text={project.result}
              borderClassName="border-gold"
            />
          )}
        </div>
      )}

      {project.materials.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-[9px] font-medium tracking-[0.3em] text-stone-light uppercase">
            Materials Used
          </h3>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {project.materials.map((material) => (
              <li
                key={material}
                className="flex items-center gap-2 text-xs font-light text-stone"
              >
                <span
                  aria-hidden="true"
                  className="size-1 rounded-full bg-gold"
                />
                {material}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/contact"
        className="btn-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none motion-reduce:before:transition-none"
      >
        <span>Start a Similar Project</span>

        <svg
          aria-hidden="true"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          className="relative z-10"
        >
          <path
            d="M1.5 6.5h10M8 3l3.5 3.5L8 10"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

function ProjectMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-xs">
      <dt className="inline text-stone-light">
        {label}:{' '}
      </dt>
      <dd className="inline font-medium text-stone-darkest">
        {value}
      </dd>
    </div>
  );
}

function DetailBlock({
  label,
  text,
  borderClassName,
}: {
  label: string;
  text: string;
  borderClassName: string;
}) {
  return (
    <div className={`border-l-2 pl-4 ${borderClassName}`}>
      <h3 className="mb-1 text-[9px] font-medium tracking-[0.3em] text-stone-light uppercase">
        {label}
      </h3>
      <p className="text-sm leading-relaxed font-light text-stone">
        {text}
      </p>
    </div>
  );
}