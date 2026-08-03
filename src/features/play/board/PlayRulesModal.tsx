/**
 * Playtest V5 rules modal — Regel | Karten | Alles filter, sections, comments, copy.
 * Location: src/features/play/board/PlayRulesModal.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { Copy } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { Tabs } from '../../../components/ui/Tabs';
import {
  PLAY_RULES_CARDS_SECTION_ID,
  V5_PLAY_RULES_CARD_SECTIONS,
} from './playRulesCardCatalog';
import {
  V5_PLAY_RULE_SECTIONS,
  copyTextToClipboard,
  formatRulesWithComments,
  formatSectionWithComments,
  loadPlayRulesComments,
  savePlayRulesComments,
  type RulesSection,
} from './playRulesSections';

const COPY_FEEDBACK_MS = 2000;

/** Alles = V5 draft rules + full card catalog (elements, ultis, arenas, …). */
type PlayRulesFilter = 'regeln' | 'karten' | 'alles';

const ALL_PLAY_RULES_SECTIONS: RulesSection[] = [
  ...V5_PLAY_RULE_SECTIONS,
  ...V5_PLAY_RULES_CARD_SECTIONS,
];

interface PlayRulesModalProps {
  open: boolean;
  onClose: () => void;
}

function sectionsForFilter(filter: PlayRulesFilter): RulesSection[] {
  if (filter === 'regeln') return V5_PLAY_RULE_SECTIONS;
  if (filter === 'karten') return V5_PLAY_RULES_CARD_SECTIONS;
  return ALL_PLAY_RULES_SECTIONS;
}

function copyAriaForFilter(filter: PlayRulesFilter): string {
  if (filter === 'regeln') return 'Spielregeln inkl. Kommentare kopieren';
  if (filter === 'karten') return 'Kartenkatalog inkl. Kommentare kopieren';
  return 'Spielregeln und Kartenkatalog inkl. Kommentare kopieren';
}

function RulesSectionBlock({
  section,
  comment,
  copied,
  onCommentChange,
  onCopy,
}: {
  section: RulesSection;
  comment: string;
  copied: boolean;
  onCommentChange: (value: string) => void;
  onCopy: () => void;
}) {
  return (
    <section
      data-testid={`play-rules-section-${section.id}`}
      className="rounded-md border border-stone-700/80 bg-stone-950/40 p-3"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 text-sm font-semibold text-stone-100">{section.title}</h4>
        <Button
          variant="ghost"
          size="sm"
          icon={<Copy className="h-3.5 w-3.5" />}
          onClick={onCopy}
          aria-label={`Abschnitt „${section.title}“ inkl. Kommentar kopieren`}
          data-testid={`play-rules-section-copy-${section.id}`}
          className="shrink-0 px-2"
        >
          {copied ? 'Kopiert!' : 'Kopieren'}
        </Button>
      </div>
      <pre className="mb-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-stone-300">
        {section.body}
      </pre>
      <Textarea
        label="Kommentar"
        rows={2}
        placeholder="Notiz zu diesem Abschnitt…"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        data-testid={`play-rules-comment-${section.id}`}
      />
    </section>
  );
}

