import { gql } from "@apollo/client";

export const getTouchIdOtpPasscode = gql`
  query getTouchIdOtpPasscode($sessionId: String!, $mobileNumber: String!) {
    getTouchIdOtpPasscode(sessionId: $sessionId, mobileNumber: $mobileNumber) {
      sessionId
      transactionKey
    }
  }
`;
