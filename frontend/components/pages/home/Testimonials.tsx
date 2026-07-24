import Image from "next/image";
import Link from "next/link";

import type { Review } from "@/features/reviews/types";

import RevealObserver from "./RevealObserverClient";


type TestimonialsProps = {
  testimonials: Review[];
};


function Stars({
  count,
}: {
  count: number;
}) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < count;

        return (
          <svg
            key={index}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
            fill={isFilled ? "#b8975a" : "transparent"}
          >
            <path
              d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z"
              stroke="#b8975a"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}


type ReviewerAvatarProps = {
  review: Review;
  size: "small" | "large";
};


function ReviewerAvatar({
  review,
  size,
}: ReviewerAvatarProps) {
  const isLarge = size === "large";

  const sizeClasses = isLarge
    ? "h-10 w-10 text-lg"
    : "h-8 w-8 text-base";

  if (review.profile_image_url) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${sizeClasses}`}
      >
        <Image
          src={review.profile_image_url}
          alt=""
          fill
          sizes={isLarge ? "40px" : "32px"}
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

  const platformLabels = Array.from(
    new Set(
      testimonials
        .filter((review) => review.source !== "in_person")
        .map((review) => review.source_label),
    ),
  );

  const platformText =
    platformLabels.length > 0
      ? platformLabels.join(" & ")
      : "Client Reviews";


  return (
    <RevealObserver>
      <section
        id="testimonials"
        className="bg-stone-cream py-28 lg:py-40"
      >
        <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
          {/* Header */}
          <div className="reveal mb-20 text-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
              Client Testimonials
            </span>

            <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-stone-darkest">
              What Clients Say
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base font-light text-stone-mid">
              Honest feedback from homeowners who trusted us with
              their properties.
            </p>
          </div>

          {/* Featured reviews */}
          {featuredReviews.length > 0 && (
            <div className="mb-6 grid gap-3 lg:grid-cols-5">
              <div className="space-y-3 lg:col-span-3">
                {featuredReviews.map((review, index) => (
                  <article
                    key={review.id}
                    className="reveal-left relative overflow-hidden bg-stone-darkest p-10 lg:p-16"
                    style={{
                      transitionDelay: `${index * 120}ms`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/3 select-none font-['Cormorant_Garamond'] text-[clamp(320px,40vw,560px)] leading-none text-gold/[0.03]"
                      aria-hidden="true"
                    >
                      “
                    </div>

                    <div className="relative z-10">
                      <Stars count={review.rating} />

                      <blockquote className="my-6 font-['Cormorant_Garamond'] text-[clamp(22px,2.5vw,32px)] font-light italic leading-[1.45] text-white lg:mb-8">
                        “{review.quote}”
                      </blockquote>

                      <div className="flex items-center gap-4">
                        <ReviewerAvatar
                          review={review}
                          size="large"
                        />

                        <div>
                          <div className="text-sm font-medium text-white">
                            {review.reviewer_name}
                          </div>

                          {review.role && (
                            <div className="mt-0.5 text-xs text-stone-light">
                              {review.role}
                            </div>
                          )}
                        </div>

                        {review.project && (
                          <div className="ml-auto hidden text-right sm:block">
                            <div className="text-[10px] uppercase tracking-[0.15em] text-gold">
                              Project
                            </div>

                            <Link
                              href={`/projects/${review.project.slug}`}
                              className="mt-0.5 block max-w-44 text-xs text-stone-light transition-colors hover:text-white"
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

              {/* Decorative side image */}
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

                <div className="absolute bottom-6 left-6 bg-stone-darkest/85 px-5 py-3 backdrop-blur-sm">
                  <div className="text-[10px] font-medium tracking-[0.25em] text-gold uppercase">
                    {averageRating.toFixed(1)}-Star Average
                  </div>

                  <div className="font-['Cormorant_Garamond'] text-2xl font-semibold text-gold">
                    {platformText}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular review cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regularReviews.map((review, index) => (
              <article
                key={review.id}
                className="testimonial-card reveal border border-stone-pale bg-white p-8"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <Stars count={review.rating} />

                <blockquote className="mb-6 mt-5 text-sm font-light italic leading-relaxed text-stone-mid">
                  “{review.quote}”
                </blockquote>

                <div className="flex items-center gap-3 border-t border-stone-pale pt-4">
                  <ReviewerAvatar
                    review={review}
                    size="small"
                  />

                  <div>
                    <div className="text-xs font-medium tracking-wide text-stone-darkest">
                      {review.reviewer_name}
                    </div>

                    {review.role && (
                      <div className="mt-0.5 text-[10px] text-stone-light">
                        {review.role}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* CTA card */}
            <div
              className="reveal flex flex-col justify-between bg-gold p-8"
              style={{
                transitionDelay: `${regularReviews.length * 100}ms`,
              }}
            >
              <div>
                <h3 className="mb-4 font-['Cormorant_Garamond'] text-4xl leading-tight font-light text-stone-darkest">
                  Ready to Start Your Project?
                </h3>

                <p className="text-sm font-light text-stone-darkest/70">
                  Join satisfied homeowners. Get your free estimate today.
                </p>
              </div>

              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-stone-darkest uppercase"
              >
                <span>Request a Quote</span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
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
        
      </section>
    </RevealObserver>
  );
}