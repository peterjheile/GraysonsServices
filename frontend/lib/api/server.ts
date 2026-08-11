import 'server-only';

import { z } from 'zod';

type ApiFetchOptions = {
  revalidate: number | false;
  tags?: readonly string[];
};

function getApiBaseUrl(): string {
  const apiUrl = process.env.DJANGO_API_URL?.trim().replace(/\/+$/, '');

  if (!apiUrl) {
    throw new Error('DJANGO_API_URL is not configured');
  }

  try {
    new URL(apiUrl);
  } catch {
    throw new Error('DJANGO_API_URL is not a valid URL');
  }

  return apiUrl;
}

function formatValidationIssues(
  issues: readonly {
    path: PropertyKey[];
    message: string;
  }[],
): string {
  return issues
    .map((issue) => {
      const path = issue.path.length
        ? issue.path.map(String).join('.')
        : 'response';

      return `${path}: ${issue.message}`;
    })
    .join('; ');
}

export async function fetchApi<TSchema extends z.ZodType>(
  path: string,
  schema: TSchema,
  {
    revalidate,
    tags = [],
  }: ApiFetchOptions,
): Promise<z.output<TSchema>> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  let response: Response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}${normalizedPath}`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate,
          tags: [...tags],
        },
      },
    );
  } catch (cause) {
    throw new Error(
      `API request failed for ${normalizedPath}`,
      { cause },
    );
  }

  if (!response.ok) {
    throw new ApiHttpError(
      normalizedPath,
      response.status,
      response.statusText,
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch (cause) {
    throw new Error(
      `API returned invalid JSON for ${normalizedPath}`,
      { cause },
    );
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid API response for ${normalizedPath}: ` +
        formatValidationIssues(result.error.issues),
    );
  }

  return result.data;
}


export class ApiHttpError extends Error {
  constructor(
    public readonly path: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(
      `API request failed for ${path}: ` +
        `${status} ${statusText}`,
    );

    this.name = 'ApiHttpError';
  }
}
