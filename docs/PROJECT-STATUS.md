# Projektstatus — Letz Fetz Prototype

> Generiert von memory-live-doc (Bootstrap 2026-07-19T12:16:48Z). Alle Claims: **needs-review**.

## Kurz

Solo-Duel spielbar (Rules Engine **V1**). V2 Phrase-Playtest und Branch `feat/wip-ui-engine-overhaul` aktiv. P2P / Appwrite-Migration offen.

## Was funktioniert

- Rules Engine V1 (`src/game/`) mit Vitest / fast-check
- Solo-Playmat inkl. Presentation/VFX
- Card Forge, Card Library, Sandbox-Arena
- Playtest-Cheatbox; optional LLM-Bot (Ollama Cloud, Dev)
- V2 P100 + Phrase-Slots (Draft — nicht V1-Wahrheit)

## Lücken

- Regelbuch-Edge-Cases, Match-Ende/Rematch
- WebRTC P2P + pluggable Signaling
- Appwrite Content-Migration
- Memory-Viewer GitHub Pages noch nicht aktiv

## Branch

`feat/wip-ui-engine-overhaul` @ `7f31a6f`

## Viewer

Lokal: `docs/memory-live-doc/viewer/index.html`
