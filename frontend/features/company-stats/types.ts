import { z } from 'zod';

export const companyStatsSchema = z.object({
  years_in_business: z.number().int().nonnegative(),
  projects_completed: z.number().int().nonnegative(),
  client_satisfaction: z.number().int().min(0).max(100),
  updated_at: z.iso.datetime({ offset: true }),
});

export type CompanyStats = z.infer<typeof companyStatsSchema>;


export type QuickStat = {
  value: number;
  suffix: string;
  label: string;
};

export type QuickStats = {
  projects_completed: QuickStat;
  client_satisfaction: QuickStat;
  years_in_business: QuickStat;
};