// File: src/lib/apiClient.ts
/**
 * What it does:
 * Creates a central 'apiClient' for all HTTP requests.
 * This is a core pattern from the guide (Part 3).
 *
 * How it works:
 * - Uses 'axios' to create an instance with a base URL and default settings.
 * - Automatically includes credentials (cookies) with every request.
 * - (This is where you would add interceptors for auth tokens,
 * as shown in the guide. For now, we just use 'withCredentials'
 * which matches your current 'fetch' setup).
 *
 * How it connects:
 * - All 'service' files (e.g., authService, incidentService) will
 * import this 'apiClient' instead of using 'fetch'.
 * - It gets the 'apiUrl' from 'src/config/index.ts'.
 */

import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  /**
   * The base URL for all API requests.
   */
  baseURL: config.apiUrl,

  /**
   * Tells 'axios' to automatically send and receive cookies.
   * This is critical for session-based authentication.
   */
  withCredentials: true,

  /**
   * Default timeout for requests (10 seconds).
   */
  timeout: 10000,

  /**
   * Default headers.
   */
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * --- Interceptors (From the Guide) ---
 *
 * This is where you would add interceptors to automatically handle
 * auth tokens or 401 errors.
 *
 * For example, if you used JWT tokens:
 *
 * apiClient.interceptors.request.use((config) => {
 * const token = localStorage.getItem('accessToken');
 * if (token) {
 * config.headers.Authorization = `Bearer ${token}`;
 * }
 * return config;
 * });
 *
 * Your current app uses cookie-based sessions, so 'withCredentials: true'
 * handles this automatically!
 */

export default apiClient;