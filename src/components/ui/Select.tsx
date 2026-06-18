/**
 * Unified select primitive.
 * Location: src/components/ui/Select.tsx
 */
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-400">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          className="w-full appearance-none rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 pr-8 text-sm text-stone-100 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">▾</span>
      </div>
    </label>
  );
}
