/**
 * Data-driven card & effects catalog for the Play rules modal.
 * Source of truth: active ContentPack (V5_PACK or V6_CORE_PACK).
 * Location: src/features/play/board/playRulesCardCatalog.ts
 */
import type {
  ArenaCardDef,
  CatalystCardDef,
  CharacterCardDef,
  ContentPack,
  ElementCardDef,
  EssenceCardDef,
  GlitchCardDef,
  ItemCardDef,
  TechniqueCardDef,
  UltimateCardDef,
} from '../../../game/types';
import { V5_PACK } from '../../../game/packs/v5';
import { V6_CORE_PACK } from '../../../game/packs/v6';
import type { Element } from '../../../game/types/elements';
import type { RulesSection } from './playRulesSections';

export const PLAY_RULES_CARDS_SECTION_ID = 'play-rules-cards';

export type PlayRulesPackVariant = 'v5' | 'v6';

const ELEMENT_LABEL_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const ELEMENT_CARD_TYPE_DE: Record<ElementCardDef['cardType'], string> = {
  attack: 'Angriff',
  block: 'Block',
  boost: 'Boost',
};

function joinBlocks(parts: string[]): string {
  return parts.filter((p) => p.trim().length > 0).join('\n\n');
}

function formatElementCard(card: ElementCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Elementkarte · ${ELEMENT_LABEL_DE[card.element]} · ${ELEMENT_CARD_TYPE_DE[card.cardType]} · Wert ${card.value}`,
    `Sofort: ${card.instantText}`,
    `Bound / Aktivieren: ${card.boundText}`,
  ]);
}

function formatGlitch(card: GlitchCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Glitch · Timing: ${card.timing}`,
    `Effekt: ${card.effectText}`,
  ]);
}

function formatCharacter(card: CharacterCardDef, ulti?: UltimateCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Elemente: ${card.elements.map((e) => ELEMENT_LABEL_DE[e]).join(' / ')}`,
    `Passive: ${card.passiveText}`,
    ulti ? `Großformel: ${ulti.name} — ${ulti.effectText}` : '',
  ]);
}

function formatUltimate(card: UltimateCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Ulti / Großformel`,
    `Effekt: ${card.effectText}`,
  ]);
}

function formatTechnique(card: TechniqueCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Formelkarte · Technik · Stabilität ${card.stability}`,
    `Wann: In der Formelphase als Technik-Platz.`,
    `Effekt: ${card.effectText}`,
  ]);
}

function formatEssence(card: EssenceCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Formelkarte · Essenz · ${ELEMENT_LABEL_DE[card.element]} · Stabilität ${card.stability}`,
    `Wann: In der Formelphase als Essenz-Platz; liefert Sekundärelement / Status bei Treffer.`,
    `Effekt: ${card.effectText}`,
  ]);
}

function formatCatalyst(card: CatalystCardDef): string {
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Formelkarte · Katalysator · Stabilität ${card.stability}`,
    `Wann: In der Formelphase als Katalysator-Platz; Timing / Transformation / Fusion.`,
    `Effekt: ${card.effectText}`,
  ]);
}

function formatItem(card: ItemCardDef): string {
  const timing = card.timing === 'reaction' ? 'Reaktion' : 'Aktion';
  return joinBlocks([
    `### ${card.name}`,
    `Typ: Gegenstand · Timing: ${timing}`,
    `Wann: ${
      card.timing === 'reaction'
        ? 'Als Reaktion, wenn die Karte es erlaubt.'
        : 'Als Hauptaktion (oder laut Kartentext).'
    }`,
    `Effekt: ${card.effectText}`,
  ]);
}

function formatArena(card: ArenaCardDef): string {
  const lines = [
    `### ${card.name}`,
    `Typ: Arena · Rolle: ${card.role}`,
    `Basis-Effekt: ${card.baseEffect}`,
    `Auslöser: ${card.trigger}`,
    `Sonderregel: ${card.specialRule}`,
  ];
  if (card.d6Variants) {
    lines.push(
      `W6-Varianten: 1–2 → ${card.d6Variants[0]} · 3–4 → ${card.d6Variants[1]} · 5–6 → ${card.d6Variants[2]}`,
    );
  }
  return joinBlocks(lines);
}

function section(id: string, title: string, body: string): RulesSection {
  return { id, title, body: body.trim() };
}

function formulaActivationIntro(variant: PlayRulesPackVariant): string {
  if (variant === 'v6') {
    return joinBlocks([
      'Quelle: V6-Core Slice-1 (`v6-core`) — Kartentexte aus dem Pack; Formel-Effekte aus Rezepten.',
      'Formelplätze: Technik · Essenz · Katalysator. Katalysator bei Aktivierung verbraucht.',
      'TE / TK / EK / TEK über Authoring-Rezepte. Fetz nur durch TEK. Keine Ultis / Großformeln.',
      'Gegnergerichteter Formelschaden → Formelabwehr-W6. Selbstbuff/Heilung/Schild → keine Formelabwehr.',
    ]);
  }
  return joinBlocks([
    'Quelle: V5-Pack (`v5-mvp`) — Effekttexte aus den Kartendefinitionen.',
    'Formelplätze: Technik · Essenz · Katalysator. In der Formelphase optional bauen/ersetzen/rückbauen, danach genau eine Aktivierung (oder Passen/Rückbau).',
    'Aktivierung: Wähle 2 oder 3 belegte, aufgerichtete, nicht gestörte Plätze mit mindestens zwei verschiedenen Klassen. Du musst nicht alle drei nutzen.',
    'TE = elementare Aktion (oft Formelangriff). TK = elementneutral verändert. EK = Ritual/Buff/Ladung (kein direkter Formelangriff). TEK = Fusion.',
    'Gegnergerichteter Formelschaden → nur W6-Formelabwehr (kein Block). Selbstbuff/Heilung/Schild → keine Formelabwehr.',
  ]);
}

