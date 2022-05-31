type Env = {
  FIREPASS_GRAPHQL_URL: string;
};

export const env: Env = {
  FIREPASS_GRAPHQL_URL: import.meta.env.VITE_FIREPASS_GRAPHQL_URL,
};
