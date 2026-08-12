'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';

import ScrollableTabs from '@/components/ui/scrollable-tabs';

import type { ServiceName } from '@/features/services/types';

interface ServicesNavProps {
  services: readonly ServiceName[];
}

const SERVICE_ACTIVATION_OFFSET = 32;

export default function ServicesNav({ services }: ServicesNavProps) {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug ?? '');

  const navRef = useRef<HTMLElement>(null);
  const clickedSlugRef = useRef<string | null>(null);
  const scrollEndCleanupRef = useRef<(() => void) | null>(null);

  const updateActiveService = useCallback(() => {
    if (clickedSlugRef.current) {
      return;
    }

    const sections = services
      .map(({ slug }) => document.getElementById(slug))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0 || !navRef.current) {
      return;
    }

  const activationLine =
    navRef.current.getBoundingClientRect().bottom + SERVICE_ACTIVATION_OFFSET;

    let nextSlug = sections[0].id;

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= activationLine) {
        nextSlug = section.id;
      } else {
        break;
      }
    }

    setActiveSlug((currentSlug) =>
      currentSlug === nextSlug ? currentSlug : nextSlug,
    );
  }, [services]);

  useEffect(() => {
    let animationFrame: number | null = null;

    const scheduleUpdate = () => {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        updateActiveService();
      });
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, {
      passive: true,
    });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [updateActiveService]);

  useEffect(() => {
    return () => {
      scrollEndCleanupRef.current?.();
    };
  }, []);

  function releaseClickedServiceAfterScroll(slug: string) {
    scrollEndCleanupRef.current?.();

    let timeoutId = window.setTimeout(finish, 180);

    function finish() {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);

      if (clickedSlugRef.current === slug) {
        clickedSlugRef.current = null;
      }

      scrollEndCleanupRef.current = null;
      updateActiveService();
    }

    function handleScroll() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(finish, 180);
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    scrollEndCleanupRef.current = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }

  function handleServiceClick(
    event: MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) {
    const section = document.getElementById(slug);

    if (!section) {
      return;
    }

    event.preventDefault();

    clickedSlugRef.current = slug;
    setActiveSlug(slug);

    history.replaceState(null, '', `#${slug}`);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    section.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    if (prefersReducedMotion) {
      clickedSlugRef.current = null;
      updateActiveService();
      return;
    }

    releaseClickedServiceAfterScroll(slug);
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      aria-label="Service navigation"
      className="
        sticky top-16 z-30 w-full
        border-y border-stone-pale
        bg-white/97
        shadow-[0_2px_12px_rgb(26_23_20/0.05)]
        backdrop-blur-md
        md:top-24
      "
    >
      <ScrollableTabs
        activeId={activeSlug}
        previousLabel="View previous services"
        nextLabel="View more services"
        className="
          mx-auto w-full
          max-w-(--max-content-width)
          px-3 sm:px-6 lg:px-12
        "
        trackClassName="
          gap-2 py-3
          md:gap-0 md:py-0
        "
        centerWhenFits
      >
        {services.map((service) => {
          const isActive = activeSlug === service.slug;

          return (
            <a
              key={service.slug}
              href={`#${service.slug}`}
              data-scroll-tab-id={service.slug}
              aria-current={isActive ? 'location' : undefined}
              onClick={(event) => handleServiceClick(event, service.slug)}
              className={`
                shrink-0 whitespace-nowrap
                rounded-md border
                px-4 py-2.5
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
              {service.name}
            </a>
          );
        })}
      </ScrollableTabs>
    </nav>
  );
}