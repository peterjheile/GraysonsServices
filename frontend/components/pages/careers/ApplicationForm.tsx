'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';

import type { JobListing } from '@/features/careers/types';
import {
  JobApplicationError,
  submitJobApplication,
} from '@/features/contact/api';
import type { JobApplicationInput } from '@/features/contact/types';

const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const ALLOWED_RESUME_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

const inputCls =
  'bg-[#f5f1eb] border border-[#e8e2da] text-[#1a1714] text-sm px-4 py-3.5 outline-none focus:border-[#b8975a] transition-colors duration-200 placeholder:text-[#c5bdb5] w-full';

const selectCls =
  'bg-[#f5f1eb] border border-[#e8e2da] text-[#1a1714] text-sm px-4 py-3.5 outline-none focus:border-[#b8975a] transition-colors duration-200 appearance-none w-full cursor-pointer';

type Experience = JobApplicationInput['years_experience'];
type Availability = JobApplicationInput['availability'];
type PayRangeResponse = JobApplicationInput['pay_range_response'];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  experience: Experience | '';
  availability: Availability | '';
  salaryOk: PayRangeResponse | '';
  whyUs: string;
  resumeFile: File | null;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type DjangoFieldErrors = Record<string, string | string[]>;

interface ApplicationFormProps {
  job: JobListing;
  onClose: () => void;
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  experience: '',
  availability: '',
  salaryOk: '',
  whyUs: '',
  resumeFile: null,
  consent: false,
};

const EXPERIENCE_OPTIONS = [
  { value: 'under-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1–3 years' },
  { value: '4-6', label: '4–6 years' },
  { value: '7-10', label: '7–10 years' },
  { value: '10-plus', label: '10+ years' },
] satisfies ReadonlyArray<{
  value: Experience;
  label: string;
}>;

const AVAILABILITY_OPTIONS = [
  { value: 'immediately', label: 'Immediately' },
  { value: 'within-1-week', label: 'Within 1 week' },
  { value: 'within-2-weeks', label: 'Within 2 weeks' },
  { value: 'within-1-month', label: 'Within 1 month' },
  { value: 'over-1-month', label: 'More than 1 month' },
  { value: 'flexible', label: 'Flexible' },
] satisfies ReadonlyArray<{
  value: Availability;
  label: string;
}>;

const PAY_RANGE_OPTIONS = [
  { value: 'accept', label: 'Yes, this works for me' },
  { value: 'discuss', label: "I'd like to discuss" },
] satisfies ReadonlyArray<{
  value: PayRangeResponse;
  label: string;
}>;

const API_FIELD_TO_FORM_FIELD = {
  first_name: 'firstName',
  last_name: 'lastName',
  email: 'email',
  phone: 'phone',
  city: 'city',
  years_experience: 'experience',
  availability: 'availability',
  pay_range_response: 'salaryOk',
  motivation: 'whyUs',
  resume: 'resumeFile',
  consent: 'consent',
} as const satisfies Record<string, keyof FormState>;

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]">
        {label}
        {required && <span className="ml-0.5 text-[#b8975a]">*</span>}
      </label>
      {children}
      {error && (
        <span className="mt-0.5 text-[10px] text-red-500">{error}</span>
      )}
    </div>
  );
}

function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return '';
  }

  return filename.slice(lastDotIndex).toLowerCase();
}

