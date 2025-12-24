// File: src/features/auth/validators/loginSchema.ts
/**
 * What it does:
 * Defines the validation schema for the login form using Zod.
 *
 * How it works:
 * - Specifies that 'username' must be a string.
 * - Specifies that 'password' must be a string.
 * - 'z.infer' creates a TypeScript type from the schema.
 *
 * How it connects:
 * - 'LoginForm.tsx' imports this schema and 'LoginFormData' type
 * to use with React Hook Form.
 */

import { z } from "zod";

// 1. Define the validation rules
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// 2. Create a TypeScript type from the schema
export type LoginFormData = z.infer<typeof loginSchema>;