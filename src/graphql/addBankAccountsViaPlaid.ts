import { gql } from "@apollo/client";

export const addBankAccountsViaPlaid = gql`
  mutation addBankAccountsViaPlaid($plaidId: ID, $plaidObj: AWSJSON) {
    addBankAccountsViaPlaid(plaidId: $plaidId, plaidObj: $plaidObj) {
      id
      name
      mask
      type
      subtype
      primaryAccount
    }
  }
`;
