'use client';

import ScrollableTabs from '@/components/ui/scrollable-tabs';

import type {
  ProjectFilter,
  ProjectFilterOption,
} from './types';


interface ProjectsFilterProps {
  options: readonly ProjectFilterOption[];
  activeFilter: ProjectFilter;
  projectCount: number;
  onFilterChange: (filter: ProjectFilter) => void;
}

export default function ProjectsFilter({
  options,
  activeFilter,
  projectCount,
  onFilterChange,
}: ProjectsFilterProps) {
  const resultLabel = `${projectCount} ${
    projectCount === 1 ? 'project' : 'projects'
  }`;

  return (
    <div className="mb-10 sm:mb-12">
      <div className="mb-3 flex items-end justify-between gap-4">
        <p
          id="projects-filter-label"
          className="text-[10px] font-semibold tracking-[0.25em] text-[#655d57] uppercase"
        >
          Filter by project type
        </p>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="shrink-0 text-[10px] font-medium tracking-[0.2em] text-[#766e67] uppercase"
        >
          {resultLabel}
        </p>
      </div>

      <div
        role="group"
        aria-labelledby="projects-filter-label"
        className="border-y border-stone-pale bg-white"
      >
        <ScrollableTabs
          activeId={activeFilter}
          previousLabel="View previous project filters"
          nextLabel="View more project filters"
          hideMobileScrollbar
          centerWhenFits
          trackClassName="gap-2 py-3 md:gap-0 md:py-0"
        >
          <FilterButton
            id="all"
            label="All Projects"
            isActive={activeFilter === 'all'}
            onClick={() => onFilterChange('all')}
          />

          {options.map((option) => (
            <FilterButton
              key={option.slug}
              id={option.slug}
              label={option.name}
              isActive={activeFilter === option.slug}
              onClick={() => onFilterChange(option.slug)}
            />
          ))}
        </ScrollableTabs>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterButton({
  id,
  label,
  isActive,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      data-scroll-tab-id={id}
      aria-pressed={isActive}
      onClick={onClick}
      className={`
        shrink-0 whitespace-nowrap
        rounded-md border px-4 py-2.5
        text-[10px] font-semibold
        tracking-[0.13em] uppercase
        transition-colors duration-150

        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-gold

        md:rounded-none
        md:border-y-0 md:border-l-0
        md:border-r md:border-r-stone-pale
        md:px-4 md:py-4
        md:tracking-[0.15em]

        ${
          isActive
            ? `
              border-gold
              bg-gold
              text-stone-darkest
              md:bg-[#eee5d4]
              md:text-[#80652f]
            `
            : `
              border-[#d8d0c7]
              bg-white
              text-[#655d57]
              hover:border-gold/70
              hover:bg-[#f2eee8]
              hover:text-stone-darkest
              md:border-y-0
            `
        }
      `}
    >
      {label}
    </button>
  );
}