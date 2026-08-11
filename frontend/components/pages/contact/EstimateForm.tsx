"use client";

import Link from "next/link";
import { Fragment, useRef, useState, type FormEvent } from "react";

import { QuoteRequestError, submitQuoteRequest } from "@/features/contact/api";

import ContactFields from "./ContactFields";
import {
  FORM_STEPS,
  PROJECT_SIZE_LABELS,
  createEmptyEstimateForm,
  inputClassName,
} from "./constants";
import PhotoUpload from "./PhotoUpload";
import ProjectFields from "./ProjectFields";
import SectionHeading from "./SectionHeading";
import type {
  EstimateErrors,
  EstimateField,
  EstimateFormData,
  EstimateFormProps,
  SetEstimateField,
} from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_FIELD_MAP: Record<string, EstimateField> = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone: "phone",
  address: "address",
  city: "city",
  service_type: "serviceType",
  project_size: "projectSize",
  budget: "budget",
  timeline: "timeline",
  description: "description",
  heard_about: "heardAbout",
  photos: "files",
  consent: "consent",
};

const FIELD_STEP: Record<EstimateField, number> = {
  firstName: 0,
  lastName: 0,
  email: 0,
  phone: 0,
  address: 0,
  city: 0,
  heardAbout: 0,
  serviceType: 1,
  projectSize: 1,
  budget: 1,
  timeline: 1,
  description: 2,
  files: 2,
  consent: 3,
};

function validateStep(data: EstimateFormData, step: number): EstimateErrors {
  const errors: EstimateErrors = {};

  if (step === 0) {
    if (!data.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!data.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!EMAIL_PATTERN.test(data.email.trim())) {
      errors.email = "Enter a valid email address";
    }
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    }
  }

  if (step === 1 && !data.serviceType) {
    errors.serviceType = "Please select a service type";
  }

  if (step === 2 && data.description.length > 5000) {
    errors.description = "Project description must be 5,000 characters or less";
  }

  if (step === 3 && !data.consent) {
    errors.consent = "Please agree to be contacted";
  }

  return errors;
}

function firstErrorField(errors: EstimateErrors): EstimateField | undefined {
  return (Object.keys(errors) as Array<keyof EstimateErrors>).find(
    (field): field is EstimateField => field !== "form",
  );
}

function readErrorMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === "string");
  }

  return undefined;
}

function mapApiErrors(fieldErrors: unknown): EstimateErrors {
  if (!fieldErrors || typeof fieldErrors !== "object" || Array.isArray(fieldErrors)) {
    return {};
  }

  const mapped: EstimateErrors = {};

  for (const [apiField, value] of Object.entries(fieldErrors)) {
    const message = readErrorMessage(value);

    if (!message) {
      continue;
    }

    const formField = API_FIELD_MAP[apiField];

    if (formField) {
      mapped[formField] = message;
    } else if (!mapped.form) {
      mapped.form = message;
    }
  }

  return mapped;
}

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <ol
      className="mx-auto mb-6 flex w-full max-w-2xl items-start sm:mb-8"
      aria-label="Estimate request progress"
    >
      {FORM_STEPS.map((item, index) => (
        <Fragment key={item.number}>
          <li className="relative z-10 flex w-9 shrink-0 flex-col items-center">
            <span
              className={`flex h-9 w-9 items-center justify-center border transition-all duration-300 ${
                index < currentStep
                  ? "border-[#b8975a] bg-[#b8975a]"
                  : index === currentStep
                    ? "border-[#b8975a] bg-transparent"
                    : "border-[#e8e2da] bg-transparent"
              }`}
              aria-current={index === currentStep ? "step" : undefined}
            >
              {index < currentStep ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 7l3 3 6-6"
                    stroke="#1a1714"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span
                  className={`font-['Cormorant_Garamond'] text-base font-semibold ${
                    index === currentStep ? "text-[#b8975a]" : "text-[#d4cab8]"
                  }`}
                >
                  {item.number}
                </span>
              )}
            </span>

            <span
              className={`mt-1.5 hidden whitespace-nowrap text-[9px] uppercase tracking-[0.15em] sm:block ${
                index === currentStep
                  ? "font-medium text-[#b8975a]"
                  : "text-[#c5bdb5]"
              }`}
            >
              {item.label}
            </span>
          </li>

          {index < FORM_STEPS.length - 1 && (
            <li
              className="relative mx-2 mt-[18px] h-px flex-1 overflow-hidden bg-[#e8e2da] sm:mx-3"
              aria-hidden="true"
            >
              <span
                className="absolute inset-y-0 left-0 bg-[#b8975a] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: index < currentStep ? "100%" : "0%" }}
              />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

type ReviewSection = {
  heading: string;
  rows: Array<[string, string]>;
};

function reviewRow(label: string, value: string): [string, string] {
  return [label, value];
}

export default function EstimateForm({ services }: EstimateFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<EstimateFormData>(createEmptyEstimateForm);
  const [errors, setErrors] = useState<EstimateErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const setField: SetEstimateField = (field, value) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
    setSubmitError("");
  };

  const focusField = (field: EstimateField | undefined) => {
    if (!field) {
      return;
    }

    window.requestAnimationFrame(() => {
      const id = field === "files" ? "photos" : field;
      document.getElementById(id)?.focus();
    });
  };

  const showStep = (nextStep: number) => {
    setStep(nextStep);
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      formRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const advance = () => {
    const nextErrors = validateStep(data, step);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusField(firstErrorField(nextErrors));
      return;
    }

    showStep(Math.min(step + 1, FORM_STEPS.length - 1));
  };

  const skipOptionalDetails = () => {
    const nextErrors = validateStep(data, 1);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusField(firstErrorField(nextErrors));
      return;
    }

    showStep(3);
  };

  const submit = async () => {
    if (submitting) {
      return;
    }

    const allErrors = FORM_STEPS.reduce<EstimateErrors>(
      (result, _, stepIndex) => ({
        ...result,
        ...validateStep(data, stepIndex),
      }),
      {},
    );

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const field = firstErrorField(allErrors);
      const targetStep = field ? FIELD_STEP[field] : 3;
      showStep(targetStep);
      focusField(field);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitQuoteRequest({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        service_type: data.serviceType,
        project_size: data.projectSize,
        budget: data.budget,
        timeline: data.timeline,
        description: data.description,
        heard_about: data.heardAbout,
        consent: data.consent,
        photos: data.files,
      });

      setSubmitted(true);
    } catch (error) {
      if (error instanceof QuoteRequestError) {
        const apiErrors = mapApiErrors(error.fieldErrors);
        setErrors(apiErrors);
        setSubmitError(error.message);

        const field = firstErrorField(apiErrors);
        if (field) {
          showStep(FIELD_STEP[field]);
          focusField(field);
        }
      } else {
        setSubmitError("We could not send your request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step < FORM_STEPS.length - 1) {
      advance();
    } else {
      void submit();
    }
  };

  if (submitted) {
    return (
      <section className="w-full px-3 sm:px-6 lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-3xl">
          <div className="flex min-h-[520px] flex-col items-center justify-center px-4 py-16 text-center sm:px-8 sm:py-20">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#b8975a]">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path
                  d="M5 14l7 7 11-11"
                  stroke="#b8975a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#b8975a]">
              Request Received
            </span>
            <h2 className="mb-5 font-['Cormorant_Garamond'] text-4xl font-light text-[#1a1714] lg:text-5xl">
              We'll Be in Touch <em className="italic text-[#b8975a]">Shortly</em>
            </h2>
            <p className="max-w-md text-sm font-light leading-relaxed text-[#5c5550]">
              Thank you, <strong className="font-medium text-[#1a1714]">{data.firstName}</strong>.
              A member of our team will review your project details and respond within 48 hours.
            </p>
            <div className="mt-10 flex w-full flex-col justify-center gap-4 min-[400px]:w-auto min-[400px]:flex-row">
              <Link href="/projects" className="btn-primary">
                <span>Browse Our Projects</span>
              </Link>
              <Link href="/" className="btn-outline">
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const selectedService =
    services.find((service) => service.slug === data.serviceType)?.name ??
    ({
      "multiple-services": "Multiple Services",
      "not-sure": "Not sure — need guidance",
    }[data.serviceType] || data.serviceType);

  const reviewSections: ReviewSection[] = [
    {
      heading: "Contact",
      rows: [
        reviewRow("Name", `${data.firstName} ${data.lastName}`),
        reviewRow("Email", data.email),
        reviewRow("Phone", data.phone),
        ...(data.address || data.city
          ? [reviewRow("Location", [data.address, data.city].filter(Boolean).join(", "))]
          : []),
      ],
    },
    {
      heading: "Project",
      rows: [
        reviewRow("Service", selectedService),
        reviewRow("Size", PROJECT_SIZE_LABELS[data.projectSize]),
        reviewRow("Budget", data.budget),
        ...(data.timeline ? [reviewRow("Timeline", data.timeline)] : []),
      ],
    },
    {
      heading: "Details",
      rows: [
        ...(data.description
          ? [
              reviewRow(
                "Description",
                data.description.length > 80
                  ? `${data.description.slice(0, 80)}…`
                  : data.description,
              ),
            ]
          : []),
        ...(data.files.length > 0
          ? [
              reviewRow(
                "Photos",
                `${data.files.length} file${data.files.length === 1 ? "" : "s"} attached`,
              ),
            ]
          : []),
        ...(data.heardAbout
          ? [reviewRow("Referred by", data.heardAbout)]
          : []),
      ],
    },
  ].filter((section) => section.rows.length > 0);

  return (
    <section className="w-full px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="relative mx-auto w-full min-w-0 max-w-3xl scroll-mt-28"
      >
        <ProgressSteps currentStep={step} />

        {step === 0 && (
          <ContactFields
            data={data}
            errors={errors}
            disabled={submitting}
            setField={setField}
          />
        )}

        {step === 1 && (
          <ProjectFields
            data={data}
            errors={errors}
            services={services}
            disabled={submitting}
            setField={setField}
            onSkipOptionalDetails={skipOptionalDetails}
          />
        )}

        {step === 2 && (
          <div className="estimate-step space-y-6">
            <SectionHeading
              title="Project Details & Photos (Optional)"
              description="Add any context you know, or leave this step blank and continue."
            />

            <fieldset disabled={submitting} className="space-y-6">
              <legend className="sr-only">Optional project details and photos</legend>
              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]"
                >
                  Describe Your Project (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  maxLength={5000}
                  className={`${inputClassName} resize-y`}
                  placeholder="Tell us what you're envisioning — what exists now, what you'd like to build, any specific materials or styles you have in mind, and any challenges we should know about..."
                  value={data.description}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? "description-error" : "description-count"}
                  onChange={(event) =>
                    setField("description", event.currentTarget.value)
                  }
                />
                {errors.description ? (
                  <p id="description-error" role="alert" className="text-[10px] text-red-500">
                    {errors.description}
                  </p>
                ) : (
                  <span id="description-count" className="text-right text-[9px] text-[#c5bdb5]">
                    {data.description.length} characters
                  </span>
                )}
              </div>

              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]">
                  Site Photos (optional — up to 5)
                </p>
                <PhotoUpload
                  photos={data.files}
                  disabled={submitting}
                  onChange={(files) => setField("files", files)}
                />
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="estimate-step space-y-6">
            <SectionHeading
              title="Review & Submit"
              description="Everything look right? We'll be in touch within 48 hours."
            />

            <div className="divide-y divide-[#e8e2da] border border-[#e8e2da] bg-[#f5f1eb]">
              {reviewSections.map((section) => (
                <div key={section.heading} className="p-5">
                  <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b8975a]">
                    {section.heading}
                  </p>
                  <dl className="space-y-2">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="flex min-w-0 gap-3 sm:gap-4">
                        <dt className="w-20 shrink-0 text-[10px] tracking-wide text-[#a39890] sm:w-24">
                          {label}
                        </dt>
                        <dd className="min-w-0 break-words text-sm font-light text-[#1a1714]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div>
              <label className="group flex cursor-pointer items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  className="peer sr-only"
                  checked={data.consent}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  onChange={(event) => setField("consent", event.currentTarget.checked)}
                />
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#b8975a] peer-focus-visible:ring-offset-2 ${
                    data.consent
                      ? "border-[#b8975a] bg-[#b8975a]"
                      : "border-[#e8e2da] group-hover:border-[#b8975a]/40"
                  }`}
                  aria-hidden="true"
                >
                  {data.consent && (
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
                  I agree to be contacted by Grayson's Services regarding my estimate request.
                  I understand this is a free, no-obligation consultation and my information
                  will never be shared or sold.
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" role="alert" className="ml-8 mt-2 text-[10px] text-red-500">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700"
          >
            {submitError}
          </div>
        )}

        <div className={`mt-10 flex min-w-0 items-center gap-4 ${step > 0 ? "justify-between" : "justify-end"}`}>
          {step > 0 && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => showStep(Math.max(step - 1, 0))}
              className="flex min-h-11 shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#a39890] transition-colors hover:text-[#5c5550] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M12 7H2M6 3l-4 4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary min-w-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <svg className="relative z-10 animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                  <path d="M7 2a5 5 0 015 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Sending…</span>
              </>
            ) : (
              <>
                <span>
                  {step === 3
                    ? "Submit Request"
                    : step === 2
                      ? "Review Request"
                      : "Continue"}
                </span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10" aria-hidden="true">
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
        </div>

        <style>{`
          @keyframes estimateFadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .estimate-step {
            animation: estimateFadeSlideIn 0.4s ease both;
          }

          @media (prefers-reduced-motion: reduce) {
            .estimate-step {
              animation: none;
            }
          }
        `}</style>
      </form>
    </section>
  );
}