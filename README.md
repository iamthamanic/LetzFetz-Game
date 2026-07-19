
  # letz fetz prototype

  This is a code bundle for letz fetz prototype. The original project is available at https://www.figma.com/design/wRBtVn8juwrMypsLFH740a/letz-fetz-prototype.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  Run `npm test` for rules engine unit tests.

  Run `npm run checks` for build + tests.

  ## LLM opponent (Ollama Cloud)

  Dev-only: Vite middleware `/api/llm-bot` keeps the API key off the client.

  1. Copy `.env.example` → `.env`
  2. Set `OLLAMA_API_KEY` (https://ollama.com/settings/keys)
  3. Optional: `OLLAMA_BOT_MODEL=glm-5.2:cloud`
  4. `npm run dev` → in-game toggle **Gegner: LLM (Ollama)**

  The model only sees a FOW view (no human hand). Invalid/failed replies fall back to the heuristic bot.

  ## Rules (V1 vs V2 draft)

  - **V1 (engine truth):** [`docs/rules/SPIELANLEITUNG_V1.md`](docs/rules/SPIELANLEITUNG_V1.md)
  - **V2 playtest draft:** [`docs/rules/SPIELANLEITUNG_V2_DRAFT.md`](docs/rules/SPIELANLEITUNG_V2_DRAFT.md) — not engine truth until released
  - **V2 redesign WIP:** [`docs/rules/SPIELANLEITUNG_V2_WIP.md`](docs/rules/SPIELANLEITUNG_V2_WIP.md)
  - V2 P100 test pack: `V2_P100_PACK` in `src/game/packs/v2/` (24/24/12/30/10 mix)

  ## Card art (Ollama Flux)

  Requires local `x/flux2-klein:4b` via Ollama.

  ```bash
  npm run generate:card-art -- --list
  npm run generate:card-art -- --key=knuspergnom
  npm run generate:card-art -- --kind=character
  npm run generate:card-art -- --all
  ```

  Output: `public/cards/{character|ultimate|element|arena|glitch}/*.png`
  Prompts: `src/services/cardArt/prompts/`

  ### Higgsfield (characters + ultimates)

  Requires `higgsfield auth login`. Uses Nano Banana 2 (`nano_banana_flash`).

  ```bash
  npm run generate:higgsfield-chars -- --key=knuspergnom
  npm run generate:higgsfield-chars -- --all --force
  ```
  