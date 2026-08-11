import type { EstimateFormData } from "./types";

export function createEmptyEstimateForm(): EstimateFormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    serviceType: "",
    projectSize: "not-sure",
    budget: "Not sure",
    timeline: "",
    description: "",
    heardAbout: "",
    files: [],
    consent: false,
  };
}

export const FORM_STEPS = [
  { label: "Your Info", number: "01" },
  { label: "The Project", number: "02" },
  { label: "Details", number: "03" },
  { label: "Confirm", number: "04" },
] as const;

export const PROJECT_SIZE_OPTIONS = [
  { value: "not-sure", label: "Not sure", detail: "I need guidance" },
  { value: "small", label: "Small", detail: "Under 500 sq ft" },
  { value: "medium", label: "Medium", detail: "500–1,500 sq ft" },
  { value: "large", label: "Large", detail: "1,500–3,000 sq ft" },
  { value: "xl", label: "XL / Commercial", detail: "3,000+ sq ft" },
] as const satisfies ReadonlyArray<{
  value: EstimateFormData["projectSize"];
  label: string;
  detail: string;
}>;

export const PROJECT_SIZE_LABELS: Record<
  EstimateFormData["projectSize"],
  string
> = {
  "not-sure": "Not sure",
  small: "Small (under 500 sq ft)",
  medium: "Medium (500–1,500 sq ft)",
  large: "Large (1,500–3,000 sq ft)",
  xl: "XL / Commercial (3,000+ sq ft)",
};

export const BUDGET_OPTIONS = [
  { value: "Not sure", label: "Not sure" },
  { value: "<$5k", label: "<$5k" },
  { value: "$5–15k", label: "$5–15k" },
  { value: "$15–30k", label: "$15–30k" },
  { value: "$30–60k", label: "$30–60k" },
  { value: "$60k+", label: "$60k+" },
] as const satisfies ReadonlyArray<{
  value: EstimateFormData["budget"];
  label: string;
}>;

export const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "This year",
  "Just planning",
  "Not sure yet",
] as const satisfies ReadonlyArray<Exclude<EstimateFormData["timeline"], "">>;

export const REFERRAL_SOURCES = [
  "Google Search",
  "Neighbour / Word of Mouth",
  "Facebook / Instagram",
  "Saw our yard sign",
  "Returning customer",
  "Not sure / don't remember",
  "Other",
] as const satisfies ReadonlyArray<Exclude<EstimateFormData["heardAbout"], "">>;

export const inputClassName =
  "min-w-0 w-full max-w-full border border-[#e8e2da] bg-[#f5f1eb] px-4 py-3.5 text-sm text-[#1a1714] outline-none transition-colors duration-200 placeholder:text-[#c5bdb5] hover:border-[#b8975a]/40 focus:border-[#b8975a] focus-visible:ring-2 focus-visible:ring-[#b8975a]/25 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400";

export const selectClassName = `${inputClassName} cursor-pointer appearance-none pr-11`;