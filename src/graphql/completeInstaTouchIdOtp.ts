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
    ) {
      id
      name {
        firstName
        lastName
      }
      currentAddresses {
        streetAddress
        city
        state
        zipcode
      }
      previousAddresses {
        streetAddress
        city
        state
        zipcode
      }
      identification {
        ssn
        dob
      }
      contact {
        emailAddress
        homePhone
        mobile
      }
    }
  }
`;
