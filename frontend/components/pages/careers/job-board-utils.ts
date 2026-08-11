import type { JobListing, JobPosting } from '@/features/careers/types';

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

const wholeCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const decimalCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const postedDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatCurrency(value: string): string {
  const amount = Number(value);

  return Number.isInteger(amount)
    ? wholeCurrencyFormatter.format(amount)
    : decimalCurrencyFormatter.format(amount);
}

function formatPay(job: JobPosting): string {
  if (job.pay_min === null || job.pay_max === null) {
    return 'Compensation discussed';
  }

  const minimum = formatCurrency(job.pay_min);
  const maximum = formatCurrency(job.pay_max);
  const range = minimum === maximum ? minimum : `${minimum}–${maximum}`;

  return `${range} ${job.pay_unit_label.toLowerCase()}`;
}

function formatPostedDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  return Number.isNaN(date.getTime())
    ? value
    : postedDateFormatter.format(date);
}

export function toJobListing(job: JobPosting): JobListing {
  return {
    id: job.slug,
    slug: job.slug,
    title: job.title,
    department: job.category.name,
    departmentSlug: job.category.slug,
    level: job.seniority_label,
    type: job.employment_type_label,
    typeValue: job.employment_type,
    location: job.location,
    posted: formatPostedDate(job.posted_at),
    pay: formatPay(job),
    urgent: job.is_urgent,
    summary: job.description,
    responsibilities: job.responsibilities.map(({ text }) => text),
    requirements: job.requirements.map(({ text }) => text),
    niceToHave: job.nice_to_haves.map(({ text }) => text),
  };
}

export function getFilterOptions(
  jobs: readonly JobListing[],
  getValue: (job: JobListing) => string,
  getLabel: (job: JobListing) => string,
): FilterOption[] {
  const options = new Map<string, string>();

  for (const job of jobs) {
    options.set(getValue(job), getLabel(job));
  }

  return Array.from(options, ([value, label]) => ({ value, label }));
}