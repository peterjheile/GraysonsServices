import 'server-only';

import { fetchApi } from '@/lib/api/server';

import {
  reviewsSchema,
  type ReviewFilters,
  type Reviews,
} from './types';

const REVIEWS_REVALIDATE_SECONDS = 300;

function normalizeCategorySlug(
  categorySlug?: string,
): string | undefined {
  return categorySlug?.trim() || undefined;
}

function createReviewQuery(
  filters?: ReviewFilters,
): string {
  const params = new URLSearchParams();

  const categorySlug =
    normalizeCategorySlug(
      filters?.categorySlug,
    );

  if (categorySlug) {
    params.set('category', categorySlug);
  }

  if (filters?.source) {
    params.set('source', filters.source);
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

export function fetchReviews(
  filters?: ReviewFilters,
): Promise<Reviews> {
  const categorySlug =
    normalizeCategorySlug(
      filters?.categorySlug,
    );

  const query = createReviewQuery(filters);

  return fetchApi(
    `/api/reviews/${query}`,
    reviewsSchema,
    {
      revalidate:
        REVIEWS_REVALIDATE_SECONDS,
      tags: [
        'reviews',
        categorySlug
          ? `reviews-category-${categorySlug}`
          : 'all-reviews',
        filters?.source
          ? `reviews-source-${filters.source}`
          : 'all-review-sources',
      ],
    },
  );
}

export function getReviews(
  filters?: ReviewFilters,
): Promise<Reviews> {
  return fetchReviews(filters);
}

export function fetchHomepageReviews():
  Promise<Reviews> {
  return fetchApi(
    '/api/reviews/homepage/',
    reviewsSchema,
    {
      revalidate:
        REVIEWS_REVALIDATE_SECONDS,
      tags: [
        'reviews',
        'homepage-reviews',
      ],
    },
  );
}

export async function getHomepageReviews():
  Promise<Reviews> {
  try {
    return await fetchHomepageReviews();
  } catch (error) {
    console.error(
      'Unable to load homepage reviews; ' +
        'hiding the optional testimonials section.',
      error,
    );

    return [];
  }
}