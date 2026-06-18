
  # letz fetz prototype

  This is a code bundle for letz fetz prototype. The original project is available at https://www.figma.com/design/wRBtVn8juwrMypsLFH740a/letz-fetz-prototype.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  Run `npm test` for rules engine unit tests.

  Run `npm run checks` for build + tests.

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
  