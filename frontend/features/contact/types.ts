import { z } from 'zod';

export const MAX_QUOTE_PHOTOS = 5;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

const allowedPhotoExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.heic',
  '.heif',
]);

const allowedResumeExtensions = new Set([
  '.pdf',
  '.doc',
  '.docx',
]);

function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return '';
  }

  return filename
    .slice(lastDotIndex)
    .toLowerCase();
}

const firstNameSchema = z
  .string()
  .trim()
  .min(1, {
    error: 'First name is required',
  })
  .max(100, {
    error: 'First name is too long',
  });

const lastNameSchema = z
  .string()
  .trim()
  .min(1, {
    error: 'Last name is required',
  })
  .max(100, {
    error: 'Last name is too long',
  });

const emailSchema = z.preprocess(
  (value) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  z
    .email({
      error: 'Enter a valid email address',
    })
    .max(254, {
      error: 'Email address is too long',
    }),
);

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30, {
    error: 'Phone number is too long',
  });

const requiredPhoneSchema = z
  .string()
  .trim()
  .min(1, {
    error: 'Phone number is required',
  })
  .max(30, {
    error: 'Phone number is too long',
  });

const consentSchema = z
  .boolean()
  .refine((value) => value, {
    error:
      'You must agree to be contacted before submitting',
  });

const applicationConsentSchema = z
  .boolean()
  .refine((value) => value, {
    error:
      'You must agree before submitting an application',
  });

const createdAtSchema = z.iso.datetime({
  offset: true,
});

const quoteRequestPhotoSchema = z
  .file({
    error: 'Each photo must be a valid file',
  })
  .superRefine((file, context) => {
    const extension = getFileExtension(file.name);

    if (!allowedPhotoExtensions.has(extension)) {
      context.addIssue({
        code: 'custom',
        message:
          `${file.name}: upload a JPG, PNG, ` +
          'HEIC, or HEIF file',
      });
    }

    if (file.size === 0) {
      context.addIssue({
        code: 'custom',
        message:
          `${file.name}: the photo file is empty`,
      });
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      context.addIssue({
        code: 'custom',
        message:
          `${file.name}: each photo must be ` +
          '10 MB or smaller',
      });
    }
  });

const jobApplicationResumeSchema = z
  .file({
    error: 'The resume must be a valid file',
  })
  .superRefine((file, context) => {
    const extension = getFileExtension(file.name);

    if (!allowedResumeExtensions.has(extension)) {
      context.addIssue({
        code: 'custom',
        message:
          `${file.name}: upload a PDF, DOC, ` +
          'or DOCX resume',
      });
    }

    if (file.size === 0) {
      context.addIssue({
        code: 'custom',
        message:
          `${file.name}: the resume file is empty`,
      });
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      context.addIssue({
        code: 'custom',
        message:
          `${file.name}: the resume must be ` +
          '10 MB or smaller',
      });
    }
  });

export const contactSubmissionInputSchema =
  z.object({
    first_name: firstNameSchema,
    last_name: lastNameSchema,
    email: emailSchema,
    phone: optionalPhoneSchema,

    subject: z
      .string()
      .trim()
      .min(1, {
        error: 'Subject is required',
      })
      .max(200, {
        error: 'Subject is too long',
      }),

    message: z
      .string()
      .trim()
      .min(1, {
        error: 'Message is required',
      })
      .max(5000, {
        error: 'Message is too long',
      }),
  });

export const contactSubmissionSchema =
  contactSubmissionInputSchema.extend({
    created_at: createdAtSchema,
  });

export const quoteRequestInputSchema = z.object({
  first_name: firstNameSchema,
  last_name: lastNameSchema,
  email: emailSchema,
  phone: requiredPhoneSchema,

  address: z
    .string()
    .trim()
    .max(255, {
      error: 'Address is too long',
    }),

  city: z
    .string()
    .trim()
    .max(100, {
      error: 'City is too long',
    }),

  service_type: z
    .string()
    .trim()
    .min(1, {
      error: 'Please select a service type',
    })
    .max(150, {
      error: 'Service type is too long',
    }),

  project_size: z.enum(
    [
      'not-sure',
      'small',
      'medium',
      'large',
      'xl',
    ],
    {
      error: 'Please select a project size',
    },
  ),

  budget: z.enum(
    [
      'Not sure',
      '<$5k',
      '$5–15k',
      '$15–30k',
      '$30–60k',
      '$60k+',
    ],
    {
      error: 'Please select a budget',
    },
  ),

  timeline: z.enum(
    [
      '',
      'ASAP',
      'Within 1 month',
      '1–3 months',
      '3–6 months',
      'This year',
      'Just planning',
      'Not sure yet',
    ],
    {
      error: 'Please select a timeline',
    },
  ),

  description: z
    .string()
    .trim()
    .max(5000, {
      error: 'Project description is too long',
    }),

  heard_about: z.enum(
    [
      '',
      'Google Search',
      'Houzz',
      'Neighbour / Word of Mouth',
      'Facebook / Instagram',
      'Saw our yard sign',
      'Returning customer',
      "Not sure / don't remember",
      'Other',
    ],
    {
      error: 'Please select a referral source',
    },
  ),

  consent: consentSchema,

  photos: z
    .array(quoteRequestPhotoSchema)
    .max(MAX_QUOTE_PHOTOS, {
      error:
        `You can upload up to ` +
        `${MAX_QUOTE_PHOTOS} photos`,
    }),
});

export const quoteRequestSchema =
  quoteRequestInputSchema
    .omit({
      photos: true,
    })
    .extend({
      created_at: createdAtSchema,
    });

export const jobApplicationInputSchema = z.object({
  job_posting: z
    .string()
    .trim()
    .min(1, {
      error: 'Select a job posting',
    })
    .max(170, {
      error: 'Job posting is invalid',
    }),

  first_name: firstNameSchema,
  last_name: lastNameSchema,
  email: emailSchema,
  phone: requiredPhoneSchema,

  city: z
    .string()
    .trim()
    .max(100, {
      error: 'City is too long',
    }),

  years_experience: z.enum(
    [
      'under-1',
      '1-3',
      '4-6',
      '7-10',
      '10-plus',
    ],
    {
      error: 'Select your years of experience',
    },
  ),

  availability: z.enum(
    [
      'immediately',
      'within-1-week',
      'within-2-weeks',
      'within-1-month',
      'over-1-month',
      'flexible',
    ],
    {
      error: 'Select your availability',
    },
  ),

  pay_range_response: z.enum(
    [
      'accept',
      'discuss',
    ],
    {
      error: 'Select a pay-range response',
    },
  ),

  motivation: z
    .string()
    .trim()
    .min(20, {
      error:
        'Please write at least 20 characters ' +
        'about why you want to work with us',
    })
    .max(5000, {
      error: 'Your response is too long',
    }),

  resume: jobApplicationResumeSchema.optional(),

  consent: applicationConsentSchema,
});

export const jobApplicationSchema =
  jobApplicationInputSchema
    .omit({
      resume: true,
    })
    .extend({
      created_at: createdAtSchema,
    });

export type ContactSubmissionInput = z.infer<
  typeof contactSubmissionInputSchema
>;

export type ContactSubmission = z.infer<
  typeof contactSubmissionSchema
>;

export type QuoteRequestInput = z.infer<
  typeof quoteRequestInputSchema
>;

export type QuoteRequest = z.infer<
  typeof quoteRequestSchema
>;

export type JobApplicationInput = z.infer<
  typeof jobApplicationInputSchema
>;

export type JobApplication = z.infer<
  typeof jobApplicationSchema
>;