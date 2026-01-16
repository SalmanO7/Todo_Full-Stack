'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { authUtils } from '@/lib/auth';

import { useEffect, useState } from 'react';

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession(); // This returns { user, isLoading, isError }
  const status = session.isLoading ? 'loading' : (session.user ? 'authenticated' : 'unauthenticated');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await authUtils.logoutUser();
      // Refresh the page to update UI after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Don't render sensitive content until mounted to avoid SSR issues
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Todo Pro</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Todo Pro</span>
          </Link>

          {!session.isLoading && status === 'authenticated' && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/tasks" className="transition-colors hover:text-foreground/80 text-foreground">
                My Tasks
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {!session.isLoading && status === 'authenticated' && session.user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm font-medium">
                Welcome, {session.user.email?.split('@')[0] || session.user.email}
              </div>

              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {session.user.email?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}