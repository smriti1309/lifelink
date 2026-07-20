import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, icon, trailingIcon, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none select-none">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-white border border-border text-foreground placeholder-muted-foreground/60 text-sm rounded-lg px-4 py-2.5 outline-none transition-all-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
              {
                "pl-10": icon,
                "pr-10": trailingIcon,
                "border-destructive focus:border-destructive focus:ring-destructive/20": error,
              },
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3 text-muted-foreground">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
