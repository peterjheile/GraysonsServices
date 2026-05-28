'use client';

import { useState, useRef, useCallback } from 'react';

/* ─── Types ─────────────────────────────────────── */
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  serviceType: string;
  projectSize: string;
  budget: string;
  timeline: string;
  description: string;
  heardAbout: string;
  files: File[];
  consent: boolean;
};

const EMPTY: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  serviceType: '',
  projectSize: '',
  budget: '',
  timeline: '',
  description: '',
  heardAbout: '',
  files: [],
  consent: false,
};

/* ─── Step metadata ──────────────────────────────── */
const steps = [
  { label: 'Your Info', number: '01' },
  { label: 'The Project', number: '02' },
  { label: 'Details', number: '03' },
  { label: 'Confirm', number: '04' },
];

/* ─── Reusable input components ─────────────────── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] tracking-[0.25em] uppercase text-[#a39890] font-medium">
        {label}
      </label>
      {children}
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}

const inputCls =
  'bg-[#f5f1eb] border border-[#e8e2da] text-[#1a1714] text-sm px-4 py-3.5 outline-none focus:border-[#b8975a] transition-colors duration-200 placeholder:text-[#c5bdb5] w-full';

const selectCls =
  'bg-[#f5f1eb] border border-[#e8e2da] text-[#1a1714] text-sm px-4 py-3.5 outline-none focus:border-[#b8975a] transition-colors duration-200 appearance-none cursor-pointer w-full';

/* ─── Budget labels ──────────────────────────────── */
const budgetMarks = [
  { value: 0, label: '<$5k' },
  { value: 25, label: '$5–15k' },
  { value: 50, label: '$15–30k' },
  { value: 75, label: '$30–60k' },
  { value: 100, label: '$60k+' },
];

function labelFromBudget(v: number) {
  return budgetMarks.find((m) => m.value === v)?.label ?? '$5–15k';
}

