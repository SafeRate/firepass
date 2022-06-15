import React, { FunctionComponent, useCallback } from "react";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";
import { useMutation } from "@apollo/client";
import { Button, Spinner } from "@chakra-ui/react";
import { ADD_BANK_ACCOUNTS_VIA_PLAID } from "./graphql";

interface Props {
  token: string;
  refetchQueries: string[] | null;
  text?: string;
  refresh?: boolean;
}

const PlaidLink: FunctionComponent<Props> = ({
  token,
  refetchQueries,
  text,
  refresh,
}) => {
  let cleanedRefetchQueries: string[] = [];

  if (refetchQueries) {
    cleanedRefetchQueries = refetchQueries as string[];
  }

  const [addBorrowerBankAccountsViaPlaid, { loading: addLoading }] =
    useMutation(ADD_BANK_ACCOUNTS_VIA_PLAID);

  const [refreshBankAccountPlaid, { loading: refreshLoading }] = useMutation(
    ADD_BANK_ACCOUNTS_VIA_PLAID
  );

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metadata) => {
      // send public_token to server

      if (refresh) {
        console.log(public_token);
        console.log(metadata);
        alert("made it");
      } else {
        console.log("public_token", public_token);
        console.log("metadata", metadata);
        addBorrowerBankAccountsViaPlaid({
          variables: {
            plaidId: public_token,
            plaidObj: JSON.stringify(metadata),
          },
          refetchQueries: cleanedRefetchQueries,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    // onExit
    // onEvent
  };

  const { open, ready } = usePlaidLink(config);

  if (addLoading) {
    return <Spinner />;
  } else {
    return (
      <Button onClick={() => open()} disabled={!ready} my="3">
        {text ? text : "Connect a bank account"}
      </Button>
    );
  }
};

export default PlaidLink;
