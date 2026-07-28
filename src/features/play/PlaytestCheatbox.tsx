/**
 * Dev-only playtest cheatbox — scenario presets, O11 LP/Mono, state patches.
 * Location: src/features/play/PlaytestCheatbox.tsx
 */
import React, { useState, useEffect } from 'react';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  ContentPack,
  GameState,
  MonoBonusMode,
  PlayerId,
  PlaytestHpCap,
} from '../../game/types';
import { TURN_PHASES, type TurnPhase } from '../../game/types';
import { PHASE_LABELS } from '../../game/engine/helpers';
import {
  PLAYTEST_SCENARIOS,
  type PlaytestScenarioId,
  preparePlaytestState,
  applyAndValidatePlaytestPatch,
  type PlaytestPatch,
} from '../../game/playtest';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const HP_CAPS: PlaytestHpCap[] = [20, 25, 30];
const MONO_MODES: { id: MonoBonusMode; label: string }[] = [
  { id: 'mb1', label: 'MB1' },
  { id: 'mb2', label: 'MB2' },
  { id: 'mb3', label: 'MB3' },
  { id: 'mb4', label: 'MB4' },
];

interface PlaytestCheatboxProps {
  pack: ContentPack;
  state: GameState;
  botPaused: boolean;
  onBotPausedChange: (paused: boolean) => void;
  onApplyState: (state: GameState) => void;
  onError: (message: string | null) => void;
  /** Force MVP×3 WeaponAssembler preview (#133). */
  enginePreviewMvp: boolean;
  onEnginePreviewMvpChange: (enabled: boolean) => void;
}

