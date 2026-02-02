// lib/auth.ts - Better Auth integration for frontend

import { useSession, signIn, signOut } from './better-auth-client';
import { jwtDecode } from 'jwt-decode';

// Define types for our auth system
interface User {
  $id: string; // Better Auth uses $id for user ID
  email?: string;
  name?: string;
}

interface Session {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
}

// JWT Token interface for decoding
interface JwtPayload {
  sub: string; // subject (user id)
  email?: string;
  name?: string;
  exp?: number; // expiration time
  iat?: number; // issued at time
}

// Export the session hook
export { useSession };

/**
 * Authentication utilities for Better Auth integration
 */
export const authUtils = {
  /**
   * Sign in a user with Better Auth
   */
  async loginUser(email: string, password: string) {
    try {
      const result = await signIn('email', {
        email,
        password,
        redirectTo: '/tasks', // Redirect after successful login
      });

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
      const result = await signIn('email', {
        email,
        password,
        name, // Include name for registration
        isSignUp: true, // This tells Better Auth this is a sign-up request
        redirectTo: '/tasks', // Redirect after successful registration
      });

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
      await signOut();
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
      // First check if we have a valid Better Auth token
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

      // Fallback to stored user ID
      return localStorage.getItem('current_user_id');
    } catch (error) {
      console.error('Get user ID error:', error);
      return null;
    }
  },
};

// Export the signIn and signOut functions
export { signIn, signOut };