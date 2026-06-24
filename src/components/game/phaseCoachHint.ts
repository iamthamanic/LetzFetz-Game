/**
 * Derives German phase-coach hint text from engine-legal actions (no rule duplication).
 * Location: src/components/game/phaseCoachHint.ts
 */
import type { GameState } from '../../game';
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
      return 'Blockiere die Herausforderung mit einer Karte oder wähle „Nicht blocken“.';
    }
    return 'Blockiere den Angriff mit einer Karte oder wähle „Nicht blocken“.';
  }

  if (pending?.type === 'attack') {
    return 'Wähle eine gegnerische Engine-Karte zum Herausfordern — oder „Direkt angreifen“.';
  }
  if (pending?.type === 'bind') {
    return 'Wähle eine deiner Engine-Karten, die ersetzt werden soll.';
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
    case 'bind': {
      const canBind = legal.some((a) => a.type === 'BIND_CARD');
      if (canBind) {
        return 'Binde eine Karte an einen Engine-Slot.';
      }
      if (legal.some((a) => a.type === 'SKIP_BIND')) {
        return 'Du kannst optional binden oder „Nicht binden“ wählen.';
      }
      return 'Bindungsphase.';
    }
    case 'action': {
      const canAttack = legal.some((a) => a.type === 'PLAY_ATTACK');
      const canBoost = legal.some((a) => a.type === 'PLAY_BOOST');
      const canUlti = legal.some((a) => a.type === 'PLAY_ULTIMATE');
      const parts: string[] = [];
      if (canAttack) parts.push('spiele eine Angriffskarte');
      if (canBoost) parts.push('spiele eine Boost-Karte');
      if (canUlti) parts.push('spiele deine Ultimativkarte');
      if (parts.length > 0) {
        return `Aktionsphase — ${parts.join(', ')} oder beende die Hauptaktion.`;
      }
      return 'Aktionsphase — beende die Hauptaktion oder spiele Karten aus der Hand.';
    }
    case 'end':
      return legal.some((a) => a.type === 'END_TURN')
        ? 'Beende deinen Zug.'
        : 'Endphase.';
    default:
      return view.phaseLabel;
  }
}
