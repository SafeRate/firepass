import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./Home";
import { env } from "./utils/env";
import { Auth0Provider } from "@auth0/auth0-react";
import ApolloWrapper from "./ApolloWrapper";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider clientId={env.AUTH0_CLIENT_ID} domain={env.AUTH0_DOMAIN}>
      <ChakraProvider>
        <ApolloWrapper>
          <App />
        </ApolloWrapper>
      </ChakraProvider>
    </Auth0Provider>
  </React.StrictMode>
);
