type Env = {
  AUTH0_CLIENT_ID: string;
  AUTH0_DOMAIN: string;
  FIREPASS_GRAPHQL_URL: string;
};

export const env: Env = {
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  FIREPASS_GRAPHQL_URL: import.meta.env.VITE_FIREPASS_GRAPHQL_URL,
};
