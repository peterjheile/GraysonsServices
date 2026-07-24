import { z } from 'zod';

export const contactSubmissionInputSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name is too long'),

  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long'),

  email: z.preprocess(
    (value) =>
      typeof value === 'string'
        ? value.trim()
        : value,
    z
      .email('Enter a valid email address')
      .max(254, 'Email address is too long')
  ),

  phone: z
    .string()
    .trim()
    .max(30, 'Phone number is too long'),

  subject: z
    .string()
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long'),

  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(5000, 'Message is too long'),
});

export const contactSubmissionSchema =
  contactSubmissionInputSchema.extend({
    created_at: z.iso.datetime({
      offset: true,
    }),
  });

export type ContactSubmissionInput = z.infer<
  typeof contactSubmissionInputSchema
>;

export type ContactSubmission = z.infer<
  typeof contactSubmissionSchema
>;