'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplet, Menu, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { NotificationBell } from '../layout/notification-bell';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const navLinks = [
    { label: 'Find Donors', href: ROUTES.PUBLIC.FIND_DONORS },
    { label: 'Emergency Requests', href: ROUTES.PUBLIC.REQUESTS },
    ...(user ? [
      { label: 'Request Blood', href: ROUTES.AUTH.NEW_REQUEST },
      { label: 'My Requests', href: ROUTES.AUTH.MY_REQUESTS },
    ] : []),
    { label: 'FAQ', href: ROUTES.PUBLIC.FAQ },
    { label: 'About Us', href: ROUTES.PUBLIC.ABOUT },
  ];

  return (
    <header className="sticky top-0 z-45 w-full border-b border-border/40 glassmorphism shadow-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 text-primary hover:opacity-90 transition-all-300">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Droplet className="w-6 h-6 fill-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Life<span className="text-primary">Link</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-all-300",
                  {
                    "text-primary hover:text-primary-hover font-semibold": pathname === link.href,
                  }
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <Link href={ROUTES.AUTH.DASHBOARD}>
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout} 
                  isLoading={isLoggingOut}
                >
                  {isLoggingOut ? 'Signing Out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.PUBLIC.LOGIN}>
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href={ROUTES.PUBLIC.REGISTER}>
                  <Button size="sm">Become a Donor</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {user && <NotificationBell />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all-300 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-white px-4 pt-2 pb-4 space-y-2 animate-fade-in shadow-premium-lg">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all-300",
                  {
                    "bg-primary-light text-primary hover:bg-primary-light hover:text-primary": pathname === link.href,
                  }
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <hr className="border-border/60 my-2" />
          <div className="flex flex-col gap-2 px-3 pt-2">
            {user ? (
              <>
                <Link href={ROUTES.AUTH.DASHBOARD} onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={handleLogout} 
                  isLoading={isLoggingOut}
                >
                  {isLoggingOut ? 'Signing Out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.PUBLIC.LOGIN} onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="ghost" size="sm" className="w-full">Log In</Button>
                </Link>
                <Link href={ROUTES.PUBLIC.REGISTER} onClick={() => setIsOpen(false)} className="w-full">
                  <Button size="sm" className="w-full">Become a Donor</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
