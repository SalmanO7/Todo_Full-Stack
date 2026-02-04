'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const session = useSession(); // This returns { user, isLoading, isError }
  const isAuthenticated = !session.isLoading && session.user && session.user.user_id;

  useEffect(() => {
    // Log for debugging
    console.log('ProtectedRoute - session:', session);

    if (!session.isLoading && !isAuthenticated) {
      // Redirect to sign in if not authenticated
      console.log('Redirecting to signin - user not authenticated');
      router.push('/signin');
    } else if (isAuthenticated) {
      console.log('User is authenticated, allowing access to protected route');
    }
  }, [session, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (session.isLoading) {
    console.log('ProtectedRoute - Loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  // If user is authenticated, render the children
  if (isAuthenticated) {
    console.log('Rendering protected content');
    return <>{children}</>;
  }

  // If not authenticated, return null while redirect happens in useEffect
  console.log('User not authenticated, returning null');
  return null;
}