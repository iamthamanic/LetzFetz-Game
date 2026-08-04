# V6 Solo-Bot Playbook

**Status:** Digest for heuristic + LLM bot under `v6Formula`  
**Stand:** 2026-08-03  
**Vollkonzept:** [`docs/letz-fetz-v6-spielkonzept.md`](../letz-fetz-v6-spielkonzept.md) §28.1 Affinität, §50.7 Bot

> Code digest: `src/game/engine/v6BotPlaybook.ts` — keep this prose and the digest in sync.

---

## Prioritäten (kurz)

1. **Formelphase:** TEK/TE/EK/TK bauen wenn möglich; bei ≥2 Slots aktivieren (Überformel wenn Fetz=3 automatisch via Engine).
2. **Affinität (1× / eigener Zug):** nur ausgeben wenn der Spend den Kampf-/Formelwert **erhöht**; sonst `none` (Budget behalten).
3. **Aktion:** Herausforderung vor schwachen Angriffen; Improvisieren (DISCARD_DRAW) bei voller Hand; kein Charakter-Ulti (V6).
4. **Pending:** Fessel-Ziel Katalysator → Essenz → Technik; Passive-Skill-Scry `keep`; Affinität laut § Affinität unten.

---

## Affinität — wann ausgeben

Nach dem W6 bietet die Engine `PICK_V6_AFFINITY` mit:

| Mode | Effekt |
|------|--------|
| `value-plus` | Kampf-/Primärwert +1 (zuverlässig) |
| `dice-plus` | W6 +1 (clamped); Wert nur wenn Bonusband wechselt (2→3 oder 4→5) |
| `dice-minus` | W6 −1; selten nützlich |
| `none` | Budget behalten |

**Heuristik:**

1. Berechne Wert-Delta je Mode (`applyV6AffinityMode`).
2. Modes mit Delta ≤ 0 verwerfen (außer `none`).
3. **Angriff / Herausforderung:** Spenden wenn Delta > 0; bevorzugt `value-plus`, dann `dice-plus` wenn Delta gleich und Wurf sichtbar besser; Kill-Druck (Gegner-HP ≤ neuer Wert) boostet Spend.
4. **Block (nur eigener Aktionszug):** Spenden wenn Restschaden > 0 und Spend den Schaden senkt; sonst `none`.
5. **Formel:** Spenden wenn Primär-Delta > 0; bevorzugt `value-plus`.
6. Nie zweimal im selben Zug (Engine-Flag `v6AffinityAvailable`).

---

## LLM Digest

Der String `V6_BOT_PLAYBOOK_DIGEST` in `v6BotPlaybook.ts` ist die kompakte Prompt-Einlage. Bei Regeländerungen hier **und** im Digest aktualisieren.
