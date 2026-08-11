import Link from 'next/link';

import FeaturedProject from '@/components/pages/projects/FeaturedProject';
import ProjectCard from '@/components/pages/projects/ProjectCard';

import type { Project } from '@/features/projects/types';

interface ProjectsGridProps {
  featuredProjects: readonly Project[];
  projects: readonly Project[];
  hasProjectData: boolean;
}

export default function ProjectsGrid({
  featuredProjects,
  projects,
  hasProjectData,
}: ProjectsGridProps) {
  if (!hasProjectData) {
    return <ProjectsEmptyState />;
  }

  return (
    <div>
      {featuredProjects.length > 0 && (
        <section aria-labelledby="featured-projects-heading">
          <SectionHeading
            id="featured-projects-heading"
            label="Featured Work"
            accent
          />

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                id={project.slug}
                className="scroll-mt-32"
              >
                <FeaturedProject
                  project={project}
                  index={index}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section
          aria-labelledby="more-projects-heading"
          className={
            featuredProjects.length > 0
              ? 'mt-20 md:mt-24 lg:mt-32'
              : ''
          }
        >
          <SectionHeading
            id="more-projects-heading"
            label={
              featuredProjects.length > 0
                ? 'More Projects'
                : 'Projects'
            }
          />

          <div
            className="
              grid grid-cols-1 gap-8
              sm:grid-cols-2
              md:gap-10
              xl:grid-cols-3
            "
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                id={project.slug}
                className="reveal-scale scroll-mt-32"
                style={{
                  transitionDelay: `${Math.min(index, 4) * 70}ms`,
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface SectionHeadingProps {
  id: string;
  label: string;
  accent?: boolean;
}

function SectionHeading({
  id,
  label,
  accent = false,
}: SectionHeadingProps) {
  return (
    <div className="reveal mb-8 flex items-center gap-4 sm:mb-10 lg:mb-12">
      <div
        aria-hidden="true"
        className={`h-px w-6 shrink-0 ${
          accent ? 'bg-gold' : 'bg-stone-pale'
        }`}
      />

      <h2
        id={id}
        className={`text-[10px] font-medium tracking-[0.35em] uppercase ${
          accent ? 'text-gold' : 'text-stone-light'
        }`}
      >
        {label}
      </h2>
    </div>
  );
}

function ProjectsEmptyState() {
  return (
    <section
      aria-labelledby="projects-empty-heading"
      className="reveal py-20 text-center sm:py-24 lg:py-28"
    >
      <p className="text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
        Project Gallery
      </p>

      <h2
        id="projects-empty-heading"
        className="
          mx-auto mt-4 max-w-2xl
          font-['Cormorant_Garamond']
          text-3xl leading-tight font-light
          text-stone-darkest
          sm:text-4xl
        "
      >
        New project stories are being prepared.
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed font-light text-stone sm:text-base">
        Have a property project in mind? Tell us what you would like to improve,
        and we can help you plan the next step.
      </p>

      <Link
        href="/contact"
        className="btn-primary mt-8 justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none motion-reduce:before:transition-none"
      >
        <span>Discuss Your Project</span>
      </Link>
    </section>
  );
}