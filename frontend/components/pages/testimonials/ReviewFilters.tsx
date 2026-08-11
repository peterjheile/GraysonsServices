import type {
  Review,
  ReviewSource,
} from '@/features/reviews/types';
import type { ReactNode } from 'react';

import { PlatformIcon } from './ReviewIcons';

const SOURCE_ORDER: Readonly<Record<ReviewSource, number>> = {
  google: 0,
  facebook: 1,
  in_person: 2,
};

type ReviewFiltersProps = {
  readonly reviews: readonly Review[];
  readonly activeCategory: string;
  readonly activeSource: 'all' | ReviewSource;
  readonly onCategoryChange: (category: string) => void;
  readonly onSourceChange: (
    source: 'all' | ReviewSource,
  ) => void;
};

export default function ReviewFilters({
  reviews,
  activeCategory,
  activeSource,
  onCategoryChange,
  onSourceChange,
}: ReviewFiltersProps) {
  const categories = Array.from(
    new Map(
      reviews
        .filter(
          (review) =>
            review.category && review.category_slug,
        )
        .map((review) => [
          review.category_slug as string,
          review.category as string,
        ]),
    ),
    ([id, label]) => ({ id, label }),
  ).sort((a, b) => a.label.localeCompare(b.label));

  const sources = Array.from(
    new Map(
      reviews.map((review) => [
        review.source,
        review.source_label,
      ]),
    ),
    ([id, label]) => ({ id, label }),
  ).sort(
    (first, second) =>
      SOURCE_ORDER[first.id] - SOURCE_ORDER[second.id],
  );

  const hasUncategorizedReviews = reviews.some(
    (review) => !review.category_slug,
  );
  const showCategories =
    categories.length > 1 ||
    (categories.length === 1 && hasUncategorizedReviews);
  const showSources = sources.length > 1;

  if (!showCategories && !showSources) {
    return null;
  }

  return (
    <div className="reveal mb-10 flex min-w-0 flex-col gap-4 border-b border-stone-pale pb-10 sm:flex-row sm:items-stretch">
      {showCategories && (
        <fieldset className="min-w-0">
          <legend className="sr-only">
            Filter reviews by category
          </legend>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={activeCategory === 'all'}
              onClick={() => onCategoryChange('all')}
              variant="category"
            >
              All
            </FilterButton>

            {categories.map((category) => (
              <FilterButton
                key={category.id}
                active={activeCategory === category.id}
                onClick={() =>
                  onCategoryChange(category.id)
                }
                variant="category"
              >
                {category.label}
              </FilterButton>
            ))}
          </div>
        </fieldset>
      )}

      {showCategories && showSources && (
        <div
          className="hidden w-px shrink-0 self-stretch bg-stone-pale sm:block"
          aria-hidden="true"
        />
      )}

      {showSources && (
        <fieldset className="min-w-0">
          <legend className="sr-only">
            Filter reviews by source
          </legend>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={activeSource === 'all'}
              onClick={() => onSourceChange('all')}
              variant="source"
            >
              All
            </FilterButton>

            {sources.map((source) => (
              <FilterButton
                key={source.id}
                active={activeSource === source.id}
                onClick={() => onSourceChange(source.id)}
                variant="source"
                icon={<PlatformIcon source={source.id} />}
              >
                {source.label}
              </FilterButton>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

type FilterButtonProps = {
  readonly active: boolean;
  readonly children: ReactNode;
  readonly icon?: ReactNode;
  readonly variant: 'category' | 'source';
  readonly onClick: () => void;
};

function FilterButton({
  active,
  children,
  icon,
  variant,
  onClick,
}: FilterButtonProps) {
  const activeClasses =
    variant === 'category'
      ? 'border-[#b8975a] bg-[#b8975a] text-[#1a1714]'
      : 'border-[#1a1714] bg-[#1a1714] text-[#faf8f5]';

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-controls="reviews-list"
      onClick={onClick}
      className={`
        flex min-h-11 max-w-full items-center gap-1.5 border px-3.5
        py-2 text-left text-[10px] font-medium uppercase
        tracking-[0.15em] transition-colors duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-gold motion-reduce:transition-none
        ${
          active
            ? activeClasses
            : `
                border-stone-pale text-[#766e68]
                hover:border-gold/50
                hover:text-stone-mid
              `
        }
      `}
    >
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="min-w-0">{children}</span>
    </button>
  );
}