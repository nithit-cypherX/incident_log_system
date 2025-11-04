// File: src/features/auth/components/LoginForm.tsx
/**
 * What it does:
 * Renders the login form UI. This is a "dumb" component
 * (or "presentational" component).
 *
 * How it works:
 * - Uses 'React Hook Form' (useForm) and 'Zod' (zodResolver)
 * to manage form state and validation.
 * - It receives an 'onSubmit' function as a prop.
 * - It does NOT know how to log in; it just reports the
 * form data (username, password) when the user submits.
 * - It displays errors from 'formState.errors'.
 *
 * How it connects:
 * - 'LoginPage.tsx' (the smart page) renders this component
 * and provides the 'onSubmit' function.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import type { LoginFormData } from "../validators/loginSchema";
import { loginSchema} from "../validators/loginSchema";
import FormInput from "../../../components/ui/FormInput";

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void; // A function to call on success
  isSubmitting: boolean; // Prop to show loading state
};

export const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Username Input */}
      <FormInput
        label="Username"
        type="text"
        id="username"
        placeholder="Enter your username"
        // 'register' connects this input to React Hook Form
        {...register("username")}
        // 'errors' provides the validation error message
        error={errors.username?.message}
      />

      {/* Password Input */}
      <div className="relative">
        <FormInput
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-[#ADB5BD] hover:text-white"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#DC3545] hover:bg-red-700 text-white font-bold h-14 text-lg py-3 px-4 rounded-md transition-colors duration-300 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};