'use client';

import {
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';

import {
  ContactSubmissionError,
  submitContactForm,
} from '@/features/contact/api';

import type { ContactSubmissionInput } from '@/features/contact/types';

export default function ContactFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const statusRef = useRef<HTMLParagraphElement>(null);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: ContactSubmissionInput = {
      first_name: String(formData.get('firstName') ?? '').trim(),
      last_name: String(formData.get('lastName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

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
        setErrorMessage(error.message);
      } else {
        console.error('Unexpected contact form error:', error);

        setErrorMessage(
          'Something went wrong. Please try again.',
        );
      }

      requestAnimationFrame(() => {
        statusRef.current?.focus();
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusMessage = errorMessage || successMessage;

  return (
    <div className="w-full bg-stone-darkest p-5 sm:p-6 lg:p-12">
      <h3 className="mb-7 font-['Cormorant_Garamond'] text-2xl font-medium text-white">
        Send Us a Message
      </h3>

      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="contact-first-name"
              className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light"
            >
              First Name
            </label>

            <input
              id="contact-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              disabled={isSubmitting}
              className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="First Name"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="contact-last-name"
              className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light"
            >
              Last Name
            </label>

            <input
              id="contact-last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              disabled={isSubmitting}
              className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-email"
            className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Email Address
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="your@email.com"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-phone"
            className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light"
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
            disabled={isSubmitting}
            className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="(555) 000-0000"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-subject"
            className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Subject
          </label>

          <input
            id="contact-subject"
            name="subject"
            type="text"
            autoComplete="off"
            required
            disabled={isSubmitting}
            className="w-full min-w-0 border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="How can we help?"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="contact-message"
            className="break-words text-[10px] uppercase tracking-[0.15em] text-stone-light"
          >
            Message
          </label>

          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={isSubmitting}
            className="w-full min-w-0 resize-none border border-[#3d3632] bg-stone-dark px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-stone-mid focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Ask a question or tell us what’s on your mind..."
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
          className="btn-primary mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </span>
        </button>

        <p className="text-center text-[10px] leading-relaxed text-stone-mid">
          We typically respond within 24–48 business hours.
        </p>
      </form>
    </div>
  );
}