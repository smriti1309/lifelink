'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  AlertCircle,
  BarChart3,
  Droplet,
  ShieldCheck,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Donors',
      href: '/admin/donors',
      icon: HeartHandshake,
    },
    {
      title: 'Emergency Requests',
      href: '/admin/requests',
      icon: AlertCircle,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/admin/dashboard" onClick={onClose} className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-xl">
            <Droplet className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              Life<span className="text-primary">Link</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Admin Portal
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin Badge Banner */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Administrator Session</p>
          <p className="text-[11px] text-slate-400">Full Access Control</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Management Modules
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
        LifeLink Admin &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
}