export function PlaytestCheatbox({
  pack,
  state,
  botPaused,
  onBotPausedChange,
  onApplyState,
  onError,
  enginePreviewMvp,
  onEnginePreviewMvpChange,
}: PlaytestCheatboxProps) {
  const [open, setOpen] = useState(true);
  const [patchPhase, setPatchPhase] = useState<TurnPhase>(state.phase);
  const [patchActive, setPatchActive] = useState<PlayerId>(state.activePlayer);
  const [patchP1Hp, setPatchP1Hp] = useState(String(state.players.p1.hp));
  const [patchP2Hp, setPatchP2Hp] = useState(String(state.players.p2.hp));

  const hpCap = state.meta.playtestHpCap ?? 20;
  const monoMode = state.meta.monoBonusMode ?? 'mb1';

  useEffect(() => {
    setPatchPhase(state.phase);
    setPatchActive(state.activePlayer);
    setPatchP1Hp(String(state.players.p1.hp));
    setPatchP2Hp(String(state.players.p2.hp));
  }, [state]);

  const applyScenario = (id: PlaytestScenarioId) => {
    const scenario = PLAYTEST_SCENARIOS.find((s) => s.id === id);
    if (!scenario) return;
    const built = scenario.build(pack);
    const result = preparePlaytestState(built);
    if (!result.ok || !result.state) {
      onError(result.error ?? 'Szenario ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const applyPatch = () => {
    const patch: PlaytestPatch = {
      phase: patchPhase,
      activePlayer: patchActive,
      p1Hp: Number(patchP1Hp),
      p2Hp: Number(patchP2Hp),
    };
    const result = applyAndValidatePlaytestPatch(state, patch);
    if (!result.ok || !result.state) {
      onError(result.error ?? 'Patch ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const applyHpCap = (cap: PlaytestHpCap) => {
    const result = applyAndValidatePlaytestPatch(state, {
      playtestHpCap: cap,
      p1Hp: cap,
      p2Hp: cap,
    });
    if (!result.ok || !result.state) {
      onError(result.error ?? 'LP-Cap ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const applyMono = (mode: MonoBonusMode) => {
    const result = applyAndValidatePlaytestPatch(state, { monoBonusMode: mode });
    if (!result.ok || !result.state) {
      onError(result.error ?? 'Mono-Modus ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const applyV3Combat = (enabled: boolean) => {
    const result = applyAndValidatePlaytestPatch(state, { v3CombatEnabled: enabled });
    if (!result.ok || !result.state) {
      onError(result.error ?? 'V3-Flag ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const demoV3StatusesAndReaction = () => {
    const result = applyAndValidatePlaytestPatch(state, {
      v3CombatEnabled: true,
      p1Statuses: [{ id: 'brennen', stacks: 2 }],
      p2Statuses: [
        { id: 'brennen', stacks: 1 },
        { id: 'durchnaesst', stacks: 1 },
      ],
      demoPickReaction: true,
    });
    if (!result.ok || !result.state) {
      onError(result.error ?? 'V3-Demo ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const demoV3UltiBlueprintHooks = () => {
    const result = applyAndValidatePlaytestPatch(state, { demoV3Hooks: true });
    if (!result.ok || !result.state) {
      onError(result.error ?? 'Ulti/Blueprint-Demo ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const demoCombatFeedback = () => {
    const result = applyAndValidatePlaytestPatch(state, {
      v3CombatEnabled: true,
      demoCombatFeedback: 'both',
    });
    if (!result.ok || !result.state) {
      onError(result.error ?? 'Combat-Feedback-Demo ungültig.');
      return;
    }
    onError(null);
    onApplyState(result.state);
  };

  const v3On = state.meta.v3CombatEnabled === true;

  return (
    <div className="pointer-events-auto absolute bottom-3 right-3 z-40 w-72 max-w-[calc(100vw-1.5rem)]">
      <Panel tone="game" dense className="border-amber-700/60">
        <button
          type="button"
          className="mb-2 flex w-full items-center justify-between gap-2 text-left"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Bug className="h-3.5 w-3.5" />
            Playtest
          </span>
          {open ? (
            <ChevronDown className="h-4 w-4 text-stone-500" />
          ) : (
            <ChevronUp className="h-4 w-4 text-stone-500" />
          )}
        </button>

        {open && (
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Szenarien
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PLAYTEST_SCENARIOS.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => applyScenario(scenario.id)}
                  >
                    {scenario.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-stone-800 pt-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                LP-Cap (O11) · aktuell {hpCap}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {HP_CAPS.map((cap) => (
                  <Button
                    key={cap}
                    variant={hpCap === cap ? 'accent' : 'secondary'}
                    size="sm"
                    onClick={() => applyHpCap(cap)}
                  >
                    {cap}
                  </Button>
                ))}
              </div>
              <p className="mb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Mono (O11) · {monoMode.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MONO_MODES.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={monoMode === mode.id ? 'accent' : 'secondary'}
                    size="sm"
                    onClick={() => applyMono(mode.id)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
              <p className="mb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                V3 Kampf · {v3On ? 'an' : 'aus'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={v3On ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => applyV3Combat(true)}
                  data-testid="playtest-v3-on"
                >
                  V3 an
                </Button>
                <Button
                  variant={!v3On ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => applyV3Combat(false)}
                  data-testid="playtest-v3-off"
                >
                  V3 aus
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={demoV3StatusesAndReaction}
                  data-testid="playtest-v3-demo"
                >
                  V3 Demo
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={demoV3UltiBlueprintHooks}
                  data-testid="playtest-v3-hooks-demo"
                >
                  Ulti/Blueprint
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={demoCombatFeedback}
                  data-testid="playtest-combat-feedback-demo"
                >
                  Vollblock/Reaktion
                </Button>
              </div>
              <p className="text-[10px] text-stone-500">
                Mono wirkt erst mit V2-Engine; Modus wird gespeichert.
              </p>
            </div>

            <div className="space-y-2 border-t border-stone-800 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Patch
              </p>
              <label className="block text-xs text-stone-400">
                Phase
                <select
                  className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-sm text-stone-100"
                  value={patchPhase}
                  onChange={(e) => setPatchPhase(e.target.value as TurnPhase)}
                >
                  {TURN_PHASES.map((phase) => (
                    <option key={phase} value={phase}>
                      {PHASE_LABELS[phase]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-stone-400">
                Aktiver Spieler
                <select
                  className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-sm text-stone-100"
                  value={patchActive}
                  onChange={(e) => setPatchActive(e.target.value as PlayerId)}
                >
                  <option value="p1">P1 (Du)</option>
                  <option value="p2">P2 (Bot)</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="P1 HP"
                  type="number"
                  min={0}
                  max={hpCap}
                  value={patchP1Hp}
                  onChange={(e) => setPatchP1Hp(e.target.value)}
                />
                <Input
                  label="P2 HP"
                  type="number"
                  min={0}
                  max={hpCap}
                  value={patchP2Hp}
                  onChange={(e) => setPatchP2Hp(e.target.value)}
                />
              </div>
              <Button variant="accent" size="sm" className="w-full" onClick={applyPatch}>
                Patch anwenden
              </Button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 border-t border-stone-800 pt-2 text-xs text-stone-300">
              <input
                type="checkbox"
                checked={botPaused}
                onChange={(e) => onBotPausedChange(e.target.checked)}
                className="rounded border-stone-600 bg-stone-900"
              />
              Bot pausieren
            </label>

            <label
              className="flex cursor-pointer items-center gap-2 border-t border-stone-800 pt-2 text-xs text-stone-300"
              data-testid="playtest-engine-3d-mvp"
            >
              <input
                type="checkbox"
                checked={enginePreviewMvp}
                onChange={(e) => onEnginePreviewMvpChange(e.target.checked)}
                className="rounded border-stone-600 bg-stone-900"
              />
              3D-Assembler (MVP)
            </label>
          </div>
        )}
      </Panel>
    </div>
  );
}
