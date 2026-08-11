import type {
  Review,
  ReviewSource,
} from '@/features/reviews/types';

const STAR_COUNT = 5;
const SOURCE_ORDER: Readonly<Record<ReviewSource, number>> = {
  google: 0,
  facebook: 1,
  in_person: 2,
};

type PlatformRatingsProps = {
  readonly reviews: readonly Review[];
};

type SourceSummary = Readonly<{
  source: ReviewSource;
  label: string;
  count: number;
  rating: number;
}>;

type RatingBreakdown = Readonly<{
  stars: number;
  count: number;
  percentage: number;
}>;

function formatReviewCount(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? 'review' : 'reviews'}`;
}

function StarIcon({
  className = 'size-4',
}: {
  readonly className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 1l1.5 3.1 3.5.5L8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
    </svg>
  );
}

function Stars({
  rating,
  label,
}: {
  readonly rating: number;
  readonly label?: string;
}) {
  const percentage = Math.max(
    0,
    Math.min(100, (rating / STAR_COUNT) * 100),
  );

  return (
    <div
      className="relative inline-flex"
      role="img"
      aria-label={
        label ?? `${rating.toFixed(1)} out of ${STAR_COUNT} stars`
      }
    >
      <div
        className="flex gap-1 text-[#ded8d0]"
        aria-hidden="true"
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <StarIcon key={index} />
        ))}
      </div>

      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${percentage}%` }}
        aria-hidden="true"
      >
        <div className="flex w-max gap-1 text-[#b8975a]">
          {Array.from({ length: STAR_COUNT }, (_, index) => (
            <StarIcon key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function calculateAverage(reviews: readonly Review[]): number {
  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );

  return total / reviews.length;
}

function createSourceSummaries(
  reviews: readonly Review[],
): readonly SourceSummary[] {
  const summaries = new Map<
    ReviewSource,
    {
      label: string;
      count: number;
      ratingTotal: number;
    }
  >();

  for (const review of reviews) {
    const existing = summaries.get(review.source);

    if (existing) {
      existing.count += 1;
      existing.ratingTotal += review.rating;
      continue;
    }

    summaries.set(review.source, {
      label: review.source_label,
      count: 1,
      ratingTotal: review.rating,
    });
  }

  return Array.from(summaries.entries())
    .map(([source, summary]) => ({
      source,
      label: summary.label,
      count: summary.count,
      rating: summary.ratingTotal / summary.count,
    }))
    .sort(
      (first, second) =>
        SOURCE_ORDER[first.source] - SOURCE_ORDER[second.source],
    );
}

function createRatingBreakdown(
  reviews: readonly Review[],
): readonly RatingBreakdown[] {
  const ratingCounts = new Map<number, number>();

  for (const review of reviews) {
    ratingCounts.set(
      review.rating,
      (ratingCounts.get(review.rating) ?? 0) + 1,
    );
  }

  return [5, 4, 3, 2, 1].map((stars) => {
    const count = ratingCounts.get(stars) ?? 0;

    return {
      stars,
      count,
      percentage: Math.round((count / reviews.length) * 100),
    };
  });
}

export default function PlatformRatings({
  reviews,
}: PlatformRatingsProps) {
  if (reviews.length === 0) {
    return null;
  }

  const overallRating = calculateAverage(reviews);
  const sources = createSourceSummaries(reviews);
  const breakdown = createRatingBreakdown(reviews);

  return (
    <section
      className="border-b border-[#e8e2da] bg-[#faf8f5] py-16 sm:py-20 lg:py-24"
      aria-labelledby="ratings-heading"
    >
      <div className="mx-auto w-full max-w-(--max-content-width) px-4 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.35fr)] lg:items-center lg:gap-16">
          <div className="reveal-left min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#9b7b43] sm:text-[11px]">
              Client feedback
            </p>

            <h2
              id="ratings-heading"
              className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2.25rem,3.5vw,3.25rem)] font-light leading-[1.05] text-[#1a1714]"
            >
              Ratings at a Glance
            </h2>

            <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-3">
              <span className="font-['Cormorant_Garamond'] text-7xl font-light leading-none tabular-nums text-[#1a1714] sm:text-[5.25rem]">
                {overallRating.toFixed(1)}
              </span>

              <div className="pb-1 sm:pb-2">
                <Stars
                  rating={overallRating}
                  label={`Overall rating: ${overallRating.toFixed(1)} out of ${STAR_COUNT} stars`}
                />

                <p className="mt-2 text-xs text-[#766e68]">
                  {formatReviewCount(reviews.length)} published
                </p>
              </div>
            </div>

            <div
              className="mt-6 space-y-2.5"
              aria-label="Published review rating distribution"
            >
              {breakdown.map(({ stars, count, percentage }) => (
                <div
                  key={stars}
                  className="grid grid-cols-[1rem_0.75rem_minmax(0,1fr)_2.5rem] items-center gap-2.5"
                  aria-label={`${stars} stars: ${formatReviewCount(count)}, ${percentage}%`}
                >
                  <span className="text-right text-xs tabular-nums text-[#766e68]">
                    {stars}
                  </span>

                  <StarIcon className="size-3 text-[#b8975a]" />

                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-[#e8e2da]"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full bg-[#b8975a]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-right text-xs tabular-nums text-[#766e68]">
                    {percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="sr-only">Published ratings by review source</h3>

            <div
              className={`grid gap-4 ${
                sources.length === 1 ? 'max-w-xl' : ''
              }`}
              aria-label="Published ratings by review source"
            >
              {sources.map((source, index) => (
                <div
                  key={source.source}
                  className="reveal"
                  style={{
                    transitionDelay: `${Math.min(index * 100, 200)}ms`,
                  }}
                >
                  <article className="group w-full min-w-0 border border-[#e8e2da] bg-white/65 px-5 py-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#b8975a]/50 hover:shadow-[0_14px_35px_rgba(26,23,20,0.06)] motion-reduce:transform-none motion-reduce:transition-none sm:px-6 sm:py-6">
                    <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                      <div className="min-w-0">
                        <p className="break-words text-[10px] font-semibold uppercase tracking-[0.25em] text-[#766e68]">
                          {source.label}
                        </p>

                        <p className="mt-2 text-xs leading-relaxed text-[#766e68]">
                          {formatReviewCount(source.count)} published
                        </p>
                      </div>

                      <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-2 sm:justify-end sm:border-l sm:border-[#e8e2da] sm:pl-6">
                        <p className="font-['Cormorant_Garamond'] text-5xl font-light leading-[0.8] tabular-nums text-[#1a1714] transition-colors duration-300 group-hover:text-[#9b7b43] motion-reduce:transition-none">
                          {source.rating.toFixed(1)}
                        </p>

                        <div className="pb-0.5">
                          <Stars
                            rating={source.rating}
                            label={`${source.label}: ${source.rating.toFixed(1)} out of ${STAR_COUNT} stars`}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}