// File: src/components/ui/FormInput.tsx
/**
 * What it does:
 * A reusable "dumb" wrapper for the <input> element.
 *
 * How it works:
 * - Receives props for 'label', 'name', 'value', etc.
 * - Renders a label and an input.
 * - This component is "uncontrolled" in the context of React Hook Form,
 * so it will be used with 'register'.
 *
 * How it connects:
 * - Will be used by 'IncidentForm.tsx' and 'LoginForm.tsx'.
 * - Note: The guide (Part 4) uses React Hook Form. This component
 * is designed to work with it using the 'spread' operator.
 */

import React from "react";

// We can get the '...rest' props by extending the standard HTML input props
type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string; // For React Hook Form errors
};

// Use React.forwardRef to allow React Hook Form to 'register' this component
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, error, required, ...rest }, ref) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-primary-color mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        ref={ref} // Pass the ref here
        className={`w-full p-3 h-12 form-input rounded-md ${
          error ? "border-red-500" : ""
        }`}
        {...rest} // Spread the rest of the props (type, value, onChange, etc.)
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
);

FormInput.displayName = "FormInput";
export default FormInput;