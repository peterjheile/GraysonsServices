import Image from 'next/image';

import type { Review } from '@/features/reviews/types';

import { PlatformIcon, Stars } from './ReviewIcons';

type ReviewCardProps = {
  readonly review: Review;
  readonly animationDelay: number;
};

function ReviewerAvatar({
  review,
}: {
  readonly review: Review;
}) {
  if (review.profile_image_url) {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
        <Image
          src={review.profile_image_url}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-darkest"
      aria-hidden="true"
    >
      <span className="font-['Cormorant_Garamond'] text-base font-semibold text-gold">
        {review.initials}
      </span>
    </div>
  );
}

export default function ReviewCard({
  review,
  animationDelay,
}: ReviewCardProps) {
  return (
    <div
      className="reveal-scale break-inside-avoid"
      style={{
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <article
        className="
          flex flex-col border border-stone-pale bg-white p-6
          transition-[border-color,box-shadow,transform] duration-300
          hover:-translate-y-1 hover:border-gold/40
          hover:shadow-[0_12px_36px_rgba(26,23,20,0.09)]
          sm:p-7 motion-reduce:transform-none motion-reduce:transition-none
        "
        aria-labelledby={`reviewer-${review.id}`}
      >
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Stars count={review.rating} />

          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-[#8c827a]">
            <span aria-hidden="true">
              <PlatformIcon source={review.source} />
            </span>
            {review.source_label}
          </div>
        </header>

        {review.category && (
          <p className="mb-5 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#9b7b43]">
            <span
              className="size-1 shrink-0 rounded-full bg-gold"
              aria-hidden="true"
            />
            {review.category}
          </p>
        )}

        <blockquote className="font-['Cormorant_Garamond'] text-[1.125rem] font-light italic leading-[1.6] text-stone-dark sm:text-[1.1875rem]">
          <p>“{review.quote}”</p>
        </blockquote>

        {review.project && (
          <p className="mt-5 border-l-2 border-gold/45 pl-3 text-[10px] leading-relaxed text-[#766e68]">
            <span className="font-medium uppercase tracking-[0.13em] text-[#9b7b43]">
              Project
            </span>{' '}
            <span>{review.project.title}</span>
          </p>
        )}

        <footer className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-[#f0ece6] pt-5">
          <ReviewerAvatar review={review} />

          <div className="min-w-0">
            <p
              id={`reviewer-${review.id}`}
              className="text-xs font-semibold leading-snug tracking-wide text-stone-darkest"
            >
              {review.reviewer_name}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] leading-snug text-[#766e68]">
              {review.role && <span>{review.role}</span>}

              {review.role && (
                <span aria-hidden="true">·</span>
              )}

              <time
                dateTime={`${review.review_year}-${String(review.review_month).padStart(2, '0')}`}
              >
                {review.review_date_label}
              </time>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}