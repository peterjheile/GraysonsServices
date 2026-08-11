import { inputClassName, REFERRAL_SOURCES, selectClassName } from "./constants";
import FormField from "./FormField";
import SectionHeading from "./SectionHeading";
import type {
  EstimateErrors,
  EstimateFormData,
  SetEstimateField,
} from "./types";

interface ContactFieldsProps {
  data: EstimateFormData;
  errors: EstimateErrors;
  disabled?: boolean;
  setField: SetEstimateField;
}

export default function ContactFields({
  data,
  errors,
  disabled = false,
  setField,
}: ContactFieldsProps) {
  return (
    <div className="estimate-step space-y-5">
      <SectionHeading
        title="Your Contact Details"
        description="We'll use this to send your estimate and schedule a site visit. Property details and referral information are optional."
      />

      <fieldset disabled={disabled} className="space-y-5">
        <legend className="sr-only">Your contact details</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="firstName" label="First Name" error={errors.firstName}>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className={inputClassName}
              placeholder="James"
              value={data.firstName}
              required
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              onChange={(event) =>
                setField("firstName", event.currentTarget.value)
              }
            />
          </FormField>

          <FormField id="lastName" label="Last Name" error={errors.lastName}>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className={inputClassName}
              placeholder="Whitmore"
              value={data.lastName}
              required
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              onChange={(event) =>
                setField("lastName", event.currentTarget.value)
              }
            />
          </FormField>
        </div>

        <FormField id="email" label="Email Address" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputClassName}
            placeholder="james@email.com"
            value={data.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(event) => setField("email", event.currentTarget.value)}
          />
        </FormField>

        <FormField id="phone" label="Phone Number" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputClassName}
            placeholder="(555) 000-0000"
            value={data.phone}
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            onChange={(event) => setField("phone", event.currentTarget.value)}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="address" label="Property Address (optional)" optional>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              className={inputClassName}
              placeholder="123 Oak Street"
              value={data.address}
              onChange={(event) =>
                setField("address", event.currentTarget.value)
              }
            />
          </FormField>

          <FormField id="city" label="City (optional)" optional>
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              className={inputClassName}
              placeholder="Greenfield"
              value={data.city}
              onChange={(event) => setField("city", event.currentTarget.value)}
            />
          </FormField>
        </div>

        <FormField id="heardAbout" label="How did you hear about us? (optional)" optional>
          <select
            id="heardAbout"
            name="heardAbout"
            className={selectClassName}
            value={data.heardAbout}
            onChange={(event) =>
              setField(
                "heardAbout",
                event.currentTarget.value as EstimateFormData["heardAbout"],
              )
            }
          >
            <option value="">Select one...</option>
            {REFERRAL_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </FormField>
      </fieldset>
    </div>
  );
}