function getFirstError(value: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function mapApiErrors(fieldErrors: DjangoFieldErrors): {
  formErrors: FormErrors;
  generalError?: string;
} {
  const formErrors: FormErrors = {};
  let generalError: string | undefined;

  Object.entries(fieldErrors).forEach(([apiField, value]) => {
    const message = getFirstError(value);

    if (!message) {
      return;
    }

    const formField =
      API_FIELD_TO_FORM_FIELD[apiField as keyof typeof API_FIELD_TO_FORM_FIELD];

    if (formField) {
      formErrors[formField] = message;
      return;
    }

    generalError ??= message;
  });

  return {
    formErrors,
    generalError,
  };
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const city = form.city.trim();
  const motivation = form.whyUs.trim();

  if (!firstName) {
    errors.firstName = 'Required';
  } else if (firstName.length > 100) {
    errors.firstName = 'First name is too long';
  }

  if (!lastName) {
    errors.lastName = 'Required';
  } else if (lastName.length > 100) {
    errors.lastName = 'Last name is too long';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email';
  } else if (email.length > 254) {
    errors.email = 'Email address is too long';
  }

  if (!phone) {
    errors.phone = 'Required';
  } else if (phone.length > 30) {
    errors.phone = 'Phone number is too long';
  }

  if (city.length > 100) {
    errors.city = 'City or town is too long';
  }

  if (!form.experience) {
    errors.experience = 'Please select your experience level';
  }

  if (!form.availability) {
    errors.availability = 'Please select your availability';
  }

  if (!form.salaryOk) {
    errors.salaryOk = 'Please select a pay-range response';
  }

  if (motivation.length < 20) {
    errors.whyUs = 'Please write at least 20 characters';
  } else if (motivation.length > 5000) {
    errors.whyUs = 'Your response is too long';
  }

  if (form.resumeFile) {
    const extension = getFileExtension(form.resumeFile.name);

    if (!ALLOWED_RESUME_EXTENSIONS.has(extension)) {
      errors.resumeFile = 'Upload a PDF, DOC, or DOCX resume';
    } else if (form.resumeFile.size === 0) {
      errors.resumeFile = 'The resume file is empty';
    } else if (form.resumeFile.size > MAX_RESUME_SIZE) {
      errors.resumeFile = 'The resume must be 10 MB or smaller';
    }
  }

  if (!form.consent) {
    errors.consent = 'Required to continue';
  }

  return errors;
}

export default function ApplicationForm({
  job,
  onClose,
}: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionError, setSubmissionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const resumeInputId = `resume-${job.slug}`;

  const updateField = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
    setSubmissionError('');
  };

  const removeResume = () => {
    updateField('resumeFile', null);

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmissionError('');

    const nextErrors = validateForm(form);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!form.experience || !form.availability || !form.salaryOk) {
      return;
    }

    const payload: JobApplicationInput = {
      job_posting: job.slug,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      years_experience: form.experience,
      availability: form.availability,
      pay_range_response: form.salaryOk,
      motivation: form.whyUs.trim(),
      resume: form.resumeFile ?? undefined,
      consent: form.consent,
    };

    setSubmitting(true);

    try {
      await submitJobApplication(payload);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof JobApplicationError) {
        if (error.fieldErrors) {
          const { formErrors, generalError } = mapApiErrors(error.fieldErrors);
          const hasFieldErrors = Object.keys(formErrors).length > 0;

          setErrors(formErrors);
          setSubmissionError(
            generalError ?? (hasFieldErrors ? '' : error.message),
          );
        } else {
          setSubmissionError(error.message);
        }

        return;
      }

      console.error('Unexpected job application error:', error);
      setSubmissionError(
        'We could not submit your application. Please try again shortly.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center px-6 py-14 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#b8975a]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 12l5 5 11-10"
              stroke="#b8975a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#b8975a]">
          Application Received
        </span>
        <h3 className="mb-3 font-['Cormorant_Garamond'] text-3xl font-light text-[#1a1714]">
          Thanks, <em className="italic text-[#b8975a]">{form.firstName}.</em>
        </h3>
        <p className="mb-8 max-w-sm text-sm font-light leading-relaxed text-[#5c5550]">
          We&apos;ve received your application for{' '}
          <strong className="font-medium text-[#1a1714]">{job.title}</strong>.
          Our team reviews every application personally and will be in touch
          within 5 business days.
        </p>
        <button type="button" onClick={onClose} className="btn-outline text-sm">
          <span>Back to Positions</span>
        </button>
      </div>
    );
  }

  return (
    <form className="px-6 py-8 lg:px-10" onSubmit={handleSubmit} noValidate>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.3em] text-[#b8975a]">
            Applying for
          </div>
          <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
            {job.title}
          </h3>
          <div className="mt-0.5 text-xs text-[#a39890]">
            {job.department} · {job.pay}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-[#e8e2da] text-[#a39890] transition-all duration-200 hover:border-[#b8975a] hover:text-[#b8975a]"
          aria-label="Close application form"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2l8 8M10 2l-8 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mb-5 grid gap-5 sm:grid-cols-2">
        <Field label="First Name" error={errors.firstName} required>
          <input
            type="text"
            name="firstName"
            autoComplete="given-name"
            maxLength={100}
            className={inputCls}
            placeholder="James"
            value={form.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            aria-invalid={Boolean(errors.firstName)}
          />
        </Field>
        <Field label="Last Name" error={errors.lastName} required>
          <input
            type="text"
            name="lastName"
            autoComplete="family-name"
            maxLength={100}
            className={inputCls}
            placeholder="Whitmore"
            value={form.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            aria-invalid={Boolean(errors.lastName)}
          />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            className={inputCls}
            placeholder="james@email.com"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone" error={errors.phone} required>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            maxLength={30}
            className={inputCls}
            placeholder="(555) 000-0000"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
      </div>

      <div className="mb-5 grid gap-5 sm:grid-cols-3">
        <Field label="City / Town" error={errors.city}>
          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            maxLength={100}
            className={inputCls}
            placeholder="Greenfield"
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
            aria-invalid={Boolean(errors.city)}
          />
        </Field>
        <Field label="Years of Experience" error={errors.experience} required>
          <select
            name="experience"
            className={selectCls}
            value={form.experience}
            onChange={(event) =>
              updateField(
                'experience',
                event.target.value as FormState['experience'],
              )
            }
            aria-invalid={Boolean(errors.experience)}
          >
            <option value="">Select...</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Availability" error={errors.availability} required>
          <select
            name="availability"
            className={selectCls}
            value={form.availability}
            onChange={(event) =>
              updateField(
                'availability',
                event.target.value as FormState['availability'],
              )
            }
            aria-invalid={Boolean(errors.availability)}
          >
            <option value="">Select...</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mb-5">
        <Field
          label={`Pay Range Response — ${job.pay}`}
          error={errors.salaryOk}
          required
        >
          <div className="flex gap-3">
            {PAY_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField('salaryOk', option.value)}
                className={`flex-1 border py-3 text-xs tracking-wide transition-all duration-200 ${
                  form.salaryOk === option.value
                    ? 'border-[#b8975a] bg-[#b8975a] font-semibold text-[#1a1714]'
                    : 'border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40'
                }`}
                aria-pressed={form.salaryOk === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mb-5">
        <Field
          label="Why do you want to work at Grayson's?"
          error={errors.whyUs}
          required
        >
          <textarea
            name="motivation"
            rows={4}
            maxLength={5000}
            className={`${inputCls} resize-none`}
            placeholder="Tell us what draws you to this role and what you'd bring to the team. Be specific — generic answers get generic results."
            value={form.whyUs}
            onChange={(event) => updateField('whyUs', event.target.value)}
            aria-invalid={Boolean(errors.whyUs)}
          />
          <span
            className={`-mt-1 text-right text-[9px] ${
              form.whyUs.trim().length < 20
                ? 'text-[#c5bdb5]'
                : 'text-[#b8975a]'
            }`}
          >
            {form.whyUs.trim().length} chars{' '}
            {form.whyUs.trim().length >= 20
              ? '✓'
              : `(${20 - form.whyUs.trim().length} more)`}
          </span>
        </Field>
      </div>

      <div className="mb-7">
        <label
          htmlFor={resumeInputId}
          className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]"
        >
          Resume / CV (optional)
        </label>
        <div
          className={`flex items-center gap-4 border border-dashed px-5 py-4 transition-colors ${
            errors.resumeFile
              ? 'border-red-400'
              : 'border-[#e8e2da] hover:border-[#b8975a]/40'
          }`}
        >
          <label
            htmlFor={resumeInputId}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M9 2v10M5 6l4-4 4 4"
                stroke="#b8975a"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 14h14"
                stroke="#b8975a"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="min-w-0 flex-1 truncate text-sm font-light text-[#a39890]">
              {form.resumeFile
                ? form.resumeFile.name
                : 'Upload PDF, DOC, or DOCX — 10 MB max'}
            </span>
          </label>
          {form.resumeFile && (
            <button
              type="button"
              onClick={removeResume}
              className="text-xs text-[#c5bdb5] transition-colors hover:text-[#1a1714]"
            >
              Remove
            </button>
          )}
          <input
            id={resumeInputId}
            ref={fileRef}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={(event) =>
              updateField('resumeFile', event.target.files?.[0] ?? null)
            }
          />
        </div>
        {errors.resumeFile && (
          <p className="mt-1.5 text-[10px] text-red-500">{errors.resumeFile}</p>
        )}
      </div>

      <div className="mb-7">
        <label className="group flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(event) => updateField('consent', event.target.checked)}
            className="sr-only"
            aria-invalid={Boolean(errors.consent)}
          />
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-200 ${
              form.consent
                ? 'border-[#b8975a] bg-[#b8975a]'
                : 'border-[#e8e2da] group-hover:border-[#b8975a]/40'
            }`}
            aria-hidden="true"
          >
            {form.consent && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 5l2.5 2.5 4.5-4.5"
                  stroke="#1a1714"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="text-xs font-light leading-relaxed text-[#5c5550]">
            I agree to have my information reviewed by Grayson&apos;s Services
            for this and future openings. I understand this is not a guarantee
            of employment.
          </span>
        </label>
        {errors.consent && (
          <p className="ml-8 mt-1.5 text-[10px] text-red-500">
            {errors.consent}
          </p>
        )}
      </div>

      {submissionError && (
        <p
          role="alert"
          className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700"
        >
          {submissionError}
        </p>
      )}

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <svg
                className="relative z-10 animate-spin"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
                <path
                  d="M7 2a5 5 0 015 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Submitting…</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="relative z-10"
                aria-hidden="true"
              >
                <path
                  d="M1.5 6.5h10M8 3l3.5 3.5L8 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
        <p className="text-[10px] font-light text-[#a39890]">
          We review every application personally.
        </p>
      </div>
    </form>
  );
}