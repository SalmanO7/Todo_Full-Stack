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

// Custom auth client for FastAPI JWT backend
const authClient = {
  // For a real implementation, you'd call your FastAPI login endpoint
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      // In a real implementation, you would call your FastAPI login endpoint
      // For demo purposes, we'll simulate successful login and create a mock token
      // Using a valid JWT structure for testing
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: email, // user id (using email as user id)
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));
      // Create a fake signature (in real app, this would come from server)
      const signature = btoa('fake_signature_for_demo');
      const mockToken = `${header}.${payload}.${signature}`;

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user_id', email);

      return {
        user: {
          id: email,
          email: email,
          name: email.split('@')[0]
        },
        session: {
          token: mockToken
        }
      };
    }
  },

  // For a real implementation, you'd call your FastAPI register endpoint
  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      // In a real implementation, you would call your FastAPI register endpoint
      // For demo purposes, we'll simulate successful registration
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: email, // user id (using email as user id)
        email: email,
        name: name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));
      // Create a fake signature (in real app, this would come from server)
      const signature = btoa('fake_signature_for_demo');
      const mockToken = `${header}.${payload}.${signature}`;

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user_id', email);

      return {
        user: {
          id: email,
          email: email,
          name: name
        },
        session: {
          token: mockToken
        }
      };
    }
  },

  signOut: async () => {
    // Clear auth-related storage items only
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user_id');
      localStorage.removeItem('better-auth.session_token'); // Clean up any Better Auth tokens if they exist

      // Trigger a storage event to notify other tabs/components of the change
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'auth_token',
        oldValue: localStorage.getItem('auth_token'),
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
          const token = localStorage.getItem('auth_token');

          if (token) {
            try {
              const decoded: JwtPayload = jwtDecode(token);

              // Check if token is expired
              const currentTime = Math.floor(Date.now() / 1000);
              if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('auth_token');
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
              localStorage.removeItem('auth_token');
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
 * Custom authentication utilities for FastAPI JWT backend
 */
export const authUtils = {
  /**
   * Sign in a user
   */
  async loginUser(email: string, password: string) {
    try {
      // In a real implementation, call the backend login API
      // For now, we'll create a proper JWT token structure
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: email, // user id (using email as user id)
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));
      // Create a fake signature (in real app, this would come from server)
      const signature = btoa('fake_signature_for_demo');
      const mockToken = `${header}.${payload}.${signature}`;

      // Store the token and user info in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user_id', email);

      // Trigger a storage event to notify other tabs/components of the change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'auth_token',
          oldValue: null,
          newValue: mockToken,
        }));
      }

      // Return a simulated response that matches the expected format
      return {
        user: {
          id: email,
          email: email,
          name: email.split('@')[0]
        },
        session: {
          token: mockToken
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Sign up a new user
   */
  async registerUser(name: string, email: string, password: string) {
    try {
      // In a real implementation, call the backend register API
      // For now, we'll create a proper JWT token structure
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: email, // user id (using email as user id)
        email: email,
        name: name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));
      // Create a fake signature (in real app, this would come from server)
      const signature = btoa('fake_signature_for_demo');
      const mockToken = `${header}.${payload}.${signature}`;

      // Store the token and user info in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user_id', email);

      // Trigger a storage event to notify other tabs/components of the change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'auth_token',
          oldValue: null,
          newValue: mockToken,
        }));
      }

      // Return a simulated response that matches the expected format
      return {
        user: {
          id: email,
          email: email,
          name: name
        },
        session: {
          token: mockToken
        }
      };
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
      await authClient.signOut();
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
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      try {
        // Attempt to decode the token to check if it's valid
        jwtDecode(token);
        // For placeholder tokens, just check existence
        // In real implementation, decode and check expiration
        return true;
      } catch {
        // If token can't be decoded, it's invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user_id');
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  /**
   * Get JWT token if available
   */
  getJwtToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
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
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Verify the token is valid by attempting to decode it
          jwtDecode(token);
        } catch {
          // If token is invalid, clear it and return null
          localStorage.removeItem('auth_token');
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
export const { useSession } = authClient;
export const { signIn, signOut, signUp } = authClient;