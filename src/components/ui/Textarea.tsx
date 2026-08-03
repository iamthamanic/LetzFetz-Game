/**
 * Multi-line text input primitive (styleguide Input sibling).
 * Location: src/components/ui/Textarea.tsx
 */
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-400">
          {label}
        </span>
      )}
      <textarea
        className={`w-full resize-y rounded-lg border bg-stone-900 px-3 py-2 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 ${
          error ? 'border-red-700' : 'border-stone-700'
        }`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
