/**
 * Button primitive — shared actions across Letz Fetz UI.
 * Location: src/components/ui/Button.tsx
 */
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'accent';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-stone-200 text-stone-950 hover:bg-white focus-visible:ring-purple-500',
  secondary:
    'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700 focus-visible:ring-stone-500',
  ghost:
    'bg-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 focus-visible:ring-stone-500',
  danger:
    'bg-red-900/80 text-red-100 hover:bg-red-800 focus-visible:ring-red-500',
  success:
    'bg-emerald-700 text-emerald-50 hover:bg-emerald-600 focus-visible:ring-emerald-500',
  accent:
    'bg-purple-700 text-white hover:bg-purple-600 focus-visible:ring-purple-400',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
