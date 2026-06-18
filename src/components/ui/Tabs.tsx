/**
 * Horizontal tab navigation primitive.
 * Location: src/components/ui/Tabs.tsx
 */
import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, active, onChange }: TabsProps) {
  return (
    <nav className="flex items-center gap-1 rounded-lg bg-stone-900/80 p-1 border border-stone-800">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
