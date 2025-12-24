// File: src/components/ui/FormSelect.tsx
/**
 * What it does:
 * A reusable "dumb" wrapper for the <select> element.
 *
 * How it works:
 * - Renders a label and a select with children.
 * - Designed to be used with React Hook Form's 'register'.
 *
 * How it connects:
 * - Will be used by 'IncidentForm.tsx'.
 */
import React from "react";

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
  error?: string; // For React Hook Form errors
};

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, name, children, error, required, ...rest }, ref) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-primary-color mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        ref={ref}
        className={`w-full p-3 h-12 form-input rounded-md ${
          error ? "border-red-500" : ""
        }`}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
);

FormSelect.displayName = "FormSelect";
export default FormSelect;