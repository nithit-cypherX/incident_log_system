// File: src/features/auth/services/authService.ts
/**
 * What it does:
 * Handles all API (network) requests related to authentication.
 *
 * How it works:
 * - Imports the central 'apiClient' from 'src/lib'.
 * - 'login' sends a POST request to the '/login' endpoint.
 * - 'logout' sends a POST request to the '/logout' endpoint.
 * - 'checkLogin' sends a GET request to '/check-login' to
 * see if the user's cookie is still valid.
 *
 * How it connects:
 * - 'AuthContext.tsx' imports and uses these functions.
 * - 'LoginPage.tsx' (via AuthContext) calls 'login'.
 * - 'NavBar.tsx' (via AuthContext) calls 'logout'.
 */

import apiClient from "../../../lib/apiClient";

// Define the shape of the User object returned by our API
export type User = {
  id: number;
  username: string;
  // Add any other user fields you have, e.g., email, role
};

export const authService = {
  /**
   * Attempts to log in the user.
   * 'apiClient' will throw an error if the request fails (e.g., 401).
   */
  login: async (username: string, password: string): Promise<User> => {
    // The 'data' is the user object from the response
    const { data } = await apiClient.post<{ success: boolean; user: User }>(
      "/login",
      {
        username,
        password,
      }
    );
    return data.user;
  },

  /**
   * Logs out the user on the server.
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/logout");
  },

  /**
   * Checks if the user has a valid session cookie.
   * Returns the user data if successful.
   */
  checkLogin: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/check-login");
    return data;
  },
};