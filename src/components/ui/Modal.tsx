/**
 * Centered modal overlay primitive.
 * Location: src/components/ui/Modal.tsx
 */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  footer?: React.ReactNode;
  /** Optional actions in the header bar (left of Schließen). */
  headerActions?: React.ReactNode;
  /** Optional test id on the dialog root. */
  testId?: string;
  /** Extra classes for the scrollable body. */
  bodyClassName?: string;
  /**
   * When false, hide Schließen, ignore backdrop click and Escape.
   * Use for mandatory in-match choices (reaction / passives).
   */
  dismissible?: boolean;
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
  headerActions,
  testId,
  bodyClassName = '',
  dismissible = true,
}: ModalProps) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={dismissible ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid={testId}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-lg border border-stone-700 bg-stone-900 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-stone-800 px-4 py-3">
          <h3 className="min-w-0 flex-1 text-base font-semibold text-stone-100">{title}</h3>
          <div className="flex shrink-0 items-center gap-1">
            {headerActions}
            {dismissible ? (
              <Button
                variant="ghost"
                icon={<X className="h-4 w-4" />}
                onClick={onClose}
                className="px-2 py-2"
                aria-label="Schließen"
              />
            ) : null}
          </div>
        </div>
        <div className={`max-h-[70vh] overflow-y-auto p-4 ${bodyClassName}`.trim()}>{children}</div>
        {footer && <div className="border-t border-stone-800 px-4 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
