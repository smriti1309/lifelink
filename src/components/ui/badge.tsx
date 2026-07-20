import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-all-300",
          {
            "bg-primary-light border-primary/20 text-primary": variant === 'primary',
            "bg-muted border-border text-muted-foreground": variant === 'secondary',
            "bg-success-light border-success/20 text-success": variant === 'success',
            "bg-warning-light border-warning/20 text-warning": variant === 'warning',
            "bg-destructive-light border-destructive/20 text-destructive": variant === 'destructive',
            "bg-transparent border-border text-foreground": variant === 'outline',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
