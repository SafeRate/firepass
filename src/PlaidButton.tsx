import { useLazyQuery } from "@apollo/client";
import { Spinner, Text } from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { GET_PLAID_LINK_TOKEN } from "./graphql";
import PlaidLink from "./PlaidLink";

interface Props {
  refetchQueries: string[] | null;
  id?: string;
  text?: string;
}

const PlaidButton: FunctionComponent<Props> = ({
  refetchQueries,
  id,
  text,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [getPlaidLinkToken, { loading, data, error }] = useLazyQuery(
    GET_PLAID_LINK_TOKEN,
    {
      variables: { id: id ? id : undefined },
    }
  );

  useEffect(() => {
    getPlaidLinkToken();
  }, [getPlaidLinkToken]);

  useEffect(() => {
    if (data && data.getPlaidLinkToken) {
      setToken(data.getPlaidLinkToken);
    }
  }, [data]);

  if (loading || token === null) {
    return <Spinner />;
  } else if (token) {
    return (
      <PlaidLink
        token={token}
        refetchQueries={refetchQueries}
        text={text}
        refresh={id ? true : false}
      />
    );
  } else {
    if (error) {
      console.error(error);
    }
    return <Text>Unable to connect to Plaid :(</Text>;
  }
};

export default PlaidButton;
