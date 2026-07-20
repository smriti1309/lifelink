'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = 'Avatar', fallback, size = 'md', ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    
    const initials = React.useMemo(() => {
      if (fallback) return fallback.slice(0, 2).toUpperCase();
      if (!alt) return 'U';
      return alt
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }, [fallback, alt]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border border-border/40 bg-muted select-none",
          {
            "w-8 h-8 text-xs": size === 'sm',
            "w-10 h-10 text-sm": size === 'md',
            "w-14 h-14 text-lg": size === 'lg',
          },
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-bold text-muted-foreground bg-muted-foreground/10 uppercase">
            {initials}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
