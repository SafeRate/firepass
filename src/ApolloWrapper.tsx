import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { onError } from "@apollo/client/link/error";
import { env } from "./utils/env";
import PageLoader from "./components/PageLoader";

let client: ApolloClient<NormalizedCacheObject> | null = null;

const ApolloWrapper: React.FC = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [idToken, setIdToken] = useState("");
  const {
    getAccessTokenSilently,
    getIdTokenClaims,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;
    const callAsync = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setAccessToken(accessToken);
      } catch (error: any) {
        throw new Error(error);
      }
      try {
        const claims = await getIdTokenClaims();

        const idToken = claims.__raw;
        setIdToken(idToken);
      } catch (error: any) {
        throw new Error(error);
      }
    };

    callAsync();
  }, [
    getAccessTokenSilently,
    getIdTokenClaims,
    isAuthenticated,
    setAccessToken,
    setIdToken,
  ]);

  if (isLoading) {
    return <PageLoader />;
  }

  const httpLink = new HttpLink({
    uri: env.FIREPASS_GRAPHQL_URL,
    credentials: "include",
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.error(message);
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: any;
        Promise.resolve(operation)
          .then((operation) => {
            if (accessToken && idToken) {
              operation.setContext({
                headers: {
                  authorization: `bearer ${accessToken}`,
                  idToken,
                },
              });
            }
          })
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return (): void => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const link = ApolloLink.from([requestLink, errorLink, httpLink]);

  client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
    connectToDevTools: true,
  });

  if (!client) return null;

  return <>{children}</>;
};

export default ApolloWrapper;
