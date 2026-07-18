'use client';

import type { ContactFormPayload } from './view-types';
import type { SyntheticEvent } from 'react';

export default function ContactFormClient() {
    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload: ContactFormPayload = {
        firstName: String(formData.get('firstName') ?? ''),
        lastName: String(formData.get('lastName') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        serviceType: String(formData.get('serviceType') ?? ''),
        projectDetails: String(formData.get('projectDetails') ?? ''),
    };

    console.log(payload);
    };

  return (
    <div className="w-full bg-stone-darkest p-5 sm:p-6 lg:p-12">
      <h3 className="mb-7 font-['Cormorant_Garamond'] text-2xl font-medium text-white">
        Request a Free Estimate
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <label className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              required
              className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold"
              placeholder="First Name"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              required
              className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold"
            placeholder="your@email.com"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold"
            placeholder="(555) 000-0000"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light">
            Service Type
          </label>
          <select
            name="serviceType"
            required
            defaultValue=""
            className="w-full min-w-0 cursor-pointer appearance-none border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-stone-light outline-none transition-colors duration-200 focus:border-gold"
          >
            <option value="" disabled>
              Select a service...
            </option>
            <option value="Patio Installation">Patio Installation</option>
            <option value="Retaining Wall">Retaining Wall</option>
            <option value="Driveway Pavers">Driveway Pavers</option>
            <option value="Outdoor Kitchen / Fire Feature">
              Outdoor Kitchen / Fire Feature
            </option>
            <option value="Walkway / Steps">Walkway / Steps</option>
            <option value="Commercial Project">Commercial Project</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light">
            Project Details
          </label>
          <textarea
            name="projectDetails"
            rows={4}
            required
            className="w-full min-w-0 resize-none border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold"
            placeholder="Tell us about your project, timeline, and any specific requirements..."
          />
        </div>

        <button type="submit" className="btn-primary mt-2 w-full justify-center">
          <span>Submit Request</span>
        </button>

        <p className="text-center text-[10px] leading-relaxed text-stone-mid">
          We respond within 24–48 business hours. No spam, no pressure.
        </p>
      </form>
    </div>
  );
}