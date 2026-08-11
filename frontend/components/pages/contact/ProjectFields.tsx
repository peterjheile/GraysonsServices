import BudgetSlider from "./BudgetSlider";
import {
  PROJECT_SIZE_OPTIONS,
  TIMELINE_OPTIONS,
  selectClassName,
} from "./constants";
import FormField from "./FormField";
import SectionHeading from "./SectionHeading";
import type {
  EstimateErrors,
  EstimateFormData,
  EstimateFormProps,
  SetEstimateField,
} from "./types";

interface ProjectFieldsProps extends EstimateFormProps {
  data: EstimateFormData;
  errors: EstimateErrors;
  disabled?: boolean;
  setField: SetEstimateField;
  onSkipOptionalDetails: () => void;
}

export default function ProjectFields({
  data,
  errors,
  services,
  disabled = false,
  setField,
  onSkipOptionalDetails,
}: ProjectFieldsProps) {
  return (
    <div className="estimate-step space-y-6">
      <SectionHeading
        title="Tell Us About the Project"
        description="Only the service choice is required. Size, budget, and timing can be left blank or marked as not sure."
      />

      <fieldset disabled={disabled} className="space-y-6">
        <legend className="sr-only">Project type and planning details</legend>

        <FormField
          id="serviceType"
          label="Service Type"
          error={errors.serviceType}
        >
          <select
            id="serviceType"
            name="serviceType"
            className={selectClassName}
            value={data.serviceType}
            required
            aria-invalid={Boolean(errors.serviceType)}
            aria-describedby={
              errors.serviceType ? "serviceType-error" : undefined
            }
            onChange={(event) =>
              setField("serviceType", event.currentTarget.value)
            }
          >
            <option value="">Select a service...</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
            <option value="multiple-services">Multiple Services</option>
            <option value="not-sure">Not sure — need guidance</option>
          </select>
        </FormField>

        <div className="border border-[#d8c7a8] bg-[#b8975a]/6 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1a1714]">
              Don't want to fill out the optional details?
            </p>
            <p className="mt-1 text-xs font-light leading-relaxed text-[#5c5550]">
              Skip the optional questions and review your request now.
            </p>
          </div>

          <button
            type="button"
            onClick={onSkipOptionalDetails}
            className="mt-4 w-full shrink-0 border border-[#b8975a] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#8b6c36] transition-colors hover:bg-[#b8975a] hover:text-[#1a1714] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a] sm:mt-0 sm:w-auto"
          >
            Skip Optional Details
          </button>
        </div>

        <div role="group" aria-labelledby="project-size-label">
          <p
            id="project-size-label"
            className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]"
          >
            Estimated Project Size (optional)
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {PROJECT_SIZE_OPTIONS.map((option) => {
              const isSelected = data.projectSize === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setField("projectSize", option.value)}
                  className={`flex min-h-16 flex-col items-start border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a] ${
                    isSelected
                      ? "border-[#b8975a] bg-[#b8975a]/8"
                      : "border-[#e8e2da] hover:border-[#b8975a]/40"
                  }`}
                >
                  <span
                    className={`mb-0.5 text-sm font-medium ${
                      isSelected ? "text-[#b8975a]" : "text-[#1a1714]"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-[10px] leading-tight text-[#a39890]">
                    {option.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <BudgetSlider
          value={data.budget}
          disabled={disabled}
          onChange={(value) => setField("budget", value)}
        />

        <div role="group" aria-labelledby="timeline-label">
          <p
            id="timeline-label"
            className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]"
          >
            Desired Timeline (optional)
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TIMELINE_OPTIONS.map((timeline) => {
              const isSelected = data.timeline === timeline;

              return (
                <button
                  key={timeline}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setField("timeline", timeline)}
                  className={`border px-3 py-3 text-left text-[11px] uppercase tracking-[0.1em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8975a] ${
                    isSelected
                      ? "border-[#b8975a] bg-[#b8975a]/6 text-[#b8975a]"
                      : "border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40"
                  }`}
                >
                  {timeline}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>
    </div>
  );
}