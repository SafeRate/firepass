import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import InputPhoneNumber from "./components/InputPhoneNumber";
import { env } from "./utils/env";
import useFetch from "./utils/useFetch";

const MobileNumber = (props) => {
  const [formErrors, setFormErrors] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems="center"
        flexDirection={"column"}
        padding="1rem 1.5rem"
      >
        <Box fontSize="md" fontWeight="400" my="2">
          Please provide your mobile phone number (Step 2 of 3)
        </Box>
        <Box mt="0.25rem" fontSize="sm" color="gray.600">
          We'll send a code to this number to verify your identity
        </Box>
        <InputPhoneNumber
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            setMobileNumber(e.target.value);
          }}
          size="md"
          maxW="64"
          mt="1rem"
        />
        {formErrors && formErrors.includes("mobileNumber") && (
          <Box color={"red.600"}>Phone number is invalid</Box>
        )}
      </Flex>
      <Flex justifyContent="flex-end" alignItems="flex-end" my="4" mx="10">
        <Box>
          <Button
            colorScheme={"purple"}
            isDisabled={isFetching}
            isLoading={isFetching}
            onClick={() => {
              const digits = mobileNumber.match(/\d/g).join("");
              const isValidPhoneNumber = digits.length === 10;

              if (isValidPhoneNumber) {
                setIsFetching(true);
              } else {
                setFormErrors(["mobilePhone"]);
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Flex>
      {isFetching && (
        <MobileNumberFetch
          mobileNumber={mobileNumber}
          {...props}
          setIsFetching={setIsFetching}
          setFormErrors={setFormErrors}
        />
      )}
      {formErrors && formErrors.includes("server") && (
        <Box color={"red.600"}>Internal server error</Box>
      )}
    </>
  );
};

export default MobileNumber;

const MobileNumberFetch = ({
  currentState,
  mobileNumber,
  setCurrentState,
  setIsFetching,
  setFormErrors,
}) => {
  const { data, error } = useFetch<any>(env.FIREPASS_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
          query getTouchIdOtpPasscode($sessionId: String!, $mobileNumber: String!) {
            getTouchIdOtpPasscode(sessionId: $sessionId, mobileNumber: $mobileNumber) {
                sessionId
                transactionKey
            }
          }
        `,
      variables: {
        mobileNumber,
        sessionId: currentState.sessionId,
      },
    }),
  });

  useEffect(() => {
    if (data) {
      if (data.data) {
        if (data.data.getTouchIdOtpPasscode) {
          const fetchedData = data.data.getTouchIdOtpPasscode;

          const newState = { ...currentState };
          if (fetchedData.sessionId !== currentState.sessionId) {
            newState.sessionId = fetchedData.sessionId;
          }
          if (fetchedData.transactionKey !== currentState.transactionKey) {
            newState.transactionKey = fetchedData.transactionKey;
          }

          if (mobileNumber !== currentState.mobileNumber) {
            newState.mobileNumber = mobileNumber;
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
