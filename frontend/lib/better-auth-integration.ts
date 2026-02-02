import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // This is already added to package.json

// Define types for our auth system
interface User {
  user_id: string;
  email?: string;
}

interface Session {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
}

// Types for session management
export interface AuthToken {
  token: string;
  userId: string;
  expiresAt: number;
}

// JWT Token interface for decoding
interface JwtPayload {
  sub: string; // subject (user id)
  email?: string;
  exp?: number; // expiration time
  iat?: number; // issued at time
}

// Better Auth API endpoints
const BETTER_AUTH_BASE_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://salman907-backend-todo.hf.space';

// Better Auth client implementation
const betterAuthClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      // Call Better Auth login endpoint
      const response = await fetch(`${BETTER_AUTH_BASE_URL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();

      // Store the session token from Better Auth
      if (result.session?.token) {
        localStorage.setItem('better-auth.session_token', result.session.token);

        // Decode the token to get user info
        try {
          const decoded: JwtPayload = jwtDecode(result.session.token);
          localStorage.setItem('current_user_id', decoded.sub);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      return result;
    }
  },

  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      // Call Better Auth register endpoint
      const response = await fetch(`${BETTER_AUTH_BASE_URL}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();

      // Store the session token from Better Auth
      if (result.session?.token) {
        localStorage.setItem('better-auth.session_token', result.session.token);

        // Decode the token to get user info
        try {
          const decoded: JwtPayload = jwtDecode(result.session.token);
          localStorage.setItem('current_user_id', decoded.sub);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      return result;
    }
  },

  signOut: async () => {
    // Call Better Auth signout endpoint
    const token = localStorage.getItem('better-auth.session_token');

    if (token) {
      await fetch(`${BETTER_AUTH_BASE_URL}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).catch(() => {}); // Ignore errors during signout
    }

    // Clear auth-related storage items
    if (typeof window !== 'undefined') {
      localStorage.removeItem('better-auth.session_token');
      localStorage.removeItem('current_user_id');
      localStorage.removeItem('auth_token'); // Remove legacy token

      // Trigger a storage event to notify other tabs/components of the change
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'better-auth.session_token',
        oldValue: localStorage.getItem('better-auth.session_token'),
        newValue: null,
      }));
    }

    return {};
  },

  useSession: (): Session => {
    const [session, setSession] = useState<Session>({
      user: null,
      isLoading: true,
      isError: false
    });

    useEffect(() => {
      const checkSession = () => {
        try {
          const token = localStorage.getItem('better-auth.session_token');

          if (token) {
            try {
              const decoded: JwtPayload = jwtDecode(token);

              // Check if token is expired
              const currentTime = Math.floor(Date.now() / 1000);
              if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('better-auth.session_token');
                localStorage.removeItem('current_user_id');
                setSession({ user: null, isLoading: false, isError: false });
                return;
              }

              const userId = localStorage.getItem('current_user_id') || decoded.sub;

              setSession({
                user: {
                  user_id: userId,
                  email: decoded.email
                },
                isLoading: false,
                isError: false
              });
            } catch (decodeError) {
              console.error('Token decode error:', decodeError);
              // Clear invalid tokens to prevent repeated errors
              localStorage.removeItem('better-auth.session_token');
              localStorage.removeItem('current_user_id');
              setSession({ user: null, isLoading: false, isError: false }); // Don't set isError to true to avoid UI issues
            }
          } else {
            setSession({ user: null, isLoading: false, isError: false });
          }
        } catch (error) {
          console.error('Session check error:', error);
          setSession({ user: null, isLoading: false, isError: false }); // Don't set isError to true to avoid UI issues
        }
      };

      checkSession();

      // Check session when storage changes
      const handleStorageChange = () => checkSession();
      window.addEventListener('storage', handleStorageChange);

      return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return session;
  }
};

/**
 * Better Auth utilities for integration with backend
 */
export const authUtils = {
  /**
   * Sign in a user with Better Auth
   */
  async loginUser(email: string, password: string) {
    try {
      const response = await fetch(`${BETTER_AUTH_BASE_URL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();

      // Store the session token from Better Auth
      if (result.session?.token) {
        localStorage.setItem('better-auth.session_token', result.session.token);

        // Decode the token to get user info
        try {
          const decoded: JwtPayload = jwtDecode(result.session.token);
          localStorage.setItem('current_user_id', decoded.sub);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Sign up a new user with Better Auth
   */
  async registerUser(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${BETTER_AUTH_BASE_URL}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();

      // Store the session token from Better Auth
      if (result.session?.token) {
        localStorage.setItem('better-auth.session_token', result.session.token);

        // Decode the token to get user info
        try {
          const decoded: JwtPayload = jwtDecode(result.session.token);
          localStorage.setItem('current_user_id', decoded.sub);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  async logoutUser() {
    try {
      await betterAuthClient.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('better-auth.session_token');
      if (!token) return false;

      try {
        // Attempt to decode the token to check if it's valid
        const decoded: JwtPayload = jwtDecode(token);

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem('better-auth.session_token');
          localStorage.removeItem('current_user_id');
          return false;
        }

        return true;
      } catch {
        // If token can't be decoded, it's invalid
        localStorage.removeItem('better-auth.session_token');
        localStorage.removeItem('current_user_id');
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  /**
   * Get Better Auth token if available
   */
  getBetterAuthToken(): string | null {
    try {
      return localStorage.getItem('better-auth.session_token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  /**
   * Get current user ID from session
   */
  getCurrentUserId(): string | null {
    try {
      // First check if we have a valid token
      const token = localStorage.getItem('better-auth.session_token');
      if (token) {
        try {
          const decoded: JwtPayload = jwtDecode(token);

          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem('better-auth.session_token');
            localStorage.removeItem('current_user_id');
            return null;
          }

          return decoded.sub;
        } catch {
          // If token is invalid, clear it and return null
          localStorage.removeItem('better-auth.session_token');
          localStorage.removeItem('current_user_id');
          return null;
        }
      }

      return localStorage.getItem('current_user_id');
    } catch (error) {
      console.error('Get user ID error:', error);
      return null;
    }
  },
};

// Export the auth hooks and methods
export const { useSession } = betterAuthClient;
export const { signIn, signOut, signUp } = betterAuthClient;