/** Catalog categories as copyable rules-style sections (comments reuse same storage). */
export function buildPlayRulesCardSections(
  pack: ContentPack = V5_PACK,
  variant: PlayRulesPackVariant = 'v5',
): RulesSection[] {
  const ultiById = new Map(pack.ultimates.map((u) => [u.id, u]));
  const charIntro =
    variant === 'v6'
      ? 'Affinität (zwei Elemente): 1× pro eigenem Zug ±1 Wert oder W6. Keine V5-Passiven, keine Ultis.'
      : 'Passive einmal pro Zug / Trigger laut Text. Großformel bei 3 Fetzladung.';

  const sections: RulesSection[] = [
    section('karten-katalog-intro', 'Karten & Effekte — Überblick', formulaActivationIntro(variant)),
    section(
      'karten-element',
      `Elementkarten (${pack.elementCards.length})`,
      joinBlocks([
        'Kampfkarten (Angriff/Block/Boost). Sofort-Text gilt in der Aktionsphase; Bound-Text nach dem Bauen (Aktivieren).',
        ...pack.elementCards.map(formatElementCard),
      ]),
    ),
    section(
      'karten-glitch',
      `Glitchkarten (${pack.glitches.length})`,
      joinBlocks([
        variant === 'v6'
          ? 'Spielbare Glitches laut Timing. Sofort-Glitches sind im V6-Core nicht enthalten.'
          : 'Spielbare Glitches in der Aktionsphase bzw. als Reaktion laut Timing; Sofort-Glitches lösen beim Ziehen aus (keine Ersatzkarte außer laut Text).',
        ...pack.glitches.map(formatGlitch),
      ]),
    ),
    section(
      'karten-charakter',
      `Charakterkarten (${pack.characters.length})`,
      joinBlocks([charIntro, ...pack.characters.map((c) => formatCharacter(c, ultiById.get(c.ultimateId)))]),
    ),
  ];

  if (variant === 'v5' || pack.ultimates.length > 0) {
    sections.push(
      section(
        'karten-ulti',
        `Ultikarten / Großformel (${pack.ultimates.length})`,
        joinBlocks([
          pack.ultimates.length === 0
            ? 'V6: keine Ultikarten im Pack.'
            : 'Großformel verbraucht die Fetzladung (danach 0). Katalysator wird abgelegt; Technik/Essenz erschöpft.',
          ...pack.ultimates.map(formatUltimate),
        ]),
      ),
    );
  } else {
    sections.push(
      section(
        'karten-ulti',
        'Ultikarten / Großformel (0)',
        'V6 Core: keine charaktergebundenen Ultis. Bei 3 Fetz + TEK: Überformel aus aktueller Fusion (+2 Primär).',
      ),
    );
  }

  sections.push(
    section(
      'karten-technik',
      `Formelkarten — Technik (${pack.techniques?.length ?? 0})`,
      joinBlocks([
        'Ausführungsform der Formel; kein eigenes Element. Stabilität gegen Herausfordern.',
        ...(pack.techniques ?? []).map(formatTechnique),
      ]),
    ),
    section(
      'karten-essenz',
      `Formelkarten — Essenz (${pack.essences?.length ?? 0})`,
      joinBlocks([
        'Sekundärelement + oft Statusmarke, wenn die Formel trifft und keine Elementreaktion entsteht.',
        ...(pack.essences ?? []).map(formatEssence),
      ]),
    ),
    section(
      'karten-katalysator',
      `Formelkarten — Katalysator (${pack.catalysts?.length ?? 0})`,
      joinBlocks([
        variant === 'v6'
          ? 'V6: Katalysator transformiert und wird bei Verwendung abgelegt.'
          : 'Timing / Transformation. Bei TEK transformiert der Katalysator die TE-Basis.',
        ...(pack.catalysts ?? []).map(formatCatalyst),
      ]),
    ),
    section(
      'karten-gegenstand',
      `Gegenstandkarten (${pack.items?.length ?? 0})`,
      joinBlocks([
        'Verbrauchbar von der Hand oder Ausrüstung auf Gegenstand-Slots (nicht Formelplätze).',
        ...(pack.items ?? []).map(formatItem),
      ]),
    ),
    section(
      'karten-arena',
      `Arenenkarten (${pack.arenas.length})`,
      joinBlocks([
        'Aktive Arena bestimmt Dauer-Effekte und Auslöser für die Partie.',
        ...pack.arenas.map(formatArena),
      ]),
    ),
  );

  return sections;
}

/** Cached catalog for the Play rules modal. */
export const V5_PLAY_RULES_CARD_SECTIONS: RulesSection[] = buildPlayRulesCardSections(V5_PACK, 'v5');

/** Cached V6 Slice-1 catalog. */
export const V6_PLAY_RULES_CARD_SECTIONS: RulesSection[] = buildPlayRulesCardSections(
  V6_CORE_PACK,
  'v6',
);
