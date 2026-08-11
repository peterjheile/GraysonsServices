import 'server-only';

import { fetchApi } from '@/lib/api/server';

import {
  companyStatsSchema,
  type CompanyStats,
} from './types';

const COMPANY_STATS_REVALIDATE_SECONDS = 300;

export function fetchCompanyStats(): Promise<CompanyStats> {
  return fetchApi(
    '/api/company-stats/',
    companyStatsSchema,
    {
      revalidate: COMPANY_STATS_REVALIDATE_SECONDS,
      tags: ['company-stats'],
    },
  );
}

export async function getCompanyStats():
  Promise<CompanyStats | null> {
  try {
    return await fetchCompanyStats();
  } catch (error) {
    console.error(
      'Unable to load company statistics; ' +
        'hiding the optional statistics.',
      error,
    );

    return null;
  }
}