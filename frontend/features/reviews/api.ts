import "server-only";

import { z } from "zod";

import {
  reviewsSchema,
  type Review,
  type ReviewFilters,
} from "./types";


const DJANGO_API_URL = (
  process.env.DJANGO_API_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const REVIEW_REVALIDATE_SECONDS = 300;


function formatValidationError(
  error: z.ZodError,
): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length
        ? issue.path.join(".")
        : "response";

      return `${path}: ${issue.message}`;
    })
    .join("; ");
}


async function fetchAndValidate<T>(
  path: string,
  schema: z.ZodType<T>,
  cacheTags: string[],
): Promise<T> {
  const response = await fetch(
    `${DJANGO_API_URL}${path}`,
    {
      next: {
        revalidate: REVIEW_REVALIDATE_SECONDS,
        tags: cacheTags,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Reviews API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid Reviews API response: ${formatValidationError(
        result.error,
      )}`,
    );
  }

  return result.data;
}


function createReviewQuery(
  filters?: ReviewFilters,
): string {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();

  if (filters.categorySlug) {
    params.set(
      "category",
      filters.categorySlug,
    );
  }

  if (filters.source) {
    params.set(
      "source",
      filters.source,
    );
  }

  const query = params.toString();

  return query
    ? `?${query}`
    : "";
}


export async function getReviews(
  filters?: ReviewFilters,
): Promise<Review[]> {
  const query = createReviewQuery(filters);

  return fetchAndValidate(
    `/api/reviews/${query}`,
    reviewsSchema,
    [
      "reviews",
      filters?.categorySlug
        ? `reviews-category-${filters.categorySlug}`
        : "all-reviews",
      filters?.source
        ? `reviews-source-${filters.source}`
        : "all-review-sources",
    ],
  );
}


export async function getHomepageReviews(): Promise<
  Review[]
> {
  return fetchAndValidate(
    "/api/reviews/homepage/",
    reviewsSchema,
    [
      "reviews",
      "homepage-reviews",
    ],
  );
}