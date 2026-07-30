/**
 * Material Formeln play-bridge actions — deck opt-in + recipe activation.
 * Location: src/features/forge/components/FormulaPlayOptInActions.tsx
 */
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, Layers, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import type { ForgeCardData } from '../model/types';
import {
  formulaRoleFromCard,
  isKombinationForgeCard,
} from '../model/formulaRoles';
import type { FormulaBausteinRole } from '../../../game/packs/formulaPlayOverlayTypes';
import {
  FORMULA_PLAY_OPTIN_UPDATED_EVENT,
  activateFormulaRecipe,
  activatedRecipeFreshness,
  addBausteinToPlayDeck,
  deckOptInFreshness,
  getActivatedRecipe,
  getDeckOptIn,
} from '../../../services/storage/formulaPlayOptIn';
import {
  resolveBausteinCurrentVersion,
  resolveRecipeVersionSnapshot,
} from '../../../services/storage/formulaPlayVersions';
import { readVfxRegistryFormulaRecipeSummaries } from '../../../services/storage/vfxRegistryBridge';

const ROLE_TO_ENGINE: Record<string, FormulaBausteinRole> = {
  Technik: 'technik',
  Essenz: 'essenz',
  Katalysator: 'katalysator',
};

interface FormulaPlayOptInActionsProps {
  card: ForgeCardData;
}

export function FormulaPlayOptInActions({ card }: FormulaPlayOptInActionsProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1);
    window.addEventListener(FORMULA_PLAY_OPTIN_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(FORMULA_PLAY_OPTIN_UPDATED_EVENT, refresh);
  }, []);

  void tick;

  if (card.type !== 'Formula') return null;

  if (isKombinationForgeCard(card)) {
    return <KombinationActivateActions card={card} />;
  }

  const roleLabel = formulaRoleFromCard(card);
  const engineRole = roleLabel ? ROLE_TO_ENGINE[roleLabel] : undefined;
  if (!engineRole) return null;

  return <BausteinDeckActions card={card} role={engineRole} />;
}

function BausteinDeckActions({
  card,
  role,
}: {
  card: ForgeCardData;
  role: FormulaBausteinRole;
}) {
  const currentVersion = resolveBausteinCurrentVersion(card.id);
  const entry = getDeckOptIn(card.id);
  const freshness = deckOptInFreshness(entry, currentVersion);
  const isInBasePack = card.fromPack === true;

  const handleAdd = () => {
    addBausteinToPlayDeck({
      cardId: card.id,
      role,
      name: card.name || 'Unbenannt',
      pinnedVersion: currentVersion,
    });
  };

  return (
    <div
      className="mt-3 space-y-2 rounded-lg border border-stone-700/70 bg-stone-900/50 p-3"
      data-testid="formula-deck-opt-in-panel"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Layers className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
        <span className="text-xs font-medium text-stone-200">Spieldeck</span>
        {freshness === 'fresh' ? (
          <Badge variant="success" className="normal-case">
            Im Spieldeck
          </Badge>
        ) : null}
        {freshness === 'outdated' ? (
          <Badge variant="warning" className="normal-case">
            OUTDATED
          </Badge>
        ) : null}
      </div>

      {freshness === 'outdated' ? (
        <p
          className="flex items-start gap-1.5 text-xs text-amber-200/90"
          data-testid="formula-deck-outdated-warning"
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Neuere Authoring-Version verfügbar — erneut zum Spieldeck hinzufügen, um die
          Version zu aktualisieren.
        </p>
      ) : null}

      <p className="text-xs text-stone-400">
        {isInBasePack
          ? 'V5-Baustein — im Standard-Spieldeck enthalten. Opt-in pinnt die Version für OUTDATED-Warnungen.'
          : 'Studio-Baustein — wird über ein lokales Pack-Overlay ins Solo-Spieldeck gemerged.'}
      </p>

      <Button
        variant={freshness === 'outdated' ? 'accent' : 'secondary'}
        size="sm"
        icon={
          freshness === 'fresh' ? (
            <Check className="h-4 w-4" />
          ) : (
            <Layers className="h-4 w-4" />
          )
        }
        onClick={handleAdd}
        data-testid="formula-add-to-deck"
        className="w-full sm:w-auto"
      >
        {freshness === 'outdated'
          ? 'Erneut zum Spieldeck hinzufügen'
          : freshness === 'fresh'
            ? 'Version aktualisieren'
            : 'Zum Spieldeck hinzufügen'}
      </Button>
    </div>
  );
}

function KombinationActivateActions({ card }: { card: ForgeCardData }) {
  const recipe = readVfxRegistryFormulaRecipeSummaries().find((r) => r.id === card.id);
  const snapshot = resolveRecipeVersionSnapshot(card.id);
  const entry = getActivatedRecipe(card.id);
  const freshness = activatedRecipeFreshness(entry, snapshot);

  const handleActivate = () => {
    if (!recipe) return;
    activateFormulaRecipe({
      recipeId: recipe.id,
      name: recipe.name,
      pinnedRecipeVersion: recipe.version,
      techniqueId: recipe.techniqueId,
      essenceId: recipe.essenceId,
      catalystId: recipe.catalystId,
      techniqueVersion: recipe.techniqueVersion,
      essenceVersion: recipe.essenceVersion,
      catalystVersion: recipe.catalystVersion,
    });
  };

  return (
    <div
      className="mt-3 space-y-2 rounded-lg border border-purple-800/50 bg-purple-950/20 p-3"
      data-testid="formula-recipe-activate-panel"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-purple-300" aria-hidden />
        <span className="text-xs font-medium text-stone-200">Feld-Rezept</span>
        {freshness === 'fresh' ? (
          <Badge variant="accent" className="normal-case">
            Aktiviert
          </Badge>
        ) : null}
        {freshness === 'outdated' ? (
          <Badge variant="warning" className="normal-case">
            OUTDATED
          </Badge>
        ) : null}
      </div>

      {freshness === 'outdated' ? (
        <p
          className="flex items-start gap-1.5 text-xs text-amber-200/90"
          data-testid="formula-recipe-outdated-warning"
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Kombination oder Bausteine wurden überarbeitet — erneut aktivieren, um die
          Feld-Vorlage zu aktualisieren.
        </p>
      ) : null}

      <p className="text-xs text-stone-400">
        Aktiviert eine Feld-Rezept-Vorlage auf dem Formelbrett — wird nie als Handkarte gezogen.
      </p>

      <Button
        variant={freshness === 'missing' ? 'accent' : 'secondary'}
        size="sm"
        icon={<Sparkles className="h-4 w-4" />}
        onClick={handleActivate}
        disabled={!recipe}
        data-testid="formula-activate-recipe"
        className="w-full sm:w-auto"
      >
        {freshness === 'outdated'
          ? 'Kombination erneut aktivieren'
          : freshness === 'fresh'
            ? 'Aktivierung aktualisieren'
            : 'Kombination aktivieren'}
      </Button>
    </div>
  );
}
