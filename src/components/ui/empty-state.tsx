import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionLoading?: boolean;
}

export function EmptyState({
  className,
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionLoading = false,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-10 border border-dashed border-border rounded-xl bg-muted/10 max-w-md mx-auto my-6 gap-4",
        className
      )}
      {...props}
    >
      <div className="p-4 rounded-full bg-muted text-muted-foreground/80 shrink-0">
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} isLoading={actionLoading} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
}
