# Acceptance — LLM opponent bot (Ollama Cloud, hidden info)

## Intent
Solo play can use an Ollama Cloud LLM as the opponent. The model only sees information the bot player would know (no human hand). Moves must be legal engine actions. API key stays on the Vite dev server, never in the client bundle.

## Preconditions
- `OLLAMA_API_KEY` set in local `.env` (not committed)
- Optional `OLLAMA_BOT_MODEL` (default `glm-5.2:cloud`)
- `npm run dev` (middleware `/api/llm-bot` only in dev)

## Happy Path
1. UI toggle Bot = Heuristik | LLM
2. On bot turn, client sends **filtered** view + numbered legal actions to `/api/llm-bot`
3. Server calls Ollama Cloud; response picks an action index + German reason
4. Engine applies only that legal action; UI shows last bot reason
5. On API failure / invalid index → Heuristik fallback with note

## Edge Cases
- Human hand must never appear in the LLM payload (`handCount` only for opponent)
- Pending choices / blocks for bot still go through LLM (legal list only)
- Dice rolls for attack/block/challenge filled by client RNG, not LLM

## Out of Scope
- Production hosted proxy (Tauri / Appwrite later)
- Multi-turn memory beyond last event line

## Validation
```bash
cd Letzfetzprototype && npm run checks
```

## Implementation Notes
- `buildBotPublicView` FOW filter + `botNeedsToAct`
- Vite plugin `/api/llm-bot` → Ollama Cloud (`OLLAMA_API_KEY`, `OLLAMA_BOT_MODEL`)
- Client `chooseLlmBotAction` with heuristic fallback; UI toggle + reason line
