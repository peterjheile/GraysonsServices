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

  const filters = [
    {
      id: 'all' as const,
      label: 'All Projects',
    },
    ...options.map((option) => ({
      id: option.slug,
      label: option.name,
    })),
  ];


  return (
    <div className="mb-10 sm:mb-12 lg:mb-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p
            id="projects-filter-label"
            className="
              text-[10px] font-semibold tracking-[0.25em]
              text-[#655d57] uppercase
            "
          >
            Filter by project type
          </p>

          <p className="mt-1 hidden text-sm text-[#817970] sm:block">
            Choose a category to narrow the gallery.
          </p>
        </div>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="
            shrink-0 text-[10px] font-medium
            tracking-[0.18em] text-[#766e67] uppercase
          "
        >
          {resultLabel}
        </p>
      </div>

      {/* Mobile and small tablet */}
      <div
        role="group"
        aria-labelledby="projects-filter-label"
        className="
          overflow-hidden border border-[#ded7ce]
          bg-[#f8f6f2] p-1.5 shadow-xs md:hidden
        "
      >
        <ScrollableTabs
          activeId={activeFilter}
          previousLabel="View previous project filters"
          nextLabel="View more project filters"
          hideMobileScrollbar
          trackClassName="gap-2"
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              id={filter.id}
              label={filter.label}
              isActive={activeFilter === filter.id}
              onClick={() => onFilterChange(filter.id)}
            />
          ))}
        </ScrollableTabs>
      </div>

      {/* Desktop */}
      <div
        role="group"
        aria-labelledby="projects-filter-label"
        className="
          hidden md:flex md:flex-wrap
          md:items-center md:justify-start md:gap-3
        "
      >
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            id={filter.id}
            label={filter.label}
            isActive={activeFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
          />
        ))}
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
        relative shrink-0 whitespace-nowrap
        rounded-sm border px-4 py-2.5
        text-[10px] font-semibold
        tracking-[0.13em] uppercase

        transition-[transform,background-color,border-color,color,box-shadow]
        duration-200 ease-out

        focus-visible:outline-2
        focus-visible:outline-offset-3
        focus-visible:outline-gold

        md:rounded-none
        md:px-5 md:py-3
        md:tracking-[0.15em]

        ${
          isActive
            ? `
              -translate-y-px
              border-gold
              bg-gold
              text-stone-darkest
              shadow-[0_6px_16px_rgba(83,70,46,0.18)]
            `
            : `
              border-[#d8d0c7]
              bg-white
              text-[#655d57]
              shadow-[0_3px_10px_rgba(44,38,32,0.07)]

              hover:-translate-y-px
              hover:border-gold/80
              hover:bg-[#f5f0e7]
              hover:text-[#80652f]
              hover:shadow-[0_6px_16px_rgba(83,70,46,0.13)]
            `
        }
      `}
    >
      {label}
    </button>
  );
}