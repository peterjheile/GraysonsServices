import { z } from 'zod';

import { assetUrlSchema } from '@/lib/api/schemas';

const requiredTextSchema = z
  .string()
  .trim()
  .min(1);

const optionalTextSchema = z
  .string()
  .trim();

export const projectSlugSchema =
  requiredTextSchema;

export const projectImageRoleSchema = z.enum([
  'general',
  'before',
  'after',
]);

export const projectImageSchema = z.object({
  id: z.number().int().positive(),

  image_url: assetUrlSchema,
  alt_text: requiredTextSchema,
  caption: optionalTextSchema,

  role: projectImageRoleSchema,
  is_cover: z.boolean(),
  display_order: z
    .number()
    .int()
    .nonnegative(),
});

export const homepageProjectSizeSchema = z.enum([
  'standard',
  'tall',
  'wide',
]);

export const homepageFeaturedProjectSchema =
  z.object({
    slug: projectSlugSchema,
    title: requiredTextSchema,

    category: requiredTextSchema.nullable(),
    category_slug:
      projectSlugSchema.nullable(),

    location: optionalTextSchema,
    homepage_size: homepageProjectSizeSchema,

    cover_image: projectImageSchema.nullable(),
  });

export const projectSchema = z.object({
  id: z.number().int().positive(),

  slug: projectSlugSchema,
  title: requiredTextSchema,
  caption: optionalTextSchema,

  category: requiredTextSchema.nullable(),
  category_slug: projectSlugSchema.nullable(),

  is_featured: z.boolean(),
  is_published: z.boolean(),
  display_order: z
    .number()
    .int()
    .nonnegative(),

  location: optionalTextSchema,
  completion_year: z
    .number()
    .int()
    .positive()
    .nullable(),

  duration: optionalTextSchema,
  area: optionalTextSchema,

  challenge: optionalTextSchema,
  approach: optionalTextSchema,
  result: optionalTextSchema,

  materials: z.array(requiredTextSchema),

  cover_image: projectImageSchema.nullable(),
  images: z.array(projectImageSchema),
});

export const homepageFeaturedProjectsSchema =
  z.array(homepageFeaturedProjectSchema);

export const projectsSchema = z.array(
  projectSchema,
);

export type ProjectSlug = z.infer<
  typeof projectSlugSchema
>;

export type ProjectImageRole = z.infer<
  typeof projectImageRoleSchema
>;

export type ProjectImage = z.infer<
  typeof projectImageSchema
>;

export type HomepageProjectSize = z.infer<
  typeof homepageProjectSizeSchema
>;

export type HomepageFeaturedProject = z.infer<
  typeof homepageFeaturedProjectSchema
>;

export type HomepageFeaturedProjects = z.infer<
  typeof homepageFeaturedProjectsSchema
>;

export type Project = z.infer<
  typeof projectSchema
>;

export type Projects = z.infer<
  typeof projectsSchema
>;