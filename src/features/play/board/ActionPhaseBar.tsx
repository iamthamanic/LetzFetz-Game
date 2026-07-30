/**
 * Action-phase footer — start action-select mode, then attack options / ultimate / skip.
 * Location: src/features/play/board/ActionPhaseBar.tsx
 */
import React from 'react';
import type { GameAction } from '../../../game';
import { Button } from '../../../components/ui/Button';
import type { PendingIntent } from './gameActionHelpers';

interface ActionPhaseBarProps {
  phase: string;
  pending: PendingIntent | null;
  /** Number of opponent bound cards that can be challenged with the selected attack. */
  challengeTargetCount: number;
  canPlayAction: boolean;
  canUltimate: boolean;
  canSkipMain: boolean;
  inputLocked?: boolean;
  /** When true, DE copy uses Großformel / Formel-Ziel wording. */
  v5Formula?: boolean;
  onStartAction: () => void;
  onDirectAttack: () => void;
  onChallenge: () => void;
  onCancel: () => void;
  onUltimate: () => void;
  onSkipMain: () => void;
}

const NO_ACTION_HINT =
  'Keine Aktionskarten auf der Hand — Angriff, Boost, Glitch oder Gegenstand nötig.';

export function ActionPhaseBar({
  phase,
  pending,
  challengeTargetCount,
  canPlayAction,
  canUltimate,
  canSkipMain,
  inputLocked = false,
  v5Formula = false,
  onStartAction,
  onDirectAttack,
  onChallenge,
  onCancel,
  onUltimate,
  onSkipMain,
}: ActionPhaseBarProps) {
  if (phase !== 'action') return null;

  const actionSelect = pending?.type === 'action-select';
  const attackPending = pending?.type === 'attack';
  const actionModeActive = actionSelect || attackPending;
  const selectedTarget =
    attackPending && pending.type === 'attack' ? pending.targetBoundInstanceId : undefined;
  const canChallenge =
    Boolean(attackPending) &&
    challengeTargetCount > 0 &&
    (Boolean(selectedTarget) || challengeTargetCount === 1);

  const ultimateLabel = v5Formula ? 'Großformel spielen' : 'Ultimativkarte spielen';
  const challengeHint =
    challengeTargetCount === 0
      ? 'Kein Herausforderungsziel verfügbar'
      : selectedTarget
        ? 'Herausforderung gegen das gewählte Ziel'
        : v5Formula
          ? 'Gegner-Formelkomponente als Ziel tippen'
          : 'Gegner-Engine-Karte als Ziel tippen';

  return (
    <div
      data-testid="action-phase-bar"
      className="flex flex-wrap items-center justify-center gap-2 sm:justify-end"
    >
      {!actionModeActive ? (
        <span className="inline-flex" title={!canPlayAction ? NO_ACTION_HINT : undefined}>
          <Button
            variant="primary"
            size="sm"
            disabled={inputLocked || !canPlayAction}
            onClick={onStartAction}
            data-testid="action-phase-start"
            aria-disabled={inputLocked || !canPlayAction}
            title={
              !canPlayAction
                ? NO_ACTION_HINT
                : 'Wähle eine Handkarte als Aktion (Angriff, Boost, Glitch oder Gegenstand)'
            }
          >
            Aktion spielen
          </Button>
        </span>
      ) : attackPending ? (
        <>
          <Button
            variant="primary"
            size="sm"
            disabled={inputLocked}
            title="Greift die Lebenspunkte des Gegners direkt an"
            onClick={onDirectAttack}
            data-testid="action-phase-direct-attack"
          >
            Direkt angreifen
          </Button>
          <Button
            variant="accent"
            size="sm"
            disabled={inputLocked || !canChallenge}
            title={challengeHint}
            onClick={onChallenge}
            data-testid="action-phase-challenge"
          >
            Herausfordern
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={inputLocked}
            onClick={onCancel}
            data-testid="action-phase-cancel"
          >
            Auswahl abbrechen
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          disabled={inputLocked}
          onClick={onCancel}
          data-testid="action-phase-cancel"
        >
          Auswahl abbrechen
        </Button>
      )}

      <Button
        variant="accent"
        size="sm"
        disabled={inputLocked || !canUltimate || actionModeActive}
        onClick={onUltimate}
        data-testid="action-phase-ultimate"
      >
        {ultimateLabel}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={inputLocked || !canSkipMain || actionModeActive}
        onClick={onSkipMain}
        data-testid="action-phase-skip"
      >
        Hauptaktion auslassen
      </Button>
    </div>
  );
}

export function actionPhaseLegalFlags(legalActions: GameAction[]): {
  canPlayAction: boolean;
  canUltimate: boolean;
  canSkipMain: boolean;
} {
  return {
    canPlayAction: legalActions.some(
      (a) =>
        a.type === 'PLAY_ATTACK' ||
        a.type === 'PLAY_BOOST' ||
        a.type === 'PLAY_GLITCH' ||
        a.type === 'PLAY_ITEM',
    ),
    canUltimate: legalActions.some((a) => a.type === 'PLAY_ULTIMATE'),
    canSkipMain: legalActions.some((a) => a.type === 'END_TURN'),
  };
}
