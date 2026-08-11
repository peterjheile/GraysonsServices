'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface ScrollableTabsProps {
  children: ReactNode;
  activeId?: string;
  previousLabel: string;
  nextLabel: string;
  hideMobileScrollbar?: boolean;
  centerWhenFits?: boolean;
  className?: string;
  trackClassName?: string;
}

export default function ScrollableTabs({
  children,
  activeId,
  previousLabel,
  nextLabel,
  hideMobileScrollbar = false,
  centerWhenFits = false,
  className = '',
  trackClassName = '',
}: ScrollableTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // These must be fixed booleans during server rendering
  // and the browser's initial render.
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);

  const updateScrollControls = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const maximumScroll = Math.max(
      0,
      container.scrollWidth - container.clientWidth,
    );

    const hasOverflow = maximumScroll > 2;

    setHasOverflow(hasOverflow);
    setHasMeasured(true);

    setCanScrollLeft(hasOverflow && container.scrollLeft > 2);

    setCanScrollRight(hasOverflow && container.scrollLeft < maximumScroll - 2);
  }, []);

  const scrollTabs = useCallback((direction: 'left' | 'right') => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const distance = container.clientWidth * 0.7;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    container.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container) {
      return;
    }

    updateScrollControls();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollControls();
    });

    resizeObserver.observe(container);

    if (track) {
      resizeObserver.observe(track);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateScrollControls]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !activeId) {
      return;
    }

    const escapedId = CSS.escape(activeId);

    const activeTab = container.querySelector<HTMLElement>(
      `[data-scroll-tab-id="${escapedId}"]`,
    );

    if (!activeTab) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const activeTabRect = activeTab.getBoundingClientRect();

    const targetLeft =
      container.scrollLeft +
      activeTabRect.left -
      containerRect.left -
      container.clientWidth / 2 +
      activeTabRect.width / 2;

    const maximumScroll = Math.max(
      0,
      container.scrollWidth - container.clientWidth,
    );

    const clampedTargetLeft = Math.min(maximumScroll, Math.max(0, targetLeft));

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    container.scrollTo({
      left: clampedTargetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeId]);

  const scrollbarClasses = hideMobileScrollbar
    ? `
        [scrollbar-width:none]
        [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden
      `
    : `
        md:[scrollbar-width:none]
        md:[-ms-overflow-style:none]
        md:[&::-webkit-scrollbar]:hidden
      `;

  return (
    <div
      className={`
        flex min-w-0 items-stretch
        ${className}
      `}
    >
      <ScrollButton
        direction="left"
        label={previousLabel}
        disabled={!canScrollLeft}
        onClick={() => scrollTabs('left')}
      />

      <div
        ref={containerRef}
        onScroll={updateScrollControls}
        className={`
          min-w-0 flex-1 overflow-x-auto
          overscroll-x-contain
          ${scrollbarClasses}
        `}
      >
        <div
          ref={trackRef}
          className={`
            flex w-max min-w-full items-center
            ${
              centerWhenFits && hasMeasured && !hasOverflow
                ? 'justify-center'
                : 'justify-start'
            }
            ${trackClassName}
          `}
        >
          {children}
        </div>
      </div>

      <ScrollButton
        direction="right"
        label={nextLabel}
        disabled={!canScrollRight}
        onClick={() => scrollTabs('right')}
      />
    </div>
  );
}

interface ScrollButtonProps {
  direction: 'left' | 'right';
  label: string;
  disabled: boolean;
  onClick: () => void;
}

function ScrollButton({
  direction,
  label,
  disabled,
  onClick,
}: ScrollButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="
        hidden w-11 shrink-0
        items-center justify-center
        border-x border-stone-pale
        bg-[#faf8f5] text-[#655d57]
        transition-colors duration-150
        hover:bg-[#f2eee8]
        hover:text-[#96783f]
        focus-visible:z-10
        focus-visible:outline-2
        focus-visible:outline-gold
        disabled:pointer-events-none
        disabled:text-[#c8c1b9]
        md:flex
      "
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d={direction === 'left' ? 'm11 4-5 5 5 5' : 'm7 4 5 5-5 5'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}