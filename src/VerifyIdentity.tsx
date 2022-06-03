import { useQuery } from "@apollo/client";
import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GET_INSTA_TOUCH_ID_SESSION } from "./graphql";
import { env } from "./utils/env";

const VerifyIdentity = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
    >
      <Box fontSize="md" fontWeight="400" padding="1rem 1.5rem">
        Let's verify your identity in 3 easy steps!
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
  const { data, error } = useQuery(GET_INSTA_TOUCH_ID_SESSION);

  useEffect(() => {
    if (data) {
      if (data.getInstaTouchIdSession) {
        const fetchedData = data.getInstaTouchIdSession;

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
