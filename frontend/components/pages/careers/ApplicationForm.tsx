'use client';

import { useState, useRef } from 'react';
import type { JobListing } from './careersData';

const inputCls =
  'bg-[#f5f1eb] border border-[#e8e2da] text-[#1a1714] text-sm px-4 py-3.5 outline-none focus:border-[#b8975a] transition-colors duration-200 placeholder:text-[#c5bdb5] w-full';

const selectCls =
  'bg-[#f5f1eb] border border-[#e8e2da] text-[#1a1714] text-sm px-4 py-3.5 outline-none focus:border-[#b8975a] transition-colors duration-200 appearance-none w-full cursor-pointer';

function Field({
  label, error, required, children,
}: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-[0.25em] uppercase text-[#a39890] font-medium">
        {label}{required && <span className="text-[#b8975a] ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-[10px] text-red-400 mt-0.5">{error}</span>}
    </div>
  );
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  experience: string;
  availability: string;
  salaryOk: string;
  whyUs: string;
  resumeFile: File | null;
  consent: boolean;
};

const EMPTY: FormState = {
  firstName: '', lastName: '', email: '', phone: '',
  city: '', experience: '', availability: '', salaryOk: '',
  whyUs: '', resumeFile: null, consent: false,
};

export default function ApplicationForm({ job, onClose }: { job: JobListing; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState, v: any) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.experience) e.experience = 'Please select your experience level';
    if (!form.availability) e.availability = 'Please select your availability';
    if (form.whyUs.trim().length < 20) e.whyUs = 'Please write at least 20 characters';
    if (!form.consent) e.consent = 'Required to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-14 px-6">
        <div className="w-14 h-14 rounded-full border-2 border-[#b8975a] flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l5 5 11-10" stroke="#b8975a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium mb-3">Application Received</span>
        <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#1a1714] mb-3">
          Thanks, <em className="italic text-[#b8975a]">{form.firstName}.</em>
        </h3>
        <p className="text-sm text-[#5c5550] font-light max-w-sm leading-relaxed mb-8">
          We've received your application for <strong className="text-[#1a1714] font-medium">{job.title}</strong>. Our team reviews every application personally and will be in touch within 5 business days.
        </p>
        <button onClick={onClose} className="btn-outline text-sm">
          <span>Back to Positions</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 lg:px-10">
      {/* Form header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-medium mb-1">Applying for</div>
          <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1a1714]">{job.title}</h3>
          <div className="text-xs text-[#a39890] mt-0.5">{job.department} · {job.pay}</div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center border border-[#e8e2da] text-[#a39890] hover:border-[#b8975a] hover:text-[#b8975a] transition-all duration-200 shrink-0 mt-1"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <Field label="First Name" error={errors.firstName} required>
          <input type="text" className={inputCls} placeholder="James" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
        </Field>
        <Field label="Last Name" error={errors.lastName} required>
          <input type="text" className={inputCls} placeholder="Whitmore" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input type="email" className={inputCls} placeholder="james@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Phone" error={errors.phone} required>
          <input type="tel" className={inputCls} placeholder="(555) 000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-5">
        <Field label="City / Town">
          <input type="text" className={inputCls} placeholder="Greenfield" value={form.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label="Years of Experience" error={errors.experience} required>
          <select className={selectCls} value={form.experience} onChange={(e) => set('experience', e.target.value)}>
            <option value="">Select...</option>
            <option>No experience</option>
            <option>Less than 1 year</option>
            <option>1–2 years</option>
            <option>3–5 years</option>
            <option>5–10 years</option>
            <option>10+ years</option>
          </select>
        </Field>
        <Field label="Availability" error={errors.availability} required>
          <select className={selectCls} value={form.availability} onChange={(e) => set('availability', e.target.value)}>
            <option value="">Select...</option>
            <option>Immediately</option>
            <option>Within 2 weeks</option>
            <option>Within 1 month</option>
            <option>More than 1 month</option>
          </select>
        </Field>
      </div>

      {/* Pay range agreement */}
      <div className="mb-5">
        <Field label={`Pay Range Acceptance — ${job.pay}`} error={errors.salaryOk}>
          <div className="flex gap-3">
            {['Yes, this works for me', 'I\'d like to discuss'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set('salaryOk', opt)}
                className={`flex-1 py-3 text-xs tracking-wide border transition-all duration-200 ${
                  form.salaryOk === opt
                    ? 'bg-[#b8975a] border-[#b8975a] text-[#1a1714] font-semibold'
                    : 'border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Why us */}
      <div className="mb-5">
        <Field label="Why do you want to work at Grayson's?" error={errors.whyUs} required>
          <textarea
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Tell us what draws you to this role and what you'd bring to the team. Be specific — generic answers get generic results."
            value={form.whyUs}
            onChange={(e) => set('whyUs', e.target.value)}
          />
          <span className={`text-[9px] text-right -mt-1 ${form.whyUs.length < 20 ? 'text-[#c5bdb5]' : 'text-[#b8975a]'}`}>
            {form.whyUs.length} chars {form.whyUs.length >= 20 ? '✓' : `(${20 - form.whyUs.length} more)`}
          </span>
        </Field>
      </div>

      {/* Resume upload */}
      <div className="mb-7">
        <label className="text-[10px] tracking-[0.25em] uppercase text-[#a39890] font-medium block mb-2">Resume / CV (optional)</label>
        <div
          className="flex items-center gap-4 border border-dashed border-[#e8e2da] px-5 py-4 cursor-pointer hover:border-[#b8975a]/40 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v10M5 6l4-4 4 4" stroke="#b8975a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 14h14" stroke="#b8975a" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className="text-sm text-[#a39890] font-light flex-1">
            {form.resumeFile ? form.resumeFile.name : 'Upload PDF, DOC, or DOCX'}
          </span>
          {form.resumeFile && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); set('resumeFile', null); }}
              className="text-[#c5bdb5] hover:text-[#1a1714] transition-colors text-xs"
            >
              Remove
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => set('resumeFile', e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Consent */}
      <div className="mb-7">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => set('consent', !form.consent)}
            className={`w-5 h-5 mt-0.5 shrink-0 border flex items-center justify-center transition-all duration-200 ${
              form.consent ? 'bg-[#b8975a] border-[#b8975a]' : 'border-[#e8e2da] group-hover:border-[#b8975a]/40'
            }`}
          >
            {form.consent && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#1a1714" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-xs text-[#5c5550] font-light leading-relaxed">
            I agree to have my information reviewed by Grayson's Services for this and future openings. I understand this is not a guarantee of employment.
          </span>
        </label>
        {errors.consent && <p className="text-[10px] text-red-400 mt-1.5 ml-8">{errors.consent}</p>}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="animate-spin relative z-10" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2"/>
                <path d="M7 2a5 5 0 015 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Submitting…</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
                <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
        <p className="text-[10px] text-[#a39890] font-light">We review every application personally.</p>
      </div>
    </div>
  );
}
