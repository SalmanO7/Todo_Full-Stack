'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const sessionQuery = useSession(); // This returns { user, isLoading, isError }
  const session = sessionQuery;
  const status = session.isLoading ? 'loading' : (session.user ? 'authenticated' : 'unauthenticated');

  useEffect(() => {
    if (!session.isLoading && !session.user) {
      // Redirect to sign in if not authenticated
      router.push('/signin');
    }
  }, [session, router]);

  // Show loading state while checking authentication
  if (session.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  // If user is authenticated, render the children
  if (session.user) {
    return <>{children}</>;
  }

  // If not authenticated, return null while redirect happens in useEffect
  return null;
}