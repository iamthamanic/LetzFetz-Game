/**
 * V6 Solo-Bot playbook digest + Affinity mode picker (#351).
 * Location: src/game/engine/v6BotPlaybook.ts
 * Prose: docs/rules/V6_BOT_PLAYBOOK.md
 */
import type { GameState, PendingChoice, RulesetConfig } from '../types';
import { applyV6AffinityMode, type V6AffinityMode } from './v6/affinity';

/** Compact priorities for LLM system prompt (German, short). */
export const V6_BOT_PLAYBOOK_DIGEST = [
  'V6-Prioritäten:',
  '1) Formel: bauen/aktivieren (≥2 Slots); TEK/Überformel vor reinem Schaden-Max.',
  '2) Affinität 1×/Zug: nur wenn Wert steigt — value-plus bevorzugt; dice-plus nur bei Bonusband 2→3/4→5; sonst none.',
  '3) Aktion: Herausfordern vor schwachen Angriffen; Improvisieren bei voller Hand; kein Charakter-Ulti.',
  '4) Fessel-Ziel: Katalysator→Essenz→Technik.',
].join(' ');

export type AffinityPickKind = 'attack' | 'block' | 'challenge' | 'formula';

/**
 * Choose Affinity mode that improves the pending roll when beneficial.
 * Returns `none` when no spend increases value (or block already covers).
 */
export function pickBeneficialV6AffinityMode(
  pending: Extract<PendingChoice, { type: 'v6-affinity' }>,
  state: GameState,
  ruleset: RulesetConfig,
  botId: 'p1' | 'p2' = 'p2',
  humanId: 'p1' | 'p2' = 'p1',
): V6AffinityMode {
  const modes: V6AffinityMode[] = ['value-plus', 'dice-plus', 'dice-minus', 'none'];
  const scored: { mode: V6AffinityMode; value: number; delta: number; roll: number }[] = [];

  for (const mode of modes) {
    const applied = applyV6AffinityMode(
      pending.diceRoll,
      pending.baseValue,
      mode,
      ruleset,
    );
    scored.push({
      mode,
      value: applied.value,
      delta: applied.value - pending.baseValue,
      roll: applied.diceRoll,
    });
  }

  const humanHp = state.players[humanId].hp;
  const botHp = state.players[botId].hp;
  const kind = pending.kind;

  if (kind === 'block') {
    const atk = state.combat?.attackValue ?? pending.baseValue;
    const candidates = scored.filter((s) => s.mode === 'none' || s.delta > 0);
    let best = candidates.find((s) => s.mode === 'none') ?? scored[scored.length - 1];
    let bestDamage = Math.max(0, atk - best.value);
    for (const s of candidates) {
      const dmg = Math.max(0, atk - s.value);
      // Prefer lower incoming damage; break ties toward keeping Affinity when already full block.
      if (dmg < bestDamage || (dmg === bestDamage && s.mode === 'none' && best.mode !== 'none')) {
        bestDamage = dmg;
        best = s;
      } else if (dmg === bestDamage && s.delta > best.delta) {
        best = s;
      }
    }
    // If still taking lethal and a spend would save, force best spend.
    if (bestDamage >= botHp) {
      const lifesaver = candidates
        .filter((s) => s.mode !== 'none' && Math.max(0, atk - s.value) < botHp)
        .sort((a, b) => b.delta - a.delta)[0];
      if (lifesaver) return lifesaver.mode;
    }
    return best.mode;
  }

  // Attack / challenge / formula: spend only when value increases.
  const improving = scored.filter((s) => s.mode !== 'none' && s.delta > 0);
  if (improving.length === 0) return 'none';

  improving.sort((a, b) => {
    if (b.delta !== a.delta) return b.delta - a.delta;
    // Prefer reliable value-plus over dice swing at equal delta.
    const rank = (m: V6AffinityMode) =>
      m === 'value-plus' ? 3 : m === 'dice-plus' ? 2 : m === 'dice-minus' ? 1 : 0;
    return rank(b.mode) - rank(a.mode);
  });

  let best = improving[0];

  if (kind === 'attack' || kind === 'challenge') {
    // Prefer a spend that reaches lethal when possible.
    const lethal = improving.find((s) => s.value >= humanHp);
    if (lethal) best = lethal;
  }

  return best.mode;
}
