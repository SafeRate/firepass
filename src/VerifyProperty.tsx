import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { GET_PROPERTY_INFORMATION } from "./graphql";

export const VerifyProperty = (props) => {
  const { loading, error, data } = useQuery(GET_PROPERTY_INFORMATION, {
    variables: {
      fullAddress: props.fullAddress,
    },
  });

  if (loading) return <Box>"Loading..."</Box>;

  if (error) return <Box>`Error! ${error.message}`</Box>;

  return <Box>{data.getPropertyInformation}</Box>;
};
