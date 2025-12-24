// File: src/context/AuthContext.tsx
/**
 * What it does:
 * Creates a global 'AuthContext' to manage user authentication
 * state across the entire application (Guide Part 5).
 *
 * How it works:
 * - Creates a React Context.
 * - The 'AuthProvider' component wraps the app.
 * - It manages 'user' and 'isLoading' state.
 * - On load, it calls 'authService.checkLogin()' to see if a
 * user is already logged in (from a cookie).
 * - It provides 'login', 'logout', and 'checkLogin' functions
 * to its children.
 *
 * How it connects:
 * - 'main.tsx' wraps <App> in <AuthProvider>.
 * - 'useAuth.ts' is a hook to easily access this context.
 * - 'ProtectedRoute.tsx' uses this context to check 'isAuthenticated'.
 * - 'LoginPage.tsx' calls the 'login' function.
 * - 'MainLayout.tsx' (NavBar) can call 'logout' and display 'user.name'.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "../features/auth/services/authService";
import type { User } from "../features/auth/services/authService";

// Interface for the data/functions provided by the context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Is it checking auth?
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 1. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true

  /**
   * Checks if the user is already logged in (via cookie)
   * on application load.
   */
  const checkLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.checkLogin();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run the check on initial mount
  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  /**
   * Logs in the user and updates state.
   */
  const login = async (username: string, password: string) => {
    // Let the service handle the API call and error
    const loggedInUser = await authService.login(username, password);
    setUser(loggedInUser);
  };

  /**
   * Logs out the user and updates state.
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Export the context (for the hook)
export default AuthContext;