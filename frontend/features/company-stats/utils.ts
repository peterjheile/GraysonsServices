import type {
  CompanyStats,
  QuickStats,
} from './types';

export function createQuickStats(
  stats: CompanyStats | null
): QuickStats | null {
  if (!stats) {
    return null;
  }

  return {
    projects_completed: {
      value: stats.projects_completed,
      suffix: '+',
      label: 'Projects Completed',
    },

    client_satisfaction: {
      value: stats.client_satisfaction,
      suffix: '%',
      label: 'Client Satisfaction',
    },

    years_in_business: {
      value: stats.years_in_business,
      suffix: '+',
      label: 'Years in Business',
    },
  };
}