import 'server-only';

import { cache } from 'react';

import {
  serviceNamesSchema,
  type ServiceNames,
} from './types';

export const fetchServiceNames = cache(
  async (): Promise<ServiceNames> => {
    const apiUrl = process.env.DJANGO_API_URL;

    if (!apiUrl) {
      throw new Error('DJANGO_API_URL is not configured');
    }

    const response = await fetch(
      `${apiUrl}/api/services/names/`,
      {
        next: {
          revalidate: 300,
          tags: ['services'],
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch service names: ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();
    const result = serviceNamesSchema.safeParse(data);

    if (!result.success) {
      console.error(
        'Invalid service names response:',
        result.error.issues
      );

      throw new Error('Invalid service names response');
    }

    return result.data;
  }
);

export async function getServiceNames(): Promise<ServiceNames> {
  try {
    return await fetchServiceNames();
  } catch (error) {
    console.error(
      'Unable to load service names; returning an empty list.',
      error
    );

    return [];
  }
}