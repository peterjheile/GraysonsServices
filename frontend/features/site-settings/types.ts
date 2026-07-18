import { z } from 'zod';

export const businessHoursSchema = z.object({
  day: z.number().int().min(1).max(7),
  day_name: z.string(),
  opening_time: z.string(),
  closing_time: z.string(),
  is_closed: z.boolean(),
});

export const siteSettingsSchema = z.object({
  business_name: z.string(),
  tagline: z.string(),

  logo_url: z.url().nullable(),
  favicon_url: z.url().nullable(),

  phone: z.string(),
  email: z.union([z.literal(''), z.email()]),

  address_line_1: z.string(),
  address_line_2: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  service_area: z.string(),

  facebook_url: z.union([z.literal(''), z.url()]),
  instagram_url: z.union([z.literal(''), z.url()]),
  google_business_url: z.union([z.literal(''), z.url()]),
  linkedin_url: z.union([z.literal(''), z.url()]),

  seo_title: z.string(),
  seo_description: z.string(),
  social_image_url: z.url().nullable(),

  business_hours: z.array(businessHoursSchema),
  updated_at: z.iso.datetime({ offset: true }),
});

export type BusinessHours = z.infer<typeof businessHoursSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;