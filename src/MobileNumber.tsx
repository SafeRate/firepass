import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import InputPhoneNumber from "./components/InputPhoneNumber";
import { GRAPHQL_URL } from "./utils/constants";
import useFetch from "./utils/useFetch";

const MobileNumber = (props) => {
  const [isMobileNumberInvalid, setIsMobileNumberInvalid] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems="center"
        flexDirection={"column"}
      >
        <Box fontSize="2xl" fontWeight="bold" my="2">
          Enter your cell phone
        </Box>
        <InputPhoneNumber
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            setMobileNumber(e.target.value);
          }}
          size="md"
          maxW="64"
        />
        {isMobileNumberInvalid && (
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
                if (isMobileNumberInvalid) {
                  setIsMobileNumberInvalid(false);
                }
                setIsFetching(true);
              } else {
                setIsMobileNumberInvalid(true);
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Flex>
      {isFetching && (
        <MobileNumberFetch mobileNumber={mobileNumber} {...props} />
      )}
    </>
  );
};

export default MobileNumber;

const MobileNumberFetch = ({ currentState, mobileNumber, setCurrentState }) => {
  const { data, error } = useFetch<any>(GRAPHQL_URL, {
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
    }
  }, [error]);

  return <></>;
};
