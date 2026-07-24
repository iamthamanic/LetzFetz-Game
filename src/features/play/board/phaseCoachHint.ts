/**
 * Derives German phase-coach hint text from engine-legal actions (no rule duplication).
 * Location: src/features/play/board/phaseCoachHint.ts
 */
import type { GameState } from '../../../game';
import type { PendingIntent } from './gameActionHelpers';
import type { GameViewModel } from './buildGameViewModel';

export interface PhaseCoachContext {
  state: GameState;
  view: GameViewModel;
  pending: PendingIntent | null;
  botThinking: boolean;
}

export function buildPhaseCoachHint({
  state,
  view,
  pending,
  botThinking,
}: PhaseCoachContext): string {
  if (state.winner) {
    return 'Partie beendet.';
  }

  if (view.isHumanDefender && view.combat) {
    if (view.combat.mode === 'challenge') {
      return 'Blockiere die Herausforderung oder „Nicht blocken“ — Würfel erst danach.';
    }
    return 'Blockiere den Angriff oder „Nicht blocken“ — Würfel erst danach.';
  }

  if (state.pendingChoice?.type === 'must-discard') {
    return 'Wirf 1 Handkarte ab — tippe die Karte an, die du ablegen willst.';
  }
  if (state.pendingChoice?.type === 'optional-draw-discard') {
    return 'Ziehe zuerst (Arena), danach wirfst du 1 Handkarte ab.';
  }

  if (pending?.type === 'action-select') {
    return 'Wähle eine Aktionskarte auf der Hand — Angriff, Boost oder Glitch.';
  }
  if (pending?.type === 'attack') {
    const hasTargets = view.botBoundSlots.some((s) => s.isTargetable);
    if (hasTargets) {
      return pending.targetBoundInstanceId
        ? 'Ziel gewählt — unten „Herausfordern“ oder „Direkt angreifen“.'
        : 'Gegner-Engine antippen als Ziel, dann unten „Herausfordern“ — oder „Direkt angreifen“.';
    }
    return 'Kein Herausforderungsziel — unten „Direkt angreifen“ gegen die LP des Gegners.';
  }
  if (pending?.type === 'build-select') {
    return 'Wähle eine baubare Handkarte — Glitch-Karten sind ausgegraut.';
  }
  if (pending?.type === 'build') {
    const hasFreeSlot = view.humanBoundSlots.some((s) => !s.instanceId);
    if (hasFreeSlot) {
      return 'Klicke auf einen freien Engine-Slot, um die Karte zu bauen.';
    }
    return 'Wähle eine gebaute Karte, die durch die neue Karte ersetzt werden soll.';
  }
  if (pending?.type === 'activate') {
    return 'Wähle eine Handkarte zum Abwerfen für die Aktivierung.';
  }

  if (!view.isHumanTurn) {
    return botThinking ? 'Gegner denkt…' : 'Warte auf den Gegner.';
  }

  const legal = view.legalActions;

  switch (state.phase) {
    case 'start':
      return legal.some((a) => a.type === 'ADVANCE_PHASE')
        ? 'Starte deinen Zug.'
        : 'Startphase — warte auf den nächsten Schritt.';
    case 'draw':
      return legal.some((a) => a.type === 'ADVANCE_PHASE')
        ? 'Ziehe eine Karte vom Nachziehstapel.'
        : 'Ziehphase — keine Karte verfügbar.';
    case 'build': {
      const canBuild = legal.some((a) => a.type === 'BUILD_CARD');
      if (canBuild) {
        return 'Tippe „Engine bauen“, um eine Karte in die Engine zu legen — oder „Skip Bau-Phase“.';
      }
      if (legal.some((a) => a.type === 'SKIP_BUILD')) {
        return 'Keine baubaren Karten — nur „Skip Bau-Phase“ möglich.';
      }
      return 'Bau-Phase.';
    }
    case 'action': {
      const canAttack = legal.some((a) => a.type === 'PLAY_ATTACK');
      const canBoost = legal.some((a) => a.type === 'PLAY_BOOST');
      const canUlti = legal.some((a) => a.type === 'PLAY_ULTIMATE');
      const canGlitch = legal.some((a) => a.type === 'PLAY_GLITCH');
      const canHandAction = canAttack || canBoost || canGlitch;
      if (canHandAction) {
        return 'Tippe „Aktion spielen“, um eine Handkarte als Aktion zu wählen — oder lasse die Hauptaktion aus.';
      }
      if (canUlti) {
        return 'Keine Hand-Aktion möglich — spiele die Ultimativkarte oder lasse die Hauptaktion aus.';
      }
      return 'Aktionsphase — beende die Hauptaktion.';
    }
    case 'end':
      return legal.some((a) => a.type === 'END_TURN')
        ? 'Beende deinen Zug.'
        : 'Endphase.';
    default:
      return view.phaseLabel;
  }
}
