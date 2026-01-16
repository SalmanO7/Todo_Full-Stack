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
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHAiOjk5OTk5OTk5OTl9.JeTs2t66KJjR7Rr9z1i9y8qJ4E0r9v9t1v9w9x9y9z9';

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
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHAiOjk5OTk5OTk5OTl9.JeTs2t66KJjR7Rr9z1i9y8qJ4E0r9v9t1v9w9x9y9z9';

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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user_id');

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
              localStorage.removeItem('auth_token');
              localStorage.removeItem('current_user_id');
              setSession({ user: null, isLoading: false, isError: true });
            }
          } else {
            setSession({ user: null, isLoading: false, isError: false });
          }
        } catch (error) {
          console.error('Session check error:', error);
          setSession({ user: null, isLoading: false, isError: true });
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
      // For our mock implementation, we'll create a JWT token that matches the backend expectations
      // This creates a JWT with HS256 algorithm and proper claims
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: email, // user id (using email as user id)
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }));

      // Create a fake signature (normally this would require the actual secret)
      // For dev/testing purposes, we'll use a placeholder that will be replaced by a real token when connected to backend
      const fakeSignature = 'PLACEHOLDER_SIGNATURE';
      const mockToken = `${header}.${payload}.${fakeSignature}`;

      // Store the token and user info in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user_id', email);

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
      // For our mock implementation, we'll simulate registration by creating a token
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6ImVtYWlsIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      // Store the token and user info in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user_id', email);

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
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return !!(decoded.exp && decoded.exp >= currentTime);
      } catch {
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