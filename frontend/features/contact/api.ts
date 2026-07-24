import {
  contactSubmissionInputSchema,
  contactSubmissionSchema,
  type ContactSubmission,
  type ContactSubmissionInput,
} from './types';

const DJANGO_API_URL = (
  process.env.NEXT_PUBLIC_DJANGO_API_URL ??
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

type DjangoValidationErrors = Record<
  string,
  string | string[]
>;

export class ContactSubmissionError extends Error {
  fieldErrors?: DjangoValidationErrors;

  constructor(
    message: string,
    fieldErrors?: DjangoValidationErrors
  ) {
    super(message);

    this.name = 'ContactSubmissionError';
    this.fieldErrors = fieldErrors;
  }
}

function getErrorMessage(
  errors: DjangoValidationErrors
): string {
  const firstError = Object.values(errors)[0];

  if (Array.isArray(firstError)) {
    return (
      firstError[0] ??
      'Unable to send your message.'
    );
  }

  if (typeof firstError === 'string') {
    return firstError;
  }

  return 'Unable to send your message.';
}

export async function submitContactForm(
  input: ContactSubmissionInput
): Promise<ContactSubmission> {
  const inputResult =
    contactSubmissionInputSchema.safeParse(input);

  if (!inputResult.success) {
    throw new ContactSubmissionError(
      inputResult.error.issues[0]?.message ??
        'Please check the form and try again.'
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${DJANGO_API_URL}/api/contact/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(inputResult.data),
      }
    );
  } catch (error) {
    console.error(
      'Unable to reach the contact API:',
      error
    );

    throw new ContactSubmissionError(
      'We could not send your message. Please try again shortly.'
    );
  }

  const data: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const fieldErrors =
      data &&
      typeof data === 'object' &&
      !Array.isArray(data)
        ? (data as DjangoValidationErrors)
        : undefined;

    console.error(
      'Contact submission failed:',
      response.status,
      data
    );

    throw new ContactSubmissionError(
      fieldErrors
        ? getErrorMessage(fieldErrors)
        : 'We could not send your message. Please try again.',
      fieldErrors
    );
  }

  const result =
    contactSubmissionSchema.safeParse(data);

  if (!result.success) {
    console.error(
      'Invalid contact submission response:',
      result.error.issues
    );

    throw new ContactSubmissionError(
      'Your message was sent, but the server returned an unexpected response.'
    );
  }

  return result.data;
}