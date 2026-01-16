'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const session = useSession(); // This returns { user, isLoading, isError }

  useEffect(() => {
    if (session.isLoading) return; // Still loading

    if (session.user) {
      // User is authenticated, redirect to tasks page
      router.push('/tasks');
    } else {
      // User is not authenticated, redirect to sign in
      router.push('/signin');
    }
  }, [session, router]);

  // While redirecting, show a simple loading message
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}