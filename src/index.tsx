import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import { env } from "./utils/env";
import { Auth0Provider } from "@auth0/auth0-react";
import ApolloWrapper from "./ApolloWrapper";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        cacheLocation="localstorage"
        clientId={env.AUTH0_CLIENT_ID}
        domain={env.AUTH0_DOMAIN}
        redirectUri={window.location.origin}
        useRefreshTokens={true}
      >
        <ChakraProvider>
          <ApolloWrapper>
            <App />
          </ApolloWrapper>
        </ChakraProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
