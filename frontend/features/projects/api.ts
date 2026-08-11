import 'server-only';

import {
  ApiHttpError,
  fetchApi,
} from '@/lib/api/server';

import {
  homepageFeaturedProjectsSchema,
  projectSchema,
  projectsSchema,
  projectSlugSchema,
  type HomepageFeaturedProjects,
  type Project,
  type Projects,
} from './types';

const PROJECTS_REVALIDATE_SECONDS = 300;

function createCategoryQuery(
  categorySlug?: string,
): string {
  const normalizedSlug = categorySlug?.trim();

  if (!normalizedSlug) {
    return '';
  }

  const params = new URLSearchParams({
    category: normalizedSlug,
  });

  return `?${params.toString()}`;
}

export function fetchHomepageFeaturedProjects():
  Promise<HomepageFeaturedProjects> {
  return fetchApi(
    '/api/projects/homepage/',
    homepageFeaturedProjectsSchema,
    {
      revalidate: PROJECTS_REVALIDATE_SECONDS,
      tags: [
        'projects',
        'featured-projects',
        'homepage-featured-projects',
      ],
    },
  );
}

export async function getHomepageFeaturedProjects():
  Promise<HomepageFeaturedProjects> {
  try {
    return await fetchHomepageFeaturedProjects();
  } catch (error) {
    console.error(
      'Unable to load homepage featured projects; ' +
        'hiding the optional gallery section.',
      error,
    );

    return [];
  }
}

export function fetchProjects(
  categorySlug?: string,
): Promise<Projects> {
  const query = createCategoryQuery(categorySlug);

  return fetchApi(
    `/api/projects/${query}`,
    projectsSchema,
    {
      revalidate: PROJECTS_REVALIDATE_SECONDS,
      tags: [
        'projects',
        categorySlug
          ? `projects-category-${categorySlug}`
          : 'all-projects',
      ],
    },
  );
}

export function getProjects(
  categorySlug?: string,
): Promise<Projects> {
  return fetchProjects(categorySlug);
}

export function fetchFeaturedProjects(
  categorySlug?: string,
): Promise<Projects> {
  const query = createCategoryQuery(categorySlug);

  return fetchApi(
    `/api/projects/featured/${query}`,
    projectsSchema,
    {
      revalidate: PROJECTS_REVALIDATE_SECONDS,
      tags: [
        'projects',
        'featured-projects',
        categorySlug
          ? `featured-projects-category-${categorySlug}`
          : 'all-featured-projects',
      ],
    },
  );
}

export function getFeaturedProjects(
  categorySlug?: string,
): Promise<Projects> {
  return fetchFeaturedProjects(categorySlug);
}

export function fetchProjectBySlug(
  slug: string,
): Promise<Project> {
  const normalizedSlug =
    projectSlugSchema.parse(slug);

  const encodedSlug =
    encodeURIComponent(normalizedSlug);

  return fetchApi(
    `/api/projects/${encodedSlug}/`,
    projectSchema,
    {
      revalidate: PROJECTS_REVALIDATE_SECONDS,
      tags: [
        'projects',
        `project-${normalizedSlug}`,
      ],
    },
  );
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  try {
    return await fetchProjectBySlug(slug);
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