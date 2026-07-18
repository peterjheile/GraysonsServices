"use client";

import { useEffect, useRef } from "react";

import RevealObserver from "../home/RevealObserverClient";

const PROJECT_IMAGES = [
  "/services/Deck1.jpg",
  "/services/Driveway1.jpg",
  "/services/Walkway1.jpg",
];

const PROJECT_STATS = [
  {
    value: "100+",
    label: "Projects Completed",
  },
  {
    value: "15+",
    label: "Years in Business",
  },
  {
    value: "100%",
    label: "Client Satisfaction",
  },
  {
    value: "4",
    label: "Service Categories",
  },
];

export default function ProjectsHero() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imageRef.current) return;

      imageRef.current.style.transform = `translate3d(
        0,
        ${window.scrollY * 0.28}px,
        0
      )`;
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <RevealObserver>
      <section
        className="
          relative flex min-h-[680px] w-full items-end overflow-hidden
          bg-stone-darkest
          h-[90svh] max-h-[920px]
          sm:min-h-[700px]
          md:h-[78svh] md:min-h-[660px]
          lg:h-[72vh] lg:min-h-[580px] lg:max-h-[860px]
        "
      >
        {/* Background image collage */}
        <div
          ref={imageRef}
          className="
            absolute inset-x-0 -top-[15%] -bottom-[15%]
            grid grid-cols-1
            will-change-transform transform-gpu
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {PROJECT_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`
                bg-cover bg-center

                ${index === 1 ? "hidden md:block" : ""}
                ${index === 2 ? "hidden lg:block" : ""}
              `}
              style={{
                backgroundImage: `url("${src}")`,
              }}
            />
          ))}
        </div>

        {/* Image separators */}
        <div className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-2 lg:grid-cols-3">
          <div className="border-r border-white/10" />
          <div className="hidden border-r border-white/10 lg:block" />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-darkest via-stone-darkest/70 to-stone-darkest/35" />

        <div className="absolute inset-0 bg-linear-to-r from-stone-darkest/80 via-stone-darkest/30 to-transparent" />

        {/* Top readability */}
        <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-stone-darkest/80 via-stone-darkest/35 to-transparent" />

        {/* Decorative vertical rule */}
        <div
          className="
            absolute bottom-0 left-12 top-0 hidden w-px
            bg-linear-to-b from-transparent via-gold/25 to-transparent
            lg:block
          "
        />

        {/* Main content */}
        <div
          className="
            relative z-10 mx-auto w-full max-w-(--max-content-width)
            px-6 pb-12
            sm:px-8 sm:pb-16
            md:pb-20
            lg:px-12 lg:pb-24
            xl:pb-28
          "
        >
          {/* Eyebrow */}
          <div
            className="mb-4 flex items-center gap-4"
            style={{
              animation: "hero-word-in 0.8s 0.1s both",
            }}
          >
            <div className="h-px w-8 shrink-0 bg-gold sm:w-10" />

            <span
              className="
                text-[10px] font-medium uppercase tracking-[0.3em]
                text-gold
                sm:text-[11px] sm:tracking-[0.35em]
              "
            >
              Selected Projects
            </span>
          </div>

          {/* Headline */}
          <h1
            className="
              mb-6 max-w-5xl
              font-['Cormorant_Garamond']
              text-[clamp(3.5rem,13vw,6rem)]
              font-light leading-[0.9] text-white
              sm:mb-8
              md:text-[clamp(4.5rem,9vw,6.75rem)]
            "
          >
            <span className="block overflow-hidden">
              <span
                className="inline-block"
                style={{
                  animation: "hero-word-in 1.1s 0.25s both",
                }}
              >
                Our
              </span>{" "}
              <span
                className="inline-block italic text-gold"
                style={{
                  animation: "hero-word-in 1.1s 0.4s both",
                }}
              >
                Portfolio
              </span>
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mb-8 max-w-xl
              text-sm font-light leading-relaxed text-stone-light
              sm:text-base
              md:mb-10 md:text-lg
              lg:mb-12
            "
            style={{
              animation: "hero-word-in 1s 0.65s both",
            }}
          >
            Explore the outdoor spaces we have transformed through thoughtful
            planning, skilled craftsmanship, and materials selected to stand
            the test of time.
          </p>

          {/* Statistics */}
          <div
            className="
              grid max-w-3xl grid-cols-2
              gap-x-6 gap-y-5
              sm:gap-x-10 sm:gap-y-6
              lg:grid-cols-4 lg:gap-x-10
            "
            style={{
              animation: "hero-word-in 1s 0.85s both",
            }}
          >
            {PROJECT_STATS.map((stat) => (
              <div
                key={stat.label}
                className="
                  border-l border-gold/30 pl-4
                  sm:pl-5
                "
              >
                <div
                  className="
                    font-['Cormorant_Garamond']
                    text-3xl font-semibold leading-none text-gold
                    sm:text-4xl
                  "
                >
                  {stat.value}
                </div>

                <div
                  className="
                    mt-2 max-w-28
                    text-[9px] font-medium uppercase leading-relaxed
                    tracking-[0.16em] text-stone-light
                    sm:text-[10px] sm:tracking-[0.2em]
                  "
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop scroll label */}
        <div
          className="
            absolute bottom-8 right-12 z-10 hidden
            items-center gap-4 lg:flex
          "
          style={{
            animation: "hero-word-in 1s 1s both",
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-light">
            Scroll to explore
          </span>

          <div className="h-px w-8 bg-gold" />
        </div>
      </section>
    </RevealObserver>
  );
}