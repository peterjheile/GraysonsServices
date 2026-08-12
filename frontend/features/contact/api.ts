import type { z } from 'zod';

import {
  contactSubmissionInputSchema,
  contactSubmissionSchema,
  jobApplicationInputSchema,
  jobApplicationSchema,
  quoteRequestInputSchema,
  quoteRequestSchema,
  type ContactSubmission,
  type ContactSubmissionInput,
  type JobApplication,
  type JobApplicationInput,
  type QuoteRequest,
  type QuoteRequestInput,
} from './types';

function getPublicApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL
    ?.trim()
    .replace(/\/+$/, '');

  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_DJANGO_API_URL is not configured',
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    throw new Error(
      'NEXT_PUBLIC_DJANGO_API_URL is not a valid URL',
    );
  }

  if (
    parsedUrl.protocol !== 'http:' &&
    parsedUrl.protocol !== 'https:'
  ) {
    throw new Error(
      'NEXT_PUBLIC_DJANGO_API_URL must use HTTP or HTTPS',
    );
  }

  return apiUrl;
}

const DJANGO_API_URL = getPublicApiBaseUrl();

export type FormFieldErrors = Record<string, string[]>;

export class FormSubmissionError extends Error {
  readonly fieldErrors: FormFieldErrors | undefined;

  constructor(
    message: string,
    fieldErrors?: FormFieldErrors,
  ) {
    super(message);

    this.name = 'FormSubmissionError';
    this.fieldErrors = fieldErrors;
  }
}

export class ContactSubmissionError extends FormSubmissionError {
  override name = 'ContactSubmissionError';
}

export class QuoteRequestError extends FormSubmissionError {
  override name = 'QuoteRequestError';
}

export class JobApplicationError extends FormSubmissionError {
  override name = 'JobApplicationError';
}

type SubmissionErrorConstructor = new (
  message: string,
  fieldErrors?: FormFieldErrors,
) => FormSubmissionError;

type SubmissionMessages = {
  network: string;
  failure: string;
  invalidResponse: string;
};

function createZodFieldErrors(
  error: z.ZodError,
): FormFieldErrors {
  const fieldErrors: FormFieldErrors = {};

  for (const issue of error.issues) {
    const firstPathSegment = issue.path[0];
    const field =
      typeof firstPathSegment === 'string'
        ? firstPathSegment
        : 'non_field_errors';

    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return fieldErrors;
}

function parseDjangoFieldErrors(
  data: unknown,
): FormFieldErrors | undefined {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data)
  ) {
    return undefined;
  }

  const fieldErrors: FormFieldErrors = {};

  for (const [field, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      fieldErrors[field] = [value];
      continue;
    }

    if (Array.isArray(value)) {
      const messages = value.filter(
        (item): item is string => typeof item === 'string',
      );

      if (messages.length > 0) {
        fieldErrors[field] = messages;
      }
    }
  }

  return Object.keys(fieldErrors).length > 0
    ? fieldErrors
    : undefined;
}

function getFirstErrorMessage(
  fieldErrors: FormFieldErrors,
  fallbackMessage: string,
): string {
  return (
    fieldErrors.non_field_errors?.[0] ??
    fieldErrors.detail?.[0] ??
    Object.values(fieldErrors)[0]?.[0] ??
    fallbackMessage
  );
}

function validateInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
  ErrorType: SubmissionErrorConstructor,
  fallbackMessage: string,
): T {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const fieldErrors = createZodFieldErrors(result.error);

  throw new ErrorType(
    getFirstErrorMessage(fieldErrors, fallbackMessage),
    fieldErrors,
  );
}

function appendFormFields(
  formData: FormData,
  fields: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) {
      continue;
    }

    formData.append(key, String(value));
  }
}

async function submitToApi<T>(
  endpoint: string,
  request: RequestInit,
  responseSchema: z.ZodType<T>,
  ErrorType: SubmissionErrorConstructor,
  messages: SubmissionMessages,
): Promise<T> {
  const headers = new Headers(request.headers);

  headers.set('Accept', 'application/json');

  let response: Response;

  try {
    response = await fetch(
      `${DJANGO_API_URL}${endpoint}`,
      {
        ...request,
        headers,
        cache: 'no-store',
      },
    );
  } catch (error) {
    console.error(`Unable to reach ${endpoint}:`, error);

    throw new ErrorType(messages.network);
  }

  const data: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const isValidationResponse =
      response.status === 400 || response.status === 422;

    const fieldErrors = isValidationResponse
      ? parseDjangoFieldErrors(data)
      : undefined;

    if (response.status >= 500) {
      console.error(
        `Submission failed for ${endpoint}:`,
        response.status,
      );
    }

    if (response.status === 429) {
      throw new ErrorType(
        'Too many submissions were sent. ' +
          'Please wait a moment and try again.',
      );
    }

    if (response.status === 413) {
      throw new ErrorType(
        'The uploaded files are too large. ' +
          'Please choose smaller files and try again.',
      );
    }

    throw new ErrorType(
      fieldErrors
        ? getFirstErrorMessage(
            fieldErrors,
            messages.failure,
          )
        : messages.failure,
      fieldErrors,
    );
  }

  const result = responseSchema.safeParse(data);

  if (!result.success) {
    console.error(
      `Invalid response from ${endpoint}:`,
      result.error.issues,
    );

    throw new ErrorType(messages.invalidResponse);
  }

  return result.data;
}

export async function submitContactForm(
  input: ContactSubmissionInput,
): Promise<ContactSubmission> {
  const validatedInput = validateInput(
    contactSubmissionInputSchema,
    input,
    ContactSubmissionError,
    'Please check the form and try again.',
  );

  return submitToApi(
    '/api/contact/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedInput),
    },
    contactSubmissionSchema,
    ContactSubmissionError,
    {
      network:
        'We could not send your message. ' +
        'Please try again shortly.',
      failure:
        'We could not send your message. ' +
        'Please try again.',
      invalidResponse:
        'Your message was sent, but the server ' +
        'returned an unexpected response.',
    },
  );
}

export async function submitQuoteRequest(
  input: QuoteRequestInput,
): Promise<QuoteRequest> {
  const validatedInput = validateInput(
    quoteRequestInputSchema,
    input,
    QuoteRequestError,
    'Please check the form and try again.',
  );

  const { photos, ...fields } = validatedInput;
  const formData = new FormData();

  appendFormFields(formData, fields);

  for (const photo of photos) {
    formData.append('photos', photo);
  }

  return submitToApi(
    '/api/contact/quote-request/',
    {
      method: 'POST',
      body: formData,
    },
    quoteRequestSchema,
    QuoteRequestError,
    {
      network:
        'We could not send your request. ' +
        'Please try again shortly.',
      failure:
        'We could not send your request. ' +
        'Please try again.',
      invalidResponse:
        'Your request was received, but the server ' +
        'returned an unexpected response.',
    },
  );
}

export async function submitJobApplication(
  input: JobApplicationInput,
): Promise<JobApplication> {
  const validatedInput = validateInput(
    jobApplicationInputSchema,
    input,
    JobApplicationError,
    'Please check the application and try again.',
  );

  const { resume, ...fields } = validatedInput;
  const formData = new FormData();

  appendFormFields(formData, fields);

  if (resume) {
    formData.append('resume', resume);
  }

  return submitToApi(
    '/api/contact/careers/applications/',
    {
      method: 'POST',
      body: formData,
    },
    jobApplicationSchema,
    JobApplicationError,
    {
      network:
        'We could not submit your application. ' +
        'Please try again shortly.',
      failure:
        'We could not submit your application. ' +
        'Please try again.',
      invalidResponse:
        'Your application was received, but the ' +
        'server returned an unexpected response.',
    },
  );
}