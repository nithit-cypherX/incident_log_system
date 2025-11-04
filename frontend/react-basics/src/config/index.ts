// File: src/config/index.ts
/**
 * What it does:
 * This file centralizes all environment variables for the application.
 *
 * How it works:
 * It reads from 'import.meta.env' (Vite's way of handling env vars)
 * and provides a single, typed 'config' object to the rest of the app.
 *
 * How it connects:
 * - 'apiClient.ts' will use 'config.apiUrl' to know where to send requests.
 * - Other parts of the app can use these values if needed.
 */

export const config = {
  /**
   * The base URL for the API.
   * Make sure to create a '.env.development' file in your project's
   * root folder and add:
   * VITE_API_URL=http://localhost:3000/api/v1
   */
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",

  /**
   * The name of your application.
   */
  appName: import.meta.env.VITE_APP_NAME || "FirePersona 5",

  /**
   * Flag for development mode.
   */
  isDevelopment: import.meta.env.DEV,

  /**
   * Flag for production mode.
   */
  isProduction: import.meta.env.PROD,
} as const; // 'as const' makes it read-only