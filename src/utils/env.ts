import { params } from "@serverless/cloud";

type Env = {
  FIREPASS_GRAPHQL_URL: string;
};

// export const env: Env = {
//   ...params,
// };

export const env: Env = {
  FIREPASS_GRAPHQL_URL:
    "https://stylish-mvp-c0ozg.cloud.serverless.com/graphql",
};
