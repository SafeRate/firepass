import { gql } from "@apollo/client";

export const getFirePassQuote = gql`
  query getFirePassQuote($quoteRequest: FirePassQuoteRequest) {
    getFirePassQuote(quoteRequest: $quoteRequest)
  }
`;
