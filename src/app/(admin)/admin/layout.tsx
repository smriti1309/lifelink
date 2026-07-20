'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Shield, LogOut, Menu, Droplet } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { adminLogoutAction } from '@/app/actions/admin-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // If viewing the /admin login page itself, do not render the sidebar layout
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminLogoutAction();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-20 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-extrabold text-base tracking-tight text-white hidden sm:inline">
                LifeLink Administration
              </span>
              <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 font-bold text-[10px] uppercase">
                Admin
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
