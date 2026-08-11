import { z } from 'zod';

import { assetUrlSchema, httpUrlSchema, nullableAssetUrlSchema } from '@/lib/api/schemas';

const optionalTextSchema = z
  .string()
  .nullable()
  .transform((value) => value ?? '');

const optionalEmailSchema = z
  .union([
    z.literal(''),
    z.email(),
    z.null(),
  ])
  .transform((value) => value ?? '');


const optionalExternalUrlSchema = z
  .union([
    z.literal(''),
    httpUrlSchema,
    z.null(),
  ])
  .transform((value) => value ?? '');


export const businessHoursSchema = z.object({
  day: z.number().int().min(1).max(7),
  day_name: z.string().min(1),

  opening_time: z.string().nullable(),
  closing_time: z.string().nullable(),

  is_closed: z.boolean(),
});

export const siteSettingsSchema = z.object({
  business_name: z.string().trim().min(1),
  tagline: optionalTextSchema,

  logo_url: nullableAssetUrlSchema,
  favicon_url: nullableAssetUrlSchema,

  phone: optionalTextSchema,
  email: optionalEmailSchema,

  address_line_1: optionalTextSchema,
  address_line_2: optionalTextSchema,
  city: optionalTextSchema,
  state: optionalTextSchema,
  zip_code: optionalTextSchema,
  service_area: optionalTextSchema,

  facebook_url: optionalExternalUrlSchema,
  instagram_url: optionalExternalUrlSchema,
  google_business_url: optionalExternalUrlSchema,
  linkedin_url: optionalExternalUrlSchema,

  seo_title: optionalTextSchema,
  seo_description: optionalTextSchema,
  social_image_url: nullableAssetUrlSchema,

  business_hours: z.array(businessHoursSchema),

  updated_at: z.iso.datetime({
    offset: true,
  }),
});

export type BusinessHours = z.infer<
  typeof businessHoursSchema
>;

export type SiteSettings = z.infer<
  typeof siteSettingsSchema
>;