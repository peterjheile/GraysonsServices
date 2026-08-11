'use client';

import {
  useMemo,
  useState,
} from 'react';

import type {
  Review,
  ReviewSource,
} from '@/features/reviews/types';

import ReviewCard from './ReviewCard';
import ReviewFilters from './ReviewFilters';

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_COUNT = 6;
const MAX_STAGGER_DELAY_MS = 360;

type ReviewsGridProps = {
  readonly reviews: readonly Review[];
};

export default function ReviewsGrid({
  reviews,
}: ReviewsGridProps) {
  const [activeCategory, setActiveCategory] =
    useState('all');

  const [activeSource, setActiveSource] =
    useState<'all' | ReviewSource>('all');

  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_COUNT,
  );

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const categoryMatches =
          activeCategory === 'all' ||
          review.category_slug === activeCategory;

        const sourceMatches =
          activeSource === 'all' ||
          review.source === activeSource;

        return categoryMatches && sourceMatches;
      }),
    [reviews, activeCategory, activeSource],
  );

  const visibleReviews = filteredReviews.slice(
    0,
    visibleCount,
  );

  const remainingCount = Math.max(
    0,
    filteredReviews.length - visibleReviews.length,
  );

  const changeCategory = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const changeSource = (
    source: 'all' | ReviewSource,
  ) => {
    setActiveSource(source);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const clearFilters = () => {
    setActiveCategory('all');
    setActiveSource('all');
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <section
      className="bg-[#faf8f5] py-20 sm:py-24 lg:py-32"
      aria-labelledby="all-reviews-heading"
    >
      <div className="mx-auto w-full max-w-(--max-content-width) px-4 sm:px-6 lg:px-12">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end sm:gap-8">
          <div className="reveal">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#b8975a]">
              All Reviews
            </p>

            <h2
              id="all-reviews-heading"
              className="mt-2 font-['Cormorant_Garamond'] text-[clamp(32px,4vw,52px)] font-light text-[#1a1714]"
            >
              Every Voice,{' '}
              <em className="text-[#b8975a]">
                Unfiltered
              </em>
            </h2>
          </div>

          <p
            className="reveal text-xs font-light tabular-nums text-[#766e68]"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing {visibleReviews.length} of{' '}
            {filteredReviews.length}{' '}
            {filteredReviews.length === 1
              ? 'review'
              : 'reviews'}
          </p>
        </header>

        <ReviewFilters
          reviews={reviews}
          activeCategory={activeCategory}
          activeSource={activeSource}
          onCategoryChange={changeCategory}
          onSourceChange={changeSource}
        />

        {visibleReviews.length > 0 ? (
          <div
            id="reviews-list"
            className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3"
            aria-label="Client reviews"
          >
            {visibleReviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                animationDelay={Math.min(
                  index * 60,
                  MAX_STAGGER_DELAY_MS,
                )}
              />
            ))}
          </div>
        ) : (
          <div
            id="reviews-list"
            className="border border-[#e8e2da] bg-white px-5 py-16 text-center sm:px-8 sm:py-20"
            aria-live="polite"
          >
            <p className="font-['Cormorant_Garamond'] text-3xl font-light text-[#a39890]">
              {reviews.length === 0
                ? 'No reviews have been published yet.'
                : 'No reviews match these filters.'}
            </p>

            {reviews.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-outline mt-6 text-sm"
              >
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        )}

        {remainingCount > 0 && (
          <div className="reveal mt-14 text-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount(
                  (current) =>
                    current + LOAD_MORE_COUNT,
                )
              }
              className="btn-outline"
            >
              <span>
                Load{' '}
                {Math.min(
                  LOAD_MORE_COUNT,
                  remainingCount,
                )}{' '}
                More
              </span>

              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6.5 2v9M3 8l3.5 3.5L10 8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <p className="mt-4 text-[10px] text-[#a39890]">
              {remainingCount}{' '}
              {remainingCount === 1
                ? 'more review'
                : 'more reviews'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}