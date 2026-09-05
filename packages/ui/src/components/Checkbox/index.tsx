import React from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${
          checked
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {label && <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>}
    </label>
  );
}

export default Checkbox;