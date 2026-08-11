'use client';

import {
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  ContactSubmissionError,
  submitContactForm,
  type FormFieldErrors,
} from '@/features/contact/api';

import type { ContactSubmissionInput } from '@/features/contact/types';

const FIELD_CLASS_NAME =
  'w-full min-w-0 border border-[#3d3632] bg-stone-dark ' +
  'px-4 py-3 text-sm text-white outline-none transition-colors ' +
  'duration-200 placeholder:text-stone-mid hover:border-stone-mid ' +
  'focus:border-gold focus-visible:ring-1 focus-visible:ring-gold ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const CONTACT_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'subject',
  'message',
] as const satisfies readonly (keyof ContactSubmissionInput)[];

type ContactField = (typeof CONTACT_FIELDS)[number];

function isContactField(value: string): value is ContactField {
  return (CONTACT_FIELDS as readonly string[]).includes(value);
}

function getFirstFieldWithError(
  errors: FormFieldErrors,
): ContactField | undefined {
  return CONTACT_FIELDS.find(
    (field) => Boolean(errors[field]?.length),
  );
}

function FieldError({
  id,
  messages,
}: {
  id: string;
  messages?: readonly string[];
}) {
  const message = messages?.[0];

  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-xs leading-relaxed text-red-200">
      {message}
    </p>
  );
}

export default function ContactFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] =
    useState<FormFieldErrors>({});

  const statusRef = useRef<HTMLParagraphElement>(null);
  const submittingRef = useRef(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: ContactSubmissionInput = {
      first_name: String(formData.get('first_name') ?? '').trim(),
      last_name: String(formData.get('last_name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    submittingRef.current = true;
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    setFieldErrors({});

    try {
      await submitContactForm(payload);

      form.reset();

      setSuccessMessage(
        'Thank you! Your message has been sent successfully.',
      );

      requestAnimationFrame(() => {
        statusRef.current?.focus();
      });
    } catch (error) {
      if (error instanceof ContactSubmissionError) {
        const nextFieldErrors = error.fieldErrors ?? {};
        const firstInvalidField =
          getFirstFieldWithError(nextFieldErrors);

        setFieldErrors(nextFieldErrors);
        setErrorMessage(
          firstInvalidField
            ? 'Please correct the highlighted fields and try again.'
            : error.message,
        );

        requestAnimationFrame(() => {
          if (firstInvalidField) {
            const field = form.elements.namedItem(
              firstInvalidField,
            );

            if (field instanceof HTMLElement) {
              field.focus();
              return;
            }
          }

          statusRef.current?.focus();
        });
      } else {
        console.error('Unexpected contact form error:', error);

        setErrorMessage(
          'Something went wrong. Please try again.',
        );

        requestAnimationFrame(() => {
          statusRef.current?.focus();
        });
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target;

    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    if (!isContactField(target.name)) {
      return;
    }

    setFieldErrors((currentErrors) => {
      if (!currentErrors[target.name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[target.name];

      return nextErrors;
    });

    setErrorMessage('');
    setSuccessMessage('');
  };

  const statusMessage = errorMessage || successMessage;

  return (
    <div className="w-full bg-stone-darkest p-5 sm:p-7 lg:p-12">
      <h3
        id="contact-form-heading"
        className="mb-7 font-['Cormorant_Garamond'] text-2xl font-medium text-white"
      >
        Send Us a Message
      </h3>

      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        aria-labelledby="contact-form-heading"
        aria-busy={isSubmitting}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="contact-first-name"
              className="wrap-break-word text-[10px] uppercase tracking-[0.15em] text-stone-light"
            >
              First Name
            </label>

            <input
              id="contact-first-name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              maxLength={100}
              required
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.first_name?.length)}
              aria-describedby={
                fieldErrors.first_name?.length
                  ? 'contact-first-name-error'
                  : undefined
              }
              className={FIELD_CLASS_NAME}
              placeholder="First Name"
            />

            <FieldError
              id="contact-first-name-error"
              messages={fieldErrors.first_name}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="contact-last-name"
              className="wrap-break-word text-[10px] uppercase tracking-[0.15em] text-stone-light"
            >
              Last Name
            </label>

            <input
              id="contact-last-name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              maxLength={100}
              required
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.last_name?.length)}
              aria-describedby={
                fieldErrors.last_name?.length
                  ? 'contact-last-name-error'
                  : undefined
              }
              className={FIELD_CLASS_NAME}
              placeholder="Last Name"
            />

            <FieldError
              id="contact-last-name-error"
              messages={fieldErrors.last_name}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-email"
            className="wrap-break-word text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Email Address
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.email?.length)}
            aria-describedby={
              fieldErrors.email?.length
                ? 'contact-email-error'
                : undefined
            }
            className={FIELD_CLASS_NAME}
            placeholder="your@email.com"
          />

          <FieldError
            id="contact-email-error"
            messages={fieldErrors.email}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-phone"
            className="wrap-break-word text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Phone Number{' '}
            <span className="normal-case tracking-normal">
              (Optional)
            </span>
          </label>

          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.phone?.length)}
            aria-describedby={
              fieldErrors.phone?.length
                ? 'contact-phone-error'
                : undefined
            }
            className={FIELD_CLASS_NAME}
            placeholder="(555) 000-0000"
          />

          <FieldError
            id="contact-phone-error"
            messages={fieldErrors.phone}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-subject"
            className="wrap-break-word text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Subject
          </label>

          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={200}
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.subject?.length)}
            aria-describedby={
              fieldErrors.subject?.length
                ? 'contact-subject-error'
                : undefined
            }
            className={FIELD_CLASS_NAME}
            placeholder="How can we help?"
          />

          <FieldError
            id="contact-subject-error"
            messages={fieldErrors.subject}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-message"
            className="wrap-break-word text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Message
          </label>

          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={5000}
            required
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.message?.length)}
            aria-describedby={
              fieldErrors.message?.length
                ? 'contact-message-error'
                : undefined
            }
            className={`${FIELD_CLASS_NAME} min-h-36 resize-y`}
            placeholder="Ask a question or tell us what’s on your mind..."
          />

          <FieldError
            id="contact-message-error"
            messages={fieldErrors.message}
          />
        </div>

        {statusMessage && (
          <p
            ref={statusRef}
            role={errorMessage ? 'alert' : 'status'}
            tabIndex={-1}
            className={
              errorMessage
                ? 'border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-200 outline-none'
                : 'border border-green-400/30 bg-green-400/10 px-4 py-3 text-center text-sm text-green-200 outline-none'
            }
          >
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary mt-2 w-full justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </span>
        </button>

        <p className="text-center text-[10px] leading-relaxed text-stone-mid">
          We typically respond within 1–2 business days.
        </p>
      </form>
    </div>
  );
}