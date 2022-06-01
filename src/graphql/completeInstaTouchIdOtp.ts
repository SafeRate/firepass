import { gql } from "@apollo/client";

export const completeInstaTouchIdOtp = gql`
  mutation completeInstaTouchIdOtp(
    $mobileNumber: String!
    $passcode: String!
    $sessionId: String!
    $transactionKey: String!
    $zipCode: String!
    $SSN: String!
  ) {
    completeInstaTouchIdOtp(
      mobileNumber: $mobileNumber
      passcode: $passcode
      sessionId: $sessionId
      transactionKey: $transactionKey
      zipCode: $zipCode
      SSN: $SSN
    )
  }
`;
