import { writeFileSync, readFileSync, existsSync } from 'fs';
import { BASE_PACK } from '../src/game/packs/base-pack.ts';
import { createGame } from '../src/game/engine/createGame.ts';
import { applyAction, getLegalActions } from '../src/game/engine/actions.ts';
import { chooseBotAction } from '../src/game/engine/bot.ts';
import { findElementDef } from '../src/game/engine/lookup.ts';
import { createSeededRng } from '../src/game/engine/deck.ts';
import type { GameAction, GameState, PlayerId } from '../src/game/types/index.ts';

const PATH = '.qa/chat-match/state.json';
const SEED = 20260717;

function nameOf(defId: string) {
  const el = findElementDef(BASE_PACK, defId);
  if (el) return `${el.name} (${el.cardType}, ${el.value})`;
  const g = BASE_PACK.glitches.find((x) => x.id === defId);
  if (g) return `${g.name} (Glitch ${g.glitchType}: ${g.effectText})`;
  return defId;
}

function boundLabel(b: GameState['players']['p1']['bound'][number]) {
  const el = findElementDef(BASE_PACK, b.defId);
  const w = (el?.value ?? 0) + b.resistanceBonus;
  return `${nameOf(b.defId)}${b.exhausted ? ' [erschöpft]' : ''} W${w}`;
}

function summarize(state: GameState, hideP2Hand: boolean) {
  const arena = BASE_PACK.arenas.find((a) => a.id === state.arena.arenaId)!;
  const p1c = BASE_PACK.characters.find((c) => c.id === state.players.p1.characterId)!;
  const p2c = BASE_PACK.characters.find((c) => c.id === state.players.p2.characterId)!;
  const lines: string[] = [];
  lines.push(`Arena: ${arena.name}`);
  lines.push(`Engine: Arena-Hooks + spielbare Glitches aktiv. Noch offen: Charakter-Passive, Element-Synergien.`);
  if (state.pendingChoice) lines.push(`PENDING: ${JSON.stringify(state.pendingChoice)}`);
  lines.push(`  Grund: ${arena.baseEffect}`);
  lines.push(`  Trigger: ${arena.trigger}`);
  lines.push(`  Sonder: ${arena.specialRule}`);
  lines.push(`Zug ${state.turnNumber} | Phase: ${state.phase} | Aktiv: ${state.activePlayer} | Event: ${state.lastEvent ?? '-'}`);
  lines.push(`Deck ${state.piles.deck.length} | Ablage ${state.piles.discard.length}`);
  if (state.winner) lines.push(`GEWINNER: ${state.winner}`);
  lines.push(`— Du (${p1c.name}, ${p1c.elements.join('/')}): ${state.players.p1.hp} LP | Ulti: ${state.players.p1.ultimateAvailable ? 'ja' : 'nein'}`);
  lines.push(`  Engine: ${state.players.p1.bound.map(boundLabel).join(' | ') || '(leer)'}`);
  lines.push(`  Hand:`);
  for (const c of state.players.p1.hand) lines.push(`    ${c.instanceId}  ${nameOf(c.defId)}`);
  lines.push(`— Gegner (${p2c.name}, ${p2c.elements.join('/')}): ${state.players.p2.hp} LP | Ulti: ${state.players.p2.ultimateAvailable ? 'ja' : 'nein'}`);
  lines.push(`  Engine: ${state.players.p2.bound.map(boundLabel).join(' | ') || '(leer)'}`);
  if (hideP2Hand) lines.push(`  Hand: ${state.players.p2.hand.length} Karten (verdeckt)`);
  else {
    lines.push(`  Hand:`);
    for (const c of state.players.p2.hand) lines.push(`    ${c.instanceId}  ${nameOf(c.defId)}`);
  }
  if (state.combat) {
    lines.push(`KAMPF: mode=${state.combat.mode} atk=${state.combat.attackValue} roll=${state.combat.attackRoll} defender=${state.combat.defenderId}`);
  }
  if (state.instantReveals?.length) {
    lines.push('SOFORT-GLITCH (sichtbar für beide):');
    for (const r of state.instantReveals) {
      const who = r.playerId === 'p1' ? 'Du' : 'Gegner';
      lines.push(`  ★ ${who} zog ${r.name}: ${r.effectText}`);
      lines.push(`    → ${r.resolution}`);
    }
  }
  return lines.join('\n');
}

const cmd = process.argv[2] ?? 'status';

if (cmd === 'new') {
  const state = createGame({
    pack: BASE_PACK,
    p1CharacterId: 'kokabell',
    p2CharacterId: 'pillendoktora',
    seed: SEED,
    startingPlayer: 'p1',
    rng: createSeededRng(SEED),
  });
  const match = { seed: SEED, rngSalt: 0, state, log: [`new seed=${SEED}`] };
  writeFileSync(PATH, JSON.stringify(match, null, 2));
  console.log(summarize(state, true));
  console.log('\nLEGAL_FOR_YOU:');
  for (const a of getLegalActions(state, { pack: BASE_PACK, playerId: 'p1' })) {
    console.log(JSON.stringify(a));
  }
  process.exit(0);
}

if (!existsSync(PATH)) {
  console.error('No match. Run: npx tsx scripts/chat-match.mts new');
  process.exit(1);
}

const match = JSON.parse(readFileSync(PATH, 'utf8')) as {
  seed: number;
  rngSalt: number;
  state: GameState;
  log: string[];
};
let state = match.state;

if (cmd === 'status') {
  console.log(summarize(state, true));
  console.log('\nLEGAL_FOR_YOU:');
  for (const a of getLegalActions(state, { pack: BASE_PACK, playerId: 'p1' })) console.log(JSON.stringify(a));
  process.exit(0);
}

if (cmd === 'act') {
  const action = JSON.parse(process.argv[3] ?? 'null') as GameAction;
  const pid = (process.argv[4] as PlayerId) ?? 'p1';
  match.rngSalt += 1;
  const rng = createSeededRng(SEED + match.rngSalt * 9973);
  state = applyAction(state, action, pid, { pack: BASE_PACK, playerId: pid, rng });
  match.log.push(`${pid}: ${JSON.stringify(action)} => ${state.lastEvent}`);
  match.state = state;
  writeFileSync(PATH, JSON.stringify(match, null, 2));
  console.log(summarize(state, true));
  console.log('\nLEGAL_FOR_YOU:');
  for (const a of getLegalActions(state, { pack: BASE_PACK, playerId: 'p1' })) console.log(JSON.stringify(a));
  process.exit(0);
}

if (cmd === 'bot') {
  let guard = 0;
  while (
    !state.winner &&
    guard++ < 40 &&
    ((state.activePlayer === 'p2' && !state.combat) || state.combat?.defenderId === 'p2')
  ) {
    const action = chooseBotAction(state, BASE_PACK);
    if (!action) break;
    match.rngSalt += 1;
    const rng = createSeededRng(SEED + match.rngSalt * 9973);
    state = applyAction(state, action, 'p2', { pack: BASE_PACK, playerId: 'p2', rng });
    match.log.push(`p2: ${JSON.stringify(action)} => ${state.lastEvent}`);
    console.log('BOT', JSON.stringify(action), '=>', state.lastEvent);
  }
  match.state = state;
  writeFileSync(PATH, JSON.stringify(match, null, 2));
  console.log(summarize(state, true));
  console.log('\nLEGAL_FOR_YOU:');
  for (const a of getLegalActions(state, { pack: BASE_PACK, playerId: 'p1' })) console.log(JSON.stringify(a));
  process.exit(0);
}

console.error('Usage: new | status | act \'<json>\' | bot');
process.exit(1);
