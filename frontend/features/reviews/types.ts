import { z } from 'zod';

import {
  nullableAssetUrlSchema,
} from '@/lib/api/schemas';

const requiredTextSchema = z
  .string()
  .trim()
  .min(1);

const optionalTextSchema = z
  .string()
  .trim();

const nullableRequiredTextSchema =
  requiredTextSchema.nullable();

export const reviewSourceSchema = z.enum([
  'google',
  'facebook',
  'in_person',
]);

export const reviewProjectSchema = z.object({
  id: z.number().int().positive(),
  title: requiredTextSchema,
  slug: requiredTextSchema,
});

export const reviewSchema = z
  .object({
    id: z.number().int().positive(),

    reviewer_name: requiredTextSchema,
    initials: requiredTextSchema,
    role: optionalTextSchema,
    quote: requiredTextSchema,

    rating: z
      .number()
      .int()
      .min(1)
      .max(5),

    source: reviewSourceSchema,
    source_label: requiredTextSchema,

    category: nullableRequiredTextSchema,
    category_slug: nullableRequiredTextSchema,

    project: reviewProjectSchema.nullable(),

    profile_image_url:
      nullableAssetUrlSchema,

    review_month: z
      .number()
      .int()
      .min(1)
      .max(12),

    review_month_name: requiredTextSchema,

    review_year: z
      .number()
      .int()
      .positive(),

    review_date_label: requiredTextSchema,

    show_on_homepage: z.boolean(),
    is_featured: z.boolean(),

    homepage_order: z
      .number()
      .int()
      .nonnegative(),

    display_order: z
      .number()
      .int()
      .nonnegative(),

    updated_at: z.iso.datetime({
      offset: true,
    }),
  })
  .superRefine((review, context) => {
    const hasCategory =
      review.category !== null;

    const hasCategorySlug =
      review.category_slug !== null;

    if (hasCategory !== hasCategorySlug) {
      context.addIssue({
        code: 'custom',
        path: ['category_slug'],
        message:
          'Category and category slug must both be present or both be null',
      });
    }

    if (
      review.is_featured &&
      review.project === null
    ) {
      context.addIssue({
        code: 'custom',
        path: ['project'],
        message:
          'Featured reviews must reference a project',
      });
    }
  });

export const reviewsSchema = z.array(
  reviewSchema,
);

export type ReviewSource = z.infer<
  typeof reviewSourceSchema
>;

export type ReviewProject = z.infer<
  typeof reviewProjectSchema
>;

export type Review = z.infer<
  typeof reviewSchema
>;

export type Reviews = z.infer<
  typeof reviewsSchema
>;

export type ReviewFilters = {
  categorySlug?: string;
  source?: ReviewSource;
};