'use client';

import { useEffect, type PropsWithChildren } from 'react';

const REVEAL_SELECTOR = [
  '.reveal',
  '.reveal-left',
  '.reveal-right',
  '.reveal-scale',
].join(', ');

let consumerCount = 0;
let stopGlobalObserver: (() => void) | undefined;

function startGlobalObserver(): () => void {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  let intersectionObserver:
    | IntersectionObserver
    | undefined;

  const registerElement = (element: Element) => {
    if (element.classList.contains('visible')) {
      return;
    }

    if (prefersReducedMotion || !intersectionObserver) {
      element.classList.add('visible');
      return;
    }

    intersectionObserver.observe(element);
  };

  const registerTree = (root: ParentNode) => {
    if (
      root instanceof Element &&
      root.matches(REVEAL_SELECTOR)
    ) {
      registerElement(root);
    }

    root
      .querySelectorAll(REVEAL_SELECTOR)
      .forEach(registerElement);
  };

  if (
    !prefersReducedMotion &&
    'IntersectionObserver' in window
  ) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.classList.add('visible');
          intersectionObserver?.unobserve(entry.target);
        }
      },
      {
        // A tiny threshold also works for elements taller
        // than the viewport.
        threshold: 0.01,
        rootMargin: '0px 0px -10% 0px',
      },
    );
  }

  registerTree(document);

  const mutationObserver = new MutationObserver(
    (records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) {
            registerTree(node);
          }
        }
      }
    },
  );

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    mutationObserver.disconnect();
    intersectionObserver?.disconnect();
  };
}

function subscribeToGlobalObserver(): () => void {
  consumerCount += 1;
  stopGlobalObserver ??= startGlobalObserver();

  let subscribed = true;

  return () => {
    if (!subscribed) {
      return;
    }

    subscribed = false;
    consumerCount -= 1;

    if (consumerCount === 0) {
      stopGlobalObserver?.();
      stopGlobalObserver = undefined;
    }
  };
}

/**
 * Mount once in the root layout to manage every reveal element.
 * Children remain supported temporarily so existing section-level
 * usages can be migrated without introducing wrapper elements.
 */
export default function RevealObserver({
  children,
}: PropsWithChildren) {
  useEffect(() => subscribeToGlobalObserver(), []);

  return children ?? null;
}