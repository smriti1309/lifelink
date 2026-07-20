import * as React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}: ConfirmationDialogProps) {
  const footer = (
    <>
      <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button
        variant={isDestructive ? 'primary' : 'secondary'}
        className={cn({
          'bg-destructive hover:bg-destructive-hover focus:ring-destructive/40 text-white': isDestructive,
        })}
        size="sm"
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title} footer={footer}>
      <div className="flex gap-4 items-start">
        {isDestructive && (
          <div className="p-2 rounded-full bg-destructive-light text-destructive shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-foreground/85 leading-relaxed">{description}</p>
        </div>
      </div>
    </Modal>
  );
}
