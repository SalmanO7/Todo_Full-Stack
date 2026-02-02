import { createAuthClient } from "better-auth/client";

// Create the Better Auth client
export const { ClientProvider, signIn, signOut, useSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://salman907-backend-todo.hf.space",
  fetchOptions: {
    // Add any custom fetch options here if needed
  },
});