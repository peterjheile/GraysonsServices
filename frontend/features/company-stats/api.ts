import 'server-only';

import { cache } from 'react';

import {
  companyStatsSchema,
  type CompanyStats,
} from './types';

export const fetchCompanyStats = cache(
  async (): Promise<CompanyStats> => {
    const apiUrl = process.env.DJANGO_API_URL;

    if (!apiUrl) {
      throw new Error('DJANGO_API_URL is not configured');
    }

    const response = await fetch(`${apiUrl}/api/company-stats/`, {
      next: {
        revalidate: 300,
        tags: ['company-stats'],
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch CompanyStats: ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();
    const result = companyStatsSchema.safeParse(data);

    if (!result.success) {
      console.error(
        'Invalid CompanyStats response:',
        result.error.issues
      );

      throw new Error('Invalid CompanyStats response');
    }

    return result.data;
  }
);

export async function getCompanyStats(): Promise<CompanyStats | null> {
  try {
    return await fetchCompanyStats();
  } catch (error) {
    console.error(
      'Unable to load CompanyStats; hiding company statistics.',
      error
    );

    return null;
  }
}