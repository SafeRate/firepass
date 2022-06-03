/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AUTH0_CLIENT_ID: string;
  readonly AUTH0_DOMAIN: string;
  readonly VITE_FIREPASS_GRAPHQL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