export function PlayRulesModal({ open, onClose }: PlayRulesModalProps) {
  const [comments, setComments] = useState<Record<string, string>>({});
  /** `'all'` or a section id while showing „Kopiert!“. */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<PlayRulesFilter>('regeln');
  const contentTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setComments(loadPlayRulesComments());
    setCopiedKey(null);
  }, [open]);

  useEffect(() => {
    if (!copiedKey) return;
    const id = window.setTimeout(() => setCopiedKey(null), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(id);
  }, [copiedKey]);

  useEffect(() => {
    if (!open) return;
    contentTopRef.current?.parentElement?.scrollTo({ top: 0 });
  }, [filter, open]);

  const setComment = (sectionId: string, value: string) => {
    setComments((prev) => {
      const next = { ...prev, [sectionId]: value };
      savePlayRulesComments(next);
      return next;
    });
  };

  const visibleSections = sectionsForFilter(filter);
  const showRules = filter === 'regeln' || filter === 'alles';
  const showCards = filter === 'karten' || filter === 'alles';

  const handleCopyAll = async () => {
    const text = formatRulesWithComments(visibleSections, comments);
    const ok = await copyTextToClipboard(text);
    setCopiedKey(ok ? 'all' : null);
  };

  const handleCopySection = async (sectionId: string) => {
    const section = visibleSections.find((s) => s.id === sectionId);
    if (!section) return;
    const text = formatSectionWithComments(section, comments);
    const ok = await copyTextToClipboard(text);
    setCopiedKey(ok ? sectionId : null);
  };

  const renderSectionBlocks = (sections: RulesSection[]) =>
    sections.map((section) => (
      <RulesSectionBlock
        key={section.id}
        section={section}
        comment={comments[section.id] ?? ''}
        copied={copiedKey === section.id}
        onCommentChange={(value) => setComment(section.id, value)}
        onCopy={() => {
          void handleCopySection(section.id);
        }}
      />
    ));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Spielregeln"
      size="lg"
      testId="play-rules-modal"
      dismissible
      headerActions={
        <div className="flex flex-wrap items-center gap-2" data-testid="play-rules-filter">
          <Tabs
            ariaLabel="Spielregeln-Filter"
            active={filter}
            onChange={(id) => setFilter(id as PlayRulesFilter)}
            items={[
              { id: 'regeln', label: 'Regel', tone: 'play' },
              { id: 'karten', label: 'Karten', tone: 'play' },
              { id: 'alles', label: 'Alles', tone: 'play' },
            ]}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={<Copy className="h-4 w-4" />}
            onClick={() => {
              void handleCopyAll();
            }}
            aria-label={copyAriaForFilter(filter)}
            data-testid="play-rules-copy"
          >
            {copiedKey === 'all' ? 'Kopiert!' : 'Kopieren'}
          </Button>
        </div>
      }
    >
      <div ref={contentTopRef} className="flex flex-col gap-6">
        {filter === 'regeln' ? (
          <p className="text-xs text-stone-500">
            V5 Playtest-Regeln (SPIELANLEITUNG_V5_DRAFT). Kommentare bleiben in diesem Browser
            gespeichert. Kopieren übernimmt die aktuelle Filteransicht (Regel).
          </p>
        ) : null}
        {filter === 'karten' ? (
          <p className="text-xs text-stone-500">
            Karten & Effekte aus dem V5-Pack (Element, Glitch, Charakter, Ulti, Formel, Kombos,
            Gegenstand, Arena, Artefakt). Kopieren übernimmt nur diesen Katalog inkl. Kommentare.
          </p>
        ) : null}
        {filter === 'alles' ? (
          <p className="text-xs text-stone-500" data-testid="play-rules-alles-intro">
            Gesamtansicht: V5-Regeln plus voller Kartenkatalog (Effekte, Elemente, Ultis,
            Formel-Kombinationen, Arenen, …). Kopieren übernimmt beides inkl. Kommentare.
          </p>
        ) : null}

        {showRules ? (
          <div className="flex flex-col gap-6" data-testid="play-rules-regeln-view">
            {filter === 'alles' ? (
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Regeln
              </h3>
            ) : null}
            {renderSectionBlocks(V5_PLAY_RULE_SECTIONS)}
          </div>
        ) : null}

        {showCards ? (
          <div
            id={PLAY_RULES_CARDS_SECTION_ID}
            data-testid="play-rules-cards-catalog"
            className="flex flex-col gap-6"
          >
            {filter === 'alles' ? (
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Karten, Effekte & Katalog
              </h3>
            ) : null}
            {renderSectionBlocks(V5_PLAY_RULES_CARD_SECTIONS)}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
