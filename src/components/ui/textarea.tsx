import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "w-full min-h-[100px] bg-white border border-border text-foreground placeholder-muted-foreground/60 text-sm rounded-lg px-4 py-2.5 outline-none transition-all-300 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y",
            {
              "border-destructive focus:border-destructive focus:ring-destructive/20": error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
