import { z } from 'zod';

const requiredTextSchema = z
  .string()
  .trim()
  .min(1);

const optionalTextSchema = z
  .string()
  .trim();

export const jobPostingSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(170)
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Invalid job-posting slug',
  );

export const jobCategorySchema = z.object({
  name: requiredTextSchema.max(100),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(110)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Invalid job-category slug',
    ),
});

export const jobItemSchema = z.object({
  text: requiredTextSchema.max(500),
});

export const jobSenioritySchema = z.enum([
  '',
  'entry',
  'mid-level',
  'senior',
  'lead',
  'manager',
]);

export const employmentTypeSchema = z.enum([
  'full-time',
  'part-time',
  'seasonal',
  'temporary',
  'contract',
  'internship',
]);

export const payUnitSchema = z.enum([
  'hour',
  'day',
  'week',
  'year',
  'project',
]);

const payAmountSchema = z
  .string()
  .regex(
    /^\d{1,8}\.\d{2}$/,
    'Invalid pay amount',
  );

function payAmountToCents(value: string): bigint {
  const [whole, fraction] = value.split('.');

  return BigInt(`${whole}${fraction}`);
}

export const jobPostingSchema = z
  .object({
    slug: jobPostingSlugSchema,
    title: requiredTextSchema.max(150),
    location: requiredTextSchema.max(150),

    category: jobCategorySchema,

    seniority: jobSenioritySchema,
    seniority_label: optionalTextSchema,

    employment_type: employmentTypeSchema,
    employment_type_label: requiredTextSchema,

    is_urgent: z.boolean(),
    posted_at: z.iso.date(),

    pay_min: payAmountSchema.nullable(),
    pay_max: payAmountSchema.nullable(),

    pay_unit: payUnitSchema,
    pay_unit_label: requiredTextSchema,

    description: requiredTextSchema.max(5000),

    responsibilities: z.array(jobItemSchema),
    requirements: z.array(jobItemSchema),
    nice_to_haves: z.array(jobItemSchema),
  })
  .superRefine((job, context) => {
    if (
      job.seniority === '' &&
      job.seniority_label !== ''
    ) {
      context.addIssue({
        code: 'custom',
        path: ['seniority_label'],
        message:
          'A job without seniority must have an empty seniority label',
      });
    }

    if (
      job.seniority !== '' &&
      job.seniority_label === ''
    ) {
      context.addIssue({
        code: 'custom',
        path: ['seniority_label'],
        message:
          'A job with seniority must include a seniority label',
      });
    }

    const hasMinimum = job.pay_min !== null;
    const hasMaximum = job.pay_max !== null;

    if (hasMinimum !== hasMaximum) {
      context.addIssue({
        code: 'custom',
        path: ['pay_max'],
        message:
          'Pay minimum and maximum must both be present or both be null',
      });

      return;
    }

    if (
      job.pay_min !== null &&
      job.pay_max !== null &&
      payAmountToCents(job.pay_max) <
        payAmountToCents(job.pay_min)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['pay_max'],
        message:
          'Maximum pay cannot be below minimum pay',
      });
    }
  });

export const jobPostingsSchema = z.array(
  jobPostingSchema,
);

export type JobPostingSlug = z.infer<
  typeof jobPostingSlugSchema
>;

export type JobCategory = z.infer<
  typeof jobCategorySchema
>;

export type JobItem = z.infer<
  typeof jobItemSchema
>;

export type JobSeniority = z.infer<
  typeof jobSenioritySchema
>;

export type EmploymentType = z.infer<
  typeof employmentTypeSchema
>;

export type PayUnit = z.infer<
  typeof payUnitSchema
>;

export type JobPosting = z.infer<
  typeof jobPostingSchema
>;

export type JobPostings = z.infer<
  typeof jobPostingsSchema
>;

// Presentation shape retained for JobBoard and ApplicationForm.
export type JobListing = {
  id: string;
  slug: JobPostingSlug;
  title: string;
  department: string;
  departmentSlug: string;
  level: string;
  type: string;
  typeValue: EmploymentType;
  location: string;
  posted: string;
  pay: string;
  urgent: boolean;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};