import Image from 'next/image';
import Link from 'next/link';

import type { Review } from '@/features/reviews/types';

const STAR_COUNT = 5;
const MAX_STAGGER_DELAY_MS = 400;

type TestimonialsProps = {
  readonly testimonials: readonly Review[];
};

type ReviewerAvatarProps = {
  readonly review: Review;
  readonly size: 'small' | 'large';
};

function getStaggerDelay(
  index: number,
  interval: number,
): string {
  return `${Math.min(index * interval, MAX_STAGGER_DELAY_MS)}ms`;
}

function formatReviewSources(
  sourceLabels: readonly string[],
): string {
  if (sourceLabels.length === 0) {
    return 'Client Reviews';
  }

  if (sourceLabels.length === 1) {
    return sourceLabels[0];
  }

  return `${sourceLabels.slice(0, -1).join(', ')} & ${sourceLabels.at(-1)}`;
}

function Stars({ count }: { readonly count: number }) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${count} out of ${STAR_COUNT} stars`}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <svg
          key={index}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          fill={index < count ? 'currentColor' : 'transparent'}
          className="text-gold"
        >
          <path
            d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewerAvatar({
  review,
  size,
}: ReviewerAvatarProps) {
  const isLarge = size === 'large';
  const sizeClasses = isLarge
    ? 'size-10 text-lg'
    : 'size-8 text-base';

  if (review.profile_image_url) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${sizeClasses}`}
      >
        <Image
          src={review.profile_image_url}
          alt=""
          fill
          sizes={isLarge ? '40px' : '32px'}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gold/15 font-['Cormorant_Garamond'] font-semibold text-gold ${sizeClasses}`}
      aria-hidden="true"
    >
      {review.initials}
    </div>
  );
}

export default function Testimonials({
  testimonials,
}: TestimonialsProps) {
  if (testimonials.length === 0) {
    return null;
  }

  const featuredReviews = testimonials.filter(
    (review) => review.is_featured,
  );
  const regularReviews = testimonials.filter(
    (review) => !review.is_featured,
  );
  const averageRating =
    testimonials.reduce(
      (total, review) => total + review.rating,
      0,
    ) / testimonials.length;
  const sourceLabels = Array.from(
    new Set(
      testimonials.map((review) => review.source_label),
    ),
  );
  const sourceText = formatReviewSources(sourceLabels);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 bg-stone-cream py-28 lg:py-40"
    >
      <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <header className="reveal mb-20 text-center">
          <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
            Client Testimonials
          </p>

          <h2
            id="testimonials-heading"
            className="mt-3 font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-stone-darkest"
          >
            What Clients Say
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base font-light text-stone-mid">
            Honest feedback from homeowners who trusted us with
            their properties.
          </p>
        </header>

        {featuredReviews.length > 0 && (
          <div className="mb-6 grid gap-3 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-3">
              {featuredReviews.map((review, index) => (
                <article
                  key={review.id}
                  className="reveal-left relative overflow-hidden bg-stone-darkest p-8 sm:p-10 lg:p-16"
                  style={{
                    transitionDelay: getStaggerDelay(index, 120),
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/3 select-none font-['Cormorant_Garamond'] text-[clamp(320px,40vw,560px)] leading-none text-gold/3"
                  >
                    “
                  </div>

                  <div className="relative z-10">
                    <Stars count={review.rating} />

                    <blockquote className="my-6 font-['Cormorant_Garamond'] text-[clamp(22px,2.5vw,32px)] leading-[1.45] font-light text-white italic lg:mb-8">
                      <p>“{review.quote}”</p>
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <ReviewerAvatar
                        review={review}
                        size="large"
                      />

                      <div>
                        <p className="text-sm font-medium text-white">
                          {review.reviewer_name}
                        </p>

                        {review.role && (
                          <p className="mt-0.5 text-xs text-stone-light">
                            {review.role}
                          </p>
                        )}
                      </div>

                      {review.project && (
                        <div className="ml-auto hidden text-right sm:block">
                          <p className="text-[10px] tracking-[0.15em] text-gold uppercase">
                            Project
                          </p>

                          <Link
                            href={`/projects/${review.project.slug}`}
                            className="mt-0.5 block max-w-44 text-xs text-stone-light transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
                          >
                            {review.project.title}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="reveal-right relative min-h-70 overflow-hidden lg:col-span-2">
              <Image
                src="/services/after.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, calc(100vw - 48px)"
                className="object-cover object-center"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gold/20"
              />

              <div className="absolute right-6 bottom-6 left-6 bg-stone-darkest/85 px-5 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-medium tracking-[0.25em] text-gold uppercase">
                  {averageRating.toFixed(1)}-Star Average
                </p>

                <p className="mt-1 font-['Cormorant_Garamond'] text-xl leading-tight font-semibold text-gold sm:text-2xl">
                  {sourceText}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regularReviews.map((review, index) => (
            <div
              key={review.id}
              className="reveal h-full"
              style={{
                transitionDelay: getStaggerDelay(index, 100),
              }}
            >
              <article className="testimonial-card flex h-full flex-col border border-stone-pale bg-white p-8 motion-reduce:transform-none motion-reduce:transition-none">
                <Stars count={review.rating} />

                <blockquote className="mt-5 mb-6 flex-1 text-sm leading-relaxed font-light text-stone-mid italic">
                  <p>“{review.quote}”</p>
                </blockquote>

                <div className="flex items-center gap-3 border-t border-stone-pale pt-4">
                  <ReviewerAvatar
                    review={review}
                    size="small"
                  />

                  <div>
                    <p className="text-xs font-medium tracking-wide text-stone-darkest">
                      {review.reviewer_name}
                    </p>

                    {review.role && (
                      <p className="mt-0.5 text-[10px] text-stone-light">
                        {review.role}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}

          <div
            className="reveal h-full"
            style={{
              transitionDelay: getStaggerDelay(
                regularReviews.length,
                100,
              ),
            }}
          >
            <div className="flex h-full flex-col justify-between bg-gold p-8">
              <div>
                <h3 className="mb-4 font-['Cormorant_Garamond'] text-4xl leading-tight font-light text-stone-darkest">
                  Ready to Start Your Project?
                </h3>

                <p className="text-sm font-light text-stone-darkest/70">
                  Join satisfied homeowners. Get your free estimate
                  today.
                </p>
              </div>

              <Link
                href="/contact"
                className="group mt-8 inline-flex w-fit items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-stone-darkest uppercase focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-darkest"
              >
                <span>Request a Quote</span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <path
                    d="M2 8h12M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}