import type { QuoteRequestInput } from "@/features/contact/types";
import type { ServiceName } from "@/features/services/types";

export interface EstimateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  serviceType: string;
  projectSize: QuoteRequestInput["project_size"];
  budget: QuoteRequestInput["budget"];
  timeline: QuoteRequestInput["timeline"];
  description: string;
  heardAbout: QuoteRequestInput["heard_about"];
  files: QuoteRequestInput["photos"];
  consent: boolean;
}

export type EstimateField = keyof EstimateFormData;

export type EstimateErrors = Partial<
  Record<EstimateField | "form", string>
>;

export type SetEstimateField = <Field extends EstimateField>(
  field: Field,
  value: EstimateFormData[Field],
) => void;

export interface EstimateFormProps {
  services: readonly ServiceName[];
}