import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GRAPHQL_URL } from "./utils/constants";
import useFetch from "./utils/useFetch";

const VerifyIdentity = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
    >
      <Box fontSize="2xl" fontWeight="bold">
        Verify your identity
      </Box>
      <Button
        colorScheme={"purple"}
        isDisabled={isFetching}
        isLoading={isFetching}
        my="3"
        onClick={() => {
          setIsFetching(true);
        }}
      >
        Get Started
      </Button>
      {isFetching && (
        <VerifyIdentityFetch
          {...props}
          setFormErrors={setFormErrors}
          setIsFetching={setIsFetching}
        />
      )}
      {formErrors && formErrors.includes("server") && (
        <Box color={"red.600"}>Internal server error</Box>
      )}
    </Flex>
  );
};

export default VerifyIdentity;

const VerifyIdentityFetch = ({
  currentState,
  setCurrentState,
  setFormErrors,
  setIsFetching,
}) => {
  const { data, error } = useFetch<any>(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
          query getInstaTouchIdSession {
            getInstaTouchIdSession {
                carrier
                instaTouch
                sessionId
            }
          }
        `,
    }),
  });

  useEffect(() => {
    if (data) {
      if (data.data) {
        if (data.data.getInstaTouchIdSession) {
          const fetchedData = data.data.getInstaTouchIdSession;

          const newState = { ...currentState };
          if (fetchedData.carrier !== currentState.carrier) {
            newState.carrier = fetchedData.carrier;
          }
          if (fetchedData.instaTouch !== currentState.instaTouch) {
            newState.instaTouch = fetchedData.instaTouch;
          }
          if (fetchedData.sessionId !== currentState.sessionId) {
            newState.sessionId = fetchedData.sessionId;
          }

          newState.stepNumber = currentState.stepNumber += 1;

          setCurrentState(newState);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error(error);
      setIsFetching(false);
      setFormErrors(["server"]);
    }
  }, [error]);

  return <></>;
};
