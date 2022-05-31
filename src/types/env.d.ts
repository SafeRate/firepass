/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STAGE_NAME: string;
  readonly VITE_FIREPASS_GRAPHQL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