/* ─── Main component ─────────────────────────────── */
export default function EstimateForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [budgetVal, setBudgetVal] = useState(25);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof FormData, value: any) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = 'First name is required';
      if (!data.lastName.trim()) e.lastName = 'Last name is required';
      if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        e.email = 'Enter a valid email address';
      }
      if (!data.phone.trim()) e.phone = 'Phone number is required';
    }

    if (step === 1) {
      if (!data.serviceType) e.serviceType = 'Please select a service type';
      if (!data.projectSize) e.projectSize = 'Please select a project size';
      if (!data.timeline) e.timeline = 'Please select a timeline';
    }

    if (step === 2) {
      if (!data.description.trim() || data.description.length < 20) {
        e.description = 'Please describe your project in at least 20 characters';
      }
    }

    if (step === 3) {
      if (!data.consent) e.consent = 'Please agree to be contacted';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, data]);

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, 3));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const arr = Array.from(incoming).slice(0, 5 - data.files.length);
    set('files', [...data.files, ...arr]);
  };

  if (submitted) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full min-w-[320px] max-w-3xl">
          <div className="flex min-h-[520px] flex-col items-center justify-center px-8 py-20 text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#b8975a]">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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

            <h3 className="mb-5 font-['Cormorant_Garamond'] text-4xl font-light text-[#1a1714] lg:text-5xl">
              We'll Be in Touch <em className="italic text-[#b8975a]">Shortly</em>
            </h3>

            <p className="max-w-md text-sm font-light leading-relaxed text-[#5c5550]">
              Thank you,{' '}
              <strong className="font-medium text-[#1a1714]">{data.firstName}</strong>.
              A member of our team will review your project details and reach out within
              48 business hours with a personalised estimate.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="/projects" className="btn-primary">
                <span>Browse Our Projects</span>
              </a>

              <a href="/" className="btn-outline">
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div ref={formRef} className="relative mx-auto w-full min-w-[320px] max-w-3xl">
        {/* Step progress bar */}
        <div className="mb-10 relative mx-auto">
          <div className="mb-4 flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.label} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center border transition-all duration-400 ${
                      i < step
                        ? 'border-[#b8975a] bg-[#b8975a]'
                        : i === step
                          ? 'border-[#b8975a] bg-transparent'
                          : 'border-[#e8e2da] bg-transparent'
                    }`}
                  >
                    {i < step ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
                          i === step ? 'text-[#b8975a]' : 'text-[#d4cab8]'
                        }`}
                      >
                        {s.number}
                      </span>
                    )}
                  </div>

                  <span
                    className={`mt-1.5 hidden text-[9px] uppercase tracking-[0.15em] sm:block ${
                      i === step ? 'font-medium text-[#b8975a]' : 'text-[#c5bdb5]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="relative mx-3 mb-4 h-px flex-1 overflow-hidden bg-[#e8e2da] sm:mb-6">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#b8975a] transition-all duration-500"
                      style={{ width: i < step ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {step === 0 && (
          <div className="space-y-5 animate-[fadeSlideIn_0.4s_ease_both]">
            <div className="mb-6">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
                Your Contact Details
              </h3>
              <p className="mt-1 text-xs font-light text-[#a39890]">
                We'll use this to send your estimate and schedule a site visit.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First Name" error={errors.firstName}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="James"
                  value={data.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                />
              </Field>

              <Field label="Last Name" error={errors.lastName}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Whitmore"
                  value={data.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Email Address" error={errors.email}>
              <input
                type="email"
                className={inputCls}
                placeholder="james@email.com"
                value={data.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>

            <Field label="Phone Number" error={errors.phone}>
              <input
                type="tel"
                className={inputCls}
                placeholder="(555) 000-0000"
                value={data.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Property Address (optional)">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="123 Oak Street"
                  value={data.address}
                  onChange={(e) => set('address', e.target.value)}
                />
              </Field>

              <Field label="City">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Greenfield"
                  value={data.city}
                  onChange={(e) => set('city', e.target.value)}
                />
              </Field>
            </div>

            <Field label="How did you hear about us?">
              <select
                className={selectCls}
                value={data.heardAbout}
                onChange={(e) => set('heardAbout', e.target.value)}
              >
                <option value="">Select one...</option>
                <option>Google Search</option>
                <option>Houzz</option>
                <option>Neighbour / Word of Mouth</option>
                <option>Facebook / Instagram</option>
                <option>Saw our yard sign</option>
                <option>Returning customer</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="space-y-6 animate-[fadeSlideIn_0.4s_ease_both]">
            <div className="mb-6">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
                Tell Us About the Project
              </h3>
              <p className="mt-1 text-xs font-light text-[#a39890]">
                This helps us assign the right team member before we call.
              </p>
            </div>

            <Field label="Service Type" error={errors.serviceType}>
              <select
                className={selectCls}
                value={data.serviceType}
                onChange={(e) => set('serviceType', e.target.value)}
              >
                <option value="">Select a service...</option>
                <option>Stone Patio</option>
                <option>Retaining Wall</option>
                <option>Driveway Pavers</option>
                <option>Outdoor Kitchen</option>
                <option>Fire Pit or Fireplace</option>
                <option>Walkway or Steps</option>
                <option>Pool Surround</option>
                <option>Commercial Project</option>
                <option>Multiple Services</option>
                <option>Not sure — need guidance</option>
              </select>
            </Field>

            <Field label="Estimated Project Size" error={errors.projectSize}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { val: 'small', label: 'Small', sub: 'Under 500 sq ft' },
                  { val: 'medium', label: 'Medium', sub: '500–1,500 sq ft' },
                  { val: 'large', label: 'Large', sub: '1,500–3,000 sq ft' },
                  { val: 'xl', label: 'XL / Commercial', sub: '3,000+ sq ft' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => set('projectSize', opt.val)}
                    className={`flex flex-col items-start border p-4 text-left transition-all duration-200 ${
                      data.projectSize === opt.val
                        ? 'border-[#b8975a] bg-[#b8975a]/8'
                        : 'border-[#e8e2da] hover:border-[#b8975a]/40'
                    }`}
                  >
                    <span
                      className={`mb-0.5 text-sm font-medium ${
                        data.projectSize === opt.val ? 'text-[#b8975a]' : 'text-[#1a1714]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-[10px] leading-tight text-[#a39890]">
                      {opt.sub}
                    </span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`Approximate Budget — ${labelFromBudget(budgetVal)}`}>
              <div className="pt-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={25}
                  value={budgetVal}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setBudgetVal(v);
                    set('budget', labelFromBudget(v));
                  }}
                  className="h-[2px] w-full cursor-pointer appearance-none bg-[#e8e2da] accent-[#b8975a]"
                  style={{
                    background: `linear-gradient(to right, #b8975a ${budgetVal}%, #e8e2da ${budgetVal}%)`,
                  }}
                />

                <div className="mt-2 flex justify-between">
                  {budgetMarks.map((m) => (
                    <span
                      key={m.value}
                      className={`text-[9px] tracking-wide ${
                        m.value === budgetVal
                          ? 'font-semibold text-[#b8975a]'
                          : 'text-[#c5bdb5]'
                      }`}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </Field>

            <Field label="Desired Timeline" error={errors.timeline}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  'ASAP',
                  'Within 1 month',
                  '1–3 months',
                  '3–6 months',
                  'This year',
                  'Just planning',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('timeline', t)}
                    className={`border px-3 py-3 text-left text-[11px] uppercase tracking-[0.1em] transition-all duration-200 ${
                      data.timeline === t
                        ? 'border-[#b8975a] bg-[#b8975a]/6 text-[#b8975a]'
                        : 'border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="space-y-6 animate-[fadeSlideIn_0.4s_ease_both]">
            <div className="mb-6">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
                Project Details & Photos
              </h3>
              <p className="mt-1 text-xs font-light text-[#a39890]">
                The more context you give, the more accurate your estimate will be.
              </p>
            </div>

            <Field label="Describe Your Project" error={errors.description}>
              <textarea
                rows={5}
                className={`${inputCls} resize-none`}
                placeholder="Tell us what you're envisioning — what exists now, what you'd like to build, any specific materials or styles you have in mind, and any challenges we should know about..."
                value={data.description}
                onChange={(e) => set('description', e.target.value)}
              />

              <span
                className={`mt-1 text-right text-[9px] ${
                  data.description.length < 20 ? 'text-[#c5bdb5]' : 'text-[#b8975a]'
                }`}
              >
                {data.description.length} characters{' '}
                {data.description.length < 20
                  ? `(${20 - data.description.length} more to go)`
                  : '✓'}
              </span>
            </Field>

            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]">
                Site Photos (optional — up to 5)
              </label>

              <div
                className={`cursor-pointer rounded-sm border-2 border-dashed p-8 text-center transition-colors duration-200 ${
                  dragOver
                    ? 'border-[#b8975a] bg-[#b8975a]/5'
                    : 'border-[#e8e2da] hover:border-[#b8975a]/40'
                }`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="mx-auto mb-3 text-[#c5bdb5]"
                >
                  <path
                    d="M16 4v16M8 12l8-8 8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 24h24v4H4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>

                <p className="text-sm font-light text-[#a39890]">
                  Drag & drop photos here, or{' '}
                  <span className="text-[#b8975a] underline underline-offset-2">
                    browse files
                  </span>
                </p>

                <p className="mt-1 text-[10px] text-[#c5bdb5]">
                  JPG, PNG, HEIC up to 10MB each
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {data.files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {data.files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border border-[#e8e2da] bg-[#f5f1eb] px-3 py-2"
                    >
                      <span className="max-w-[240px] truncate text-xs text-[#5c5550]">
                        {f.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          set(
                            'files',
                            data.files.filter((_, j) => j !== i),
                          )
                        }
                        className="ml-4 text-[#a39890] transition-colors hover:text-[#1a1714]"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 2l8 8M10 2l-8 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <div className="space-y-6 animate-[fadeSlideIn_0.4s_ease_both]">
            <div className="mb-6">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">
                Review & Submit
              </h3>
              <p className="mt-1 text-xs font-light text-[#a39890]">
                Everything look right? We'll be in touch within 48 hours.
              </p>
            </div>

            <div className="divide-y divide-[#e8e2da] border border-[#e8e2da] bg-[#f5f1eb]">
              {[
                {
                  heading: 'Contact',
                  rows: [
                    ['Name', `${data.firstName} ${data.lastName}`],
                    ['Email', data.email],
                    ['Phone', data.phone],
                    data.city &&
                      ['Location', [data.address, data.city].filter(Boolean).join(', ')],
                  ].filter(Boolean) as [string, string][],
                },
                {
                  heading: 'Project',
                  rows: [
                    data.serviceType && ['Service', data.serviceType],
                    data.projectSize && [
                      'Size',
                      {
                        small: 'Small (under 500 sq ft)',
                        medium: 'Medium (500–1,500 sq ft)',
                        large: 'Large (1,500–3,000 sq ft)',
                        xl: 'XL / Commercial (3,000+ sq ft)',
                      }[data.projectSize] ?? data.projectSize,
                    ],
                    data.budget && ['Budget', data.budget],
                    data.timeline && ['Timeline', data.timeline],
                  ].filter(Boolean) as [string, string][],
                },
                {
                  heading: 'Details',
                  rows: [
                    data.description && [
                      'Description',
                      data.description.length > 80
                        ? data.description.slice(0, 80) + '…'
                        : data.description,
                    ],
                    data.files.length > 0 && [
                      'Photos',
                      `${data.files.length} file${data.files.length > 1 ? 's' : ''} attached`,
                    ],
                    data.heardAbout && ['Referred by', data.heardAbout],
                  ].filter(Boolean) as [string, string][],
                },
              ].map((section) => (
                <div key={section.heading} className="p-5">
                  <div className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#b8975a]">
                    {section.heading}
                  </div>

                  <dl className="space-y-2">
                    {section.rows.map(([k, v]) => (
                      <div key={k} className="flex gap-4">
                        <dt className="w-24 shrink-0 text-[10px] tracking-wide text-[#a39890]">
                          {k}
                        </dt>
                        <dd className="text-sm font-light text-[#1a1714]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div>
              <label className="group flex cursor-pointer items-start gap-3">
                <div
                  onClick={() => set('consent', !data.consent)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-200 ${
                    data.consent
                      ? 'border-[#b8975a] bg-[#b8975a]'
                      : 'border-[#e8e2da] group-hover:border-[#b8975a]/40'
                  }`}
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
                </div>

                <span className="text-xs font-light leading-relaxed text-[#5c5550]">
                  I agree to be contacted by Grayson's Services regarding my estimate
                  request. I understand this is a free, no-obligation consultation and
                  my information will never be shared or sold.
                </span>
              </label>

              {errors.consent && (
                <span className="ml-8 mt-2 block text-[10px] text-red-400">
                  {errors.consent}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className={`mt-10 flex items-center ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#a39890] transition-colors hover:text-[#5c5550]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary">
              <span>Continue</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
                <path
                  d="M1.5 6.5h10M8 3l3.5 3.5L8 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg className="relative z-10 animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                    <path d="M7 2a5 5 0 015 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
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
          )}
        </div>

        <style jsx>{`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}