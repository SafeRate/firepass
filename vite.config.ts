import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { params } from "@serverless/cloud";

const clonedParams = { ...params };

const clonedParamsKeys = Object.keys(clonedParams);
clonedParamsKeys.forEach((key) => {
  clonedParams[`VITE_${key}`] = clonedParams[key];
  delete clonedParams[key];
});

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
    ...clonedParams,
  };

  return defineConfig({
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          dir: "./static",
        },
      },
    },
  });
};
