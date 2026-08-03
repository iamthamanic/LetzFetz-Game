/**
 * Derives German phase-coach hint text from engine-legal actions (no rule duplication).
 * Location: src/features/play/board/phaseCoachHint.ts
 */
import type { GameState } from '../../../game';
import { isV5FormulaEnabled, isV6FormulaEnabled } from '../../../game';
import { rulesetFromState } from '../../../game/engine/rulesetFromState';
import { V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID } from '../../../game/engine/v6';
import type { PendingIntent } from './gameActionHelpers';
import type { GameViewModel } from './buildGameViewModel';
import { formulaChallengeTargetIds } from './gameActionHelpers';

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
    return 'Wähle eine Aktionskarte auf der Hand — Angriff, Boost, Glitch oder Gegenstand.';
  }
  if (pending?.type === 'improvise') {
    return 'Improvisieren: tippe eine Handkarte zum Abwerfen — du ziehst 2 und beendest die Hauptaktion.';
  }
  if (pending?.type === 'attack') {
    const ruleset = rulesetFromState(state);
    const v5 = isV5FormulaEnabled(ruleset);
    const v6 = isV6FormulaEnabled(ruleset);
    const hasTargets = v5 || v6
      ? formulaChallengeTargetIds(view.legalActions, pending.attackInstanceId).length > 0
      : view.botBoundSlots.some((s) => s.isTargetable);
    if (hasTargets) {
      return pending.targetBoundInstanceId
        ? 'Ziel gewählt — unten „Herausfordern“ oder „Direkt angreifen“.'
        : v6
          ? 'Gegner-Formel oder Konstrukt („Ziel“) antippen, dann unten „Herausfordern“ — oder „Direkt angreifen“.'
          : v5
            ? 'Gegner-Formelkomponente antippen als Ziel, dann unten „Herausfordern“ — oder „Direkt angreifen“.'
            : 'Gegner-Engine antippen als Ziel, dann unten „Herausfordern“ — oder „Direkt angreifen“.';
    }
    return 'Kein Herausforderungsziel — unten „Direkt angreifen“ gegen die LP des Gegners.';
  }
  if (pending?.type === 'build-select') {
    return isV5FormulaEnabled(rulesetFromState(state))
      ? 'Wähle eine Formelkarte zum Bauen, Ersetzen oder Schnellmix.'
      : isV6FormulaEnabled(rulesetFromState(state))
        ? 'Wähle eine Formelkarte zum Bauen oder Ersetzen (1. gratis / 2. kostet Abwurf).'
        : 'Wähle eine baubare Handkarte — Glitch-Karten sind ausgegraut.';
  }
  if (pending?.type === 'formula-paid-change') {
    return '2. Formeländerung: tippe eine Handkarte zum Abwerfen als Kosten.';
  }
  if (pending?.type === 'formula-return') {
    return 'Rückbau: tippe eine Formelkomponente auf dem Gestell — Phase endet ohne Aktivierung.';
  }
  if (pending?.type === 'build') {
    if (isV5FormulaEnabled(rulesetFromState(state))) {
      return 'Formelkarte wird direkt gebaut oder ersetzt.';
    }
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
      const ruleset = rulesetFromState(state);
      const v5 = isV5FormulaEnabled(ruleset);
      const v6 = isV6FormulaEnabled(ruleset);
      const canBuild = legal.some(
        (a) =>
          a.type === 'BUILD_CARD' ||
          a.type === 'FORMULA_BUILD' ||
          a.type === 'FORMULA_REPLACE' ||
          a.type === 'FORMULA_SCHNELLMIX',
      );
      const canActivate = legal.some((a) => a.type === 'FORMULA_ACTIVATE');
      if (canBuild) {
        return v6
          ? 'Tippe „Formel bauen“ (1. gratis, 2. kostet Abwurf) oder „Rückbau“ — oder aktivieren / Skip.'
          : v5
            ? 'Tippe „Formel bauen“, um eine Formelkarte zu legen — oder „Skip Formelphase“.'
            : 'Tippe „Engine bauen“, um eine Karte in die Engine zu legen — oder „Skip Bau-Phase“.';
      }
      if (canActivate) {
        const katalysatorDefId = state.players[view.human].formula.katalysator?.defId;
        if (v6 && katalysatorDefId === V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID) {
          return 'Tippe „Formel aktivieren“ — Beschwörung stellt ein Konstrukt auf (ersetzt ggf. das alte).';
        }
        if (
          v6 &&
          state.players[view.human].fetzCharge >= 3 &&
          state.players[view.human].formula.technik &&
          state.players[view.human].formula.essenz &&
          state.players[view.human].formula.katalysator
        ) {
          return 'Fetzladung voll — tippe „Überformel aktivieren“, bestätige den Dialog, dann feuert die verstärkte Fusion.';
        }
        return 'Tippe „Formel aktivieren“, um aufgerichtete Komponenten zu aktivieren — oder „Skip Formelphase“.';
      }
      if (legal.some((a) => a.type === 'SKIP_BUILD')) {
        return v5
          ? 'Keine Formelkarten — nur „Skip Formelphase“ möglich.'
          : 'Keine baubaren Karten — nur „Skip Bau-Phase“ möglich.';
      }
      return v5 ? 'Formelphase.' : 'Bau-Phase.';
    }
    case 'action': {
      const canAttack = legal.some((a) => a.type === 'PLAY_ATTACK');
      const canBoost = legal.some((a) => a.type === 'PLAY_BOOST');
      const canUlti = legal.some((a) => a.type === 'PLAY_ULTIMATE');
      const canGlitch = legal.some((a) => a.type === 'PLAY_GLITCH');
      const canItem = legal.some((a) => a.type === 'PLAY_ITEM');
      const canImprovise = legal.some((a) => a.type === 'DISCARD_DRAW');
      const v5 = isV5FormulaEnabled(rulesetFromState(state));
      const canHandAction = canAttack || canBoost || canGlitch || canItem;
      if (canHandAction) {
        return canImprovise
          ? 'Tippe „Aktion spielen“ oder „Improvisieren“ (1 abwerfen → 2 ziehen) — oder lasse die Hauptaktion aus.'
          : 'Tippe „Aktion spielen“, um eine Handkarte als Aktion zu wählen — oder lasse die Hauptaktion aus.';
      }
      if (canImprovise) {
        return 'Tippe „Improvisieren“, um 1 Handkarte abzuwerfen und 2 zu ziehen — oder lasse die Hauptaktion aus.';
      }
      if (canUlti) {
        return v5
          ? 'Keine Hand-Aktion möglich — spiele die Großformel oder lasse die Hauptaktion aus.'
          : 'Keine Hand-Aktion möglich — spiele die Ultimativkarte oder lasse die Hauptaktion aus.';
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
