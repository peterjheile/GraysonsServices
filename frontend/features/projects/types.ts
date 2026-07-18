import { z } from "zod";


export const projectImageTypeSchema = z.enum([
  "before",
  "after",
  "process",
  "finished",
  "detail",
]);

export const homepageImageSizeSchema = z.enum([
  "standard",
  "tall",
  "wide",
]);


export const projectReferenceSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  category_slug: z.string().min(1),
  location: z.string(),
});


export const homepageProjectImageSchema = z.object({
  id: z.number().int().positive(),

  image_url: z.string().min(1),
  alt_text: z.string().min(1),
  caption: z.string(),

  image_type: projectImageTypeSchema,
  is_cover: z.boolean(),

  show_on_homepage: z.boolean(),
  homepage_order: z.number().int().nonnegative(),
  homepage_size: homepageImageSizeSchema,

  display_order: z.number().int().nonnegative(),

  project: projectReferenceSchema,
});


export const projectCardImageSchema = z.object({
  id: z.number().int().positive(),
  image_url: z.string().min(1),
  alt_text: z.string().min(1),
});


export const projectCardSchema = z.object({
  id: z.number().int().positive(),

  title: z.string().min(1),
  slug: z.string().min(1),

  category: z.string().min(1),
  category_slug: z.string().min(1),

  location: z.string(),
  completion_year: z.number().int().positive().nullable(),

  short_description: z.string(),

  is_featured: z.boolean(),
  featured_order: z.number().int().nonnegative(),
  display_order: z.number().int().nonnegative(),

  cover_image: projectCardImageSchema.nullable(),
});


export const projectImageSchema = z.object({
  id: z.number().int().positive(),

  image_url: z.string().min(1),
  alt_text: z.string().min(1),
  caption: z.string(),

  image_type: projectImageTypeSchema,
  is_cover: z.boolean(),
  display_order: z.number().int().nonnegative(),
});


export const projectDetailSchema = z.object({
  id: z.number().int().positive(),

  title: z.string().min(1),
  slug: z.string().min(1),

  category: z.string().min(1),
  category_slug: z.string().min(1),

  location: z.string(),
  completion_year: z.number().int().positive().nullable(),

  short_description: z.string(),

  duration: z.string(),
  area: z.string(),

  challenge: z.string(),
  approach: z.string(),
  result: z.string(),

  materials: z.array(z.string()),

  is_featured: z.boolean(),
  featured_order: z.number().int().nonnegative(),
  display_order: z.number().int().nonnegative(),

  images: z.array(projectImageSchema),

  updated_at: z.iso.datetime({
    offset: true,
  }),
});


export const homepageProjectImagesSchema = z.array(
  homepageProjectImageSchema,
);

export const projectCardsSchema = z.array(
  projectCardSchema,
);

export const projectDetailsSchema = z.array(
  projectDetailSchema,
);


export type ProjectImageType = z.infer<
  typeof projectImageTypeSchema
>;

export type HomepageImageSize = z.infer<
  typeof homepageImageSizeSchema
>;

export type ProjectReference = z.infer<
  typeof projectReferenceSchema
>;

export type HomepageProjectImage = z.infer<
  typeof homepageProjectImageSchema
>;

export type ProjectCardImage = z.infer<
  typeof projectCardImageSchema
>;

export type ProjectCard = z.infer<
  typeof projectCardSchema
>;

export type ProjectImage = z.infer<
  typeof projectImageSchema
>;

export type ProjectDetail = z.infer<
  typeof projectDetailSchema
>;