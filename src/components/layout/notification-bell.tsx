'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { getPendingBloodRequestsCountAction } from '@/app/actions/donor';

export function NotificationBell() {
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      try {
        const count = await getPendingBloodRequestsCountAction();
        if (isMounted) {
          setPendingCount(count);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    // Initial fetch
    fetchCount();

    // Check periodically every 30 seconds for emergency requests updates
    const interval = setInterval(fetchCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all-300 flex items-center justify-center cursor-pointer"
      aria-label="View notifications"
    >
      <Bell className="w-5 h-5" />
      {pendingCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-extrabold text-white ring-2 ring-background animate-pulse">
          {pendingCount}
        </span>
      )}
    </Link>
  );
}
