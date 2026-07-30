/**
 * Build workbench shell — sub-tabs Combinate | Development.
 * Location: src/features/build/BuildView.tsx
 */
import React, { useEffect, useState } from 'react';
import { Boxes, FlaskConical } from 'lucide-react';
import { Tabs, type TabItem } from '../../components/ui/Tabs';
import { BuildCombineView } from './BuildCombineView';
import { BuildDevelopmentView } from './BuildDevelopmentView';

export type BuildSubTab = 'combine' | 'development';

const BUILD_SUBTAB_KEY = 'letz-fetz:build-subtab';

interface BuildViewProps {
  /** True while the Build app tab is visible. */
  active: boolean;
}

const BUILD_SUB_TABS: TabItem[] = [
  {
    id: 'combine',
    label: 'Combinate',
    icon: <Boxes className="h-4 w-4 shrink-0" />,
    tone: 'sandbox',
  },
  {
    id: 'development',
    label: 'Development',
    icon: <FlaskConical className="h-4 w-4 shrink-0" />,
    tone: 'sandbox',
  },
];

function readInitialSubTab(): BuildSubTab {
  try {
    const v = sessionStorage.getItem(BUILD_SUBTAB_KEY);
    if (v === 'development' || v === 'combine') return v;
  } catch {
    /* ignore */
  }
  return 'combine';
}

export function BuildView({ active }: BuildViewProps) {
  const [subTab, setSubTab] = useState<BuildSubTab>(() => readInitialSubTab());

  useEffect(() => {
    try {
      sessionStorage.setItem(BUILD_SUBTAB_KEY, subTab);
    } catch {
      /* ignore */
    }
  }, [subTab]);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-stone-950 text-stone-100"
      data-testid="build-view"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.12),_transparent_55%)]" />

      <div className="relative z-10 flex flex-none items-center border-b border-stone-800/90 px-2 py-1.5 sm:px-3">
        <Tabs
          items={BUILD_SUB_TABS}
          active={subTab}
          onChange={(id) => setSubTab(id as BuildSubTab)}
          ariaLabel="Build-Bereich"
        />
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-hidden">
        {subTab === 'combine' ? (
          <BuildCombineView active={active} />
        ) : (
          <BuildDevelopmentView />
        )}
      </div>
    </div>
  );
}
