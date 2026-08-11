'use client';

import { useMemo, useState } from 'react';

import ProjectsFilter from '@/components/pages/projects/ProjectsFilter';
import type {ProjectFilterOption, ProjectFilter} from '@/components/pages/projects/types.ts'
import ProjectsGrid from '@/components/pages/projects/ProjectsGrid';

import type { Project } from '@/features/projects/types';

interface ProjectsSectionProps {
  projects: readonly Project[];
  featuredProjects: readonly Project[];
}

function uniqueProjects(projects: readonly Project[]): Project[] {
  return Array.from(
    new Map(projects.map((project) => [project.id, project])).values(),
  );
}

export default function ProjectsSection({
  projects,
  featuredProjects,
}: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] =
    useState<ProjectFilter>('all');

  const uniqueFeaturedProjects = useMemo(
    () => uniqueProjects(featuredProjects),
    [featuredProjects],
  );

  /*
   * The main endpoint normally includes featured projects. Merging both
   * responses by id keeps the count correct even if that API behavior changes.
   */
  const allProjects = useMemo(
    () => uniqueProjects([...projects, ...uniqueFeaturedProjects]),
    [projects, uniqueFeaturedProjects],
  );

  const filterOptions = useMemo<readonly ProjectFilterOption[]>(() => {
    const categories = new Map<string, string>();

    for (const project of allProjects) {
      if (project.category_slug && project.category) {
        categories.set(project.category_slug, project.category);
      }
    }

    return Array.from(categories, ([slug, name]) => ({
      slug,
      name,
    })).sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [allProjects]);

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return allProjects;
    }

    return allProjects.filter(
      (project) => project.category_slug === activeFilter,
    );
  }, [activeFilter, allProjects]);

  const visibleFeaturedProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return uniqueFeaturedProjects;
    }

    return uniqueFeaturedProjects.filter(
      (project) => project.category_slug === activeFilter,
    );
  }, [activeFilter, uniqueFeaturedProjects]);

  const visibleFeaturedIds = useMemo(
    () => new Set(visibleFeaturedProjects.map((project) => project.id)),
    [visibleFeaturedProjects],
  );

  /*
   * Exclude only projects rendered in the featured section. If the separate
   * featured request fails, featured projects from the main endpoint still
   * appear as standard cards rather than disappearing from the page.
   */
  const standardProjects = useMemo(
    () =>
      visibleProjects.filter(
        (project) => !visibleFeaturedIds.has(project.id),
      ),
    [visibleFeaturedIds, visibleProjects],
  );

  const hasProjects = allProjects.length > 0;

  return (
    <div
      className="
        mx-auto w-full max-w-(--max-content-width)
        px-5 py-12
        sm:px-6 sm:py-16
        md:px-8
        lg:px-12 lg:py-24
      "
    >
      {hasProjects && (
        <ProjectsFilter
          options={filterOptions}
          activeFilter={activeFilter}
          projectCount={visibleProjects.length}
          onFilterChange={setActiveFilter}
        />
      )}

      <ProjectsGrid
        featuredProjects={visibleFeaturedProjects}
        projects={standardProjects}
        hasProjectData={hasProjects}
      />
    </div>
  );
}