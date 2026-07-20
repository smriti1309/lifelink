import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  retryLoading?: boolean;
}

export function ErrorState({
  className,
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
  retryLoading = false,
  ...props
}: ErrorStateProps) {
  return (
    <Card className={cn("max-w-md mx-auto my-6 border-destructive/20 bg-destructive-light/5", className)} {...props}>
      <CardContent className="flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="p-3 rounded-full bg-destructive-light text-destructive shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-bold text-destructive">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            size="sm"
            onClick={onRetry}
            isLoading={retryLoading}
          >
            {retryText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
