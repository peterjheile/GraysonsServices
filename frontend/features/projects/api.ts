import 'server-only';

import { z } from 'zod';

import {
  homepageProjectImagesSchema,
  projectCardsSchema,
  projectDetailSchema,
  projectDetailsSchema,
  type HomepageProjectImage,
  type ProjectCard,
  type ProjectDetail,
} from './types';

const DJANGO_API_URL = (
  process.env.DJANGO_API_URL ??
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

const PROJECT_REVALIDATE_SECONDS = 300;

function formatValidationError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length
        ? issue.path.join('.')
        : 'response';

      return `${path}: ${issue.message}`;
    })
    .join('; ');
}

async function fetchAndValidate<T>(
  path: string,
  schema: z.ZodType<T>,
  cacheTags: string[]
): Promise<T> {
  const response = await fetch(
    `${DJANGO_API_URL}${path}`,
    {
      next: {
        revalidate: PROJECT_REVALIDATE_SECONDS,
        tags: cacheTags,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Projects API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(
      `Invalid Projects API response from "${path}":`,
      result.error.issues
    );

    throw new Error(
      `Invalid Projects API response: ${formatValidationError(
        result.error
      )}`
    );
  }

  return result.data;
}

function createCategoryQuery(categorySlug?: string): string {
  if (!categorySlug) {
    return '';
  }

  const params = new URLSearchParams({
    category: categorySlug,
  });

  return `?${params.toString()}`;
}

export async function getHomepageProjectImages(): Promise<
  HomepageProjectImage[]
> {
  try {
    return await fetchAndValidate(
      '/api/projects/homepage/',
      homepageProjectImagesSchema,
      [
        'projects',
        'homepage-project-images',
      ]
    );
  } catch (error) {
    console.error(
      'Unable to load homepage project images; returning an empty list.',
      error
    );

    return [];
  }
}

export async function getProjects(
  categorySlug?: string
): Promise<ProjectCard[]> {
  try {
    const query = createCategoryQuery(categorySlug);

    return await fetchAndValidate(
      `/api/projects/${query}`,
      projectCardsSchema,
      [
        'projects',
        categorySlug
          ? `projects-category-${categorySlug}`
          : 'all-projects',
      ]
    );
  } catch (error) {
    console.error(
      'Unable to load projects; returning an empty list.',
      error
    );

    return [];
  }
}

export async function getFeaturedProjects(
  categorySlug?: string
): Promise<ProjectDetail[]> {
  try {
    const query = createCategoryQuery(categorySlug);

    return await fetchAndValidate(
      `/api/projects/featured/${query}`,
      projectDetailsSchema,
      [
        'projects',
        'featured-projects',
        categorySlug
          ? `featured-projects-category-${categorySlug}`
          : 'all-featured-projects',
      ]
    );
  } catch (error) {
    console.error(
      'Unable to load featured projects; returning an empty list.',
      error
    );

    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | null> {
  try {
    const response = await fetch(
      `${DJANGO_API_URL}/api/projects/${encodeURIComponent(slug)}/`,
      {
        next: {
          revalidate: PROJECT_REVALIDATE_SECONDS,
          tags: [
            'projects',
            `project-${slug}`,
          ],
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Project API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();
    const result = projectDetailSchema.safeParse(data);

    if (!result.success) {
      console.error(
        `Invalid project response for "${slug}":`,
        result.error.issues
      );

      throw new Error(
        `Invalid project response for "${slug}": ${formatValidationError(
          result.error
        )}`
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      `Unable to load project "${slug}"; returning null.`,
      error
    );

    return null;
  }
}