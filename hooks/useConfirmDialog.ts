'use client';

import { useCallback, useRef, useState } from 'react';
import type { ConfirmDialogProps } from '@/components/ui/confirm-dialog';

export type ConfirmDialogRequest = Pick<
  ConfirmDialogProps,
  | 'title'
  | 'description'
  | 'confirmLabel'
  | 'cancelLabel'
  | 'variant'
  | 'disabled'
>;

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<ConfirmDialogRequest | null>(null);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmDialogRequest): Promise<boolean> => {
    setRequest(options);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) {
      resolveRef.current?.(false);
      resolveRef.current = null;
      setRequest(null);
    }
    setOpen(next);
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    resolveRef.current = null;
    setOpen(false);
    setRequest(null);
  }, []);

  const dialogProps: ConfirmDialogProps | null = request
    ? {
        open,
        onOpenChange: handleOpenChange,
        onConfirm: handleConfirm,
        title: request.title,
        description: request.description,
        confirmLabel: request.confirmLabel,
        cancelLabel: request.cancelLabel,
        variant: request.variant,
        disabled: request.disabled,
      }
    : null;

  return { confirm, dialogProps };
}
