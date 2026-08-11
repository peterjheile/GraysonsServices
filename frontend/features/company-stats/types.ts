import { z } from 'zod';

const nonnegativeIntegerSchema = z
  .number()
  .int()
  .nonnegative();

export const companyStatsSchema = z.object({
  years_in_business: nonnegativeIntegerSchema,
  projects_completed: nonnegativeIntegerSchema,

  client_satisfaction: nonnegativeIntegerSchema.max(
    100,
  ),

  updated_at: z.iso.datetime({
    offset: true,
  }),
});

export type CompanyStats = z.infer<
  typeof companyStatsSchema
>;

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