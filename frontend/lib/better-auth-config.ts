import { betterAuth } from "better-auth/react";
import { QueryClient } from "@tanstack/react-query";

// Initialize Better Auth client
export const { ClientProvider, useSession, signIn, signOut } = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://salman907-backend-todo.hf.space",
  fetchOptions: {
    // Add any custom fetch options here if needed
  },
});

// Create a query client for TanStack Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});