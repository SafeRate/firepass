import { gql } from "@apollo/client";

export const getUserData = gql`
  query getUserData {
    getUserCreditReports {
      timestamp
    }
    getUserProperties {
      display
    }
  }
`;
