import 'server-only';

import {
  ApiHttpError,
  fetchApi,
} from '@/lib/api/server';

import {
  jobPostingSchema,
  jobPostingsSchema,
  jobPostingSlugSchema,
  type JobPosting,
  type JobPostings,
} from './types';

const CAREERS_REVALIDATE_SECONDS = 300;

export function fetchJobPostings(): Promise<JobPostings> {
  return fetchApi(
    '/api/careers/jobs/',
    jobPostingsSchema,
    {
      revalidate: CAREERS_REVALIDATE_SECONDS,
      tags: [
        'careers',
        'job-postings',
      ],
    },
  );
}

export function getJobPostings(): Promise<JobPostings> {
  return fetchJobPostings();
}

export function fetchJobPostingBySlug(
  slug: string,
): Promise<JobPosting> {
  const normalizedSlug =
    jobPostingSlugSchema.parse(slug);

  const encodedSlug =
    encodeURIComponent(normalizedSlug);

  return fetchApi(
    `/api/careers/jobs/${encodedSlug}/`,
    jobPostingSchema,
    {
      revalidate: CAREERS_REVALIDATE_SECONDS,
      tags: [
        'careers',
        'job-postings',
        `job-posting-${normalizedSlug}`,
      ],
    },
  );
}

export async function getJobPostingBySlug(
  slug: string,
): Promise<JobPosting | null> {
  try {
    return await fetchJobPostingBySlug(slug);
  } catch (error) {
    if (
      error instanceof ApiHttpError &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }
}