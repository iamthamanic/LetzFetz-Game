/**
 * Button primitive — shared actions across Letz Fetz UI.
 * Location: src/components/ui/Button.tsx
 */
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white',
  secondary: 'bg-purple-800/50 text-white hover:bg-purple-800',
  ghost: 'text-purple-400 hover:text-purple-300 bg-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
};

export function Button({
  variant = 'primary',
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
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
