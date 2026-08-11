import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  optional?: boolean;
}

export default function FormField({
  id,
  label,
  children,
  error,
  optional = false,
}: FormFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]"
      >
        {label}
        {optional && <span className="sr-only"> (optional)</span>}
      </label>

      {children}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-[10px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}