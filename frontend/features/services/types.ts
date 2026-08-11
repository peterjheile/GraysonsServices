import { z } from 'zod';

import { assetUrlSchema } from '@/lib/api/schemas';

const requiredTextSchema = z.string().trim().min(1);

const namedSlugSchema = z.object({
  name: requiredTextSchema,
  slug: requiredTextSchema,
});

export const serviceNameSchema = namedSlugSchema;

export const serviceNamesSchema = z.array(
  serviceNameSchema,
);

export const serviceCategorySchema = namedSlugSchema;

export const serviceIncludedItemSchema = z.object({
  text: requiredTextSchema,
});

export const serviceSchema = z.object({
  name: requiredTextSchema,
  slug: requiredTextSchema,

  category: serviceCategorySchema,

  subtitle: requiredTextSchema,
  overview: requiredTextSchema,
  process_description: requiredTextSchema,

  primary_image: assetUrlSchema,
  primary_image_alt: requiredTextSchema,

  supporting_image_one: assetUrlSchema,
  supporting_image_one_alt: requiredTextSchema,

  supporting_image_two: assetUrlSchema,
  supporting_image_two_alt: requiredTextSchema,

  included_items: z.array(
    serviceIncludedItemSchema,
  ),
});

export const servicesSchema = z.array(
  serviceSchema,
);

export type ServiceName = z.infer<
  typeof serviceNameSchema
>;

export type ServiceNames = z.infer<
  typeof serviceNamesSchema
>;

export type ServiceCategory = z.infer<
  typeof serviceCategorySchema
>;

export type ServiceIncludedItem = z.infer<
  typeof serviceIncludedItemSchema
>;

export type Service = z.infer<
  typeof serviceSchema
>;

export type Services = z.infer<
  typeof servicesSchema
>;