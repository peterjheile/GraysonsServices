import { z } from "zod";


export const reviewSourceSchema = z.enum([
  "google",
  "facebook",
  "in_person",
]);


export const reviewProjectSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  slug: z.string().min(1),
});


export const reviewSchema = z.object({
  id: z.number().int().positive(),

  reviewer_name: z.string().min(1),
  initials: z.string(),
  role: z.string(),
  quote: z.string().min(1),

  rating: z.number().int().min(1).max(5),

  source: reviewSourceSchema,
  source_label: z.string().min(1),

  category: z.string().nullable(),
  category_slug: z.string().nullable(),

  project: reviewProjectSchema.nullable(),

  profile_image_url: z.string().min(1).nullable(),

  review_month: z.number().int().min(1).max(12),
  review_month_name: z.string().min(1),
  review_year: z.number().int().min(2015),
  review_date_label: z.string().min(1),

  show_on_homepage: z.boolean(),
  is_featured: z.boolean(),

  homepage_order: z.number().int().nonnegative(),
  display_order: z.number().int().nonnegative(),

  updated_at: z.iso.datetime({
    offset: true,
  }),
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

export type ReviewFilters = {
  categorySlug?: string;
  source?: ReviewSource;
};