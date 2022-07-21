import { gql } from "@apollo/client";

export const getPropertyInformation = gql`
  query getPropertyInformation($fullAddress: String!) {
    getPropertyInformation(fullAddress: $fullAddress)
  }
`;

// getPropertyInformation(fullAddress: String!): String
