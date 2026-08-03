/**
 * Centered modal overlay primitive.
 * Location: src/components/ui/Modal.tsx
 */
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  footer?: React.ReactNode;
  /** Optional test id on the dialog root. */
  testId?: string;
  /** Extra classes for the scrollable body. */
  bodyClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  full: 'max-w-[min(96vw,72rem)]',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  testId,
  bodyClassName = '',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid={testId}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-lg border border-stone-700 bg-stone-900 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-800 px-4 py-3">
          <h3 className="text-base font-semibold text-stone-100">{title}</h3>
          <Button
            variant="ghost"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            className="px-2 py-2"
            aria-label="Schließen"
          />
        </div>
        <div className={`max-h-[70vh] overflow-y-auto p-4 ${bodyClassName}`.trim()}>
          {children}
        </div>
        {footer && <div className="border-t border-stone-800 px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}
