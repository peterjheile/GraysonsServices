import { BUDGET_OPTIONS } from "./constants";
import type { EstimateFormData } from "./types";
import type { ReactNode } from "react";

interface BudgetSliderProps {
  value: EstimateFormData["budget"];
  disabled?: boolean;
  onChange: (value: EstimateFormData["budget"]) => void;
}

export default function BudgetSlider({
  value,
  disabled = false,
  onChange,
}: BudgetSliderProps) {
  const currentIndex = Math.max(
    0,
    BUDGET_OPTIONS.findIndex((option) => option.value === value),
  );
  const progress = (currentIndex / (BUDGET_OPTIONS.length - 1)) * 100;

  return (
    <FormFieldShell label={`Approximate Budget (optional) — ${value}`}>
      <div className="pt-2">
        <input
          id="budget"
          name="budget"
          type="range"
          min={0}
          max={BUDGET_OPTIONS.length - 1}
          step={1}
          value={currentIndex}
          disabled={disabled}
          aria-valuetext={value}
          className="h-[2px] w-full cursor-pointer appearance-none bg-[#e8e2da] accent-[#b8975a] disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: `linear-gradient(to right, #b8975a ${progress}%, #e8e2da ${progress}%)`,
          }}
          onChange={(event) => {
            const option = BUDGET_OPTIONS[Number(event.currentTarget.value)];

            if (option) {
              onChange(option.value);
            }
          }}
        />

        <div className="mt-2 grid grid-cols-6" aria-hidden="true">
          {BUDGET_OPTIONS.map((option, index) => (
            <span
              key={option.value}
              className={`text-[9px] tracking-wide ${
                index === currentIndex
                  ? "font-semibold text-[#b8975a]"
                  : "text-[#c5bdb5]"
              } ${
                index === 0
                  ? "text-left"
                  : index === BUDGET_OPTIONS.length - 1
                    ? "text-right"
                    : "text-center"
              }`}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>
    </FormFieldShell>
  );
}

function FormFieldShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor="budget"
        className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#a39890]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}