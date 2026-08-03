/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_PORT?: string;
  readonly VITE_V6_PLAYABLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
