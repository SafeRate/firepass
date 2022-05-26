import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GRAPHQL_URL } from "./utils/constants";
import useFetch from "./utils/useFetch";

const Passcode = (props) => {
  const [formErrors, setFormErrors] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [SSN, setSSN] = useState("");
  const [zipCode, setZipCode] = useState("");
  console.log("formErrors", formErrors);

  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems="center"
        flexDirection={"column"}
      >
        <Box maxW="20rem">
          <FormControl isInvalid={formErrors.includes("passcode")} my="2">
            <FormLabel htmlFor="passcode">Passcode</FormLabel>
            <Input
              id="passcode"
              type="text"
              value={passcode}
              onChange={(e) => {
                if (e.target.value && e.target.value.length > 6) {
                  return;
                }

                setPasscode(e.target.value);
              }}
            />
            {formErrors.includes("passcode") && (
              <FormErrorMessage>
                Invalid characters or is the wrong length
              </FormErrorMessage>
            )}
            <FormHelperText>
              This is a number that is text messaged to you
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={formErrors.includes("zipCode")} my="2">
            <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
            <Input
              id="zipCode"
              type="text"
              value={zipCode}
              onChange={(e) => {
                if (e.target.value && e.target.value.length > 5) {
                  return;
                }

                setZipCode(e.target.value);
              }}
            />
            {formErrors.includes("zipCode") && (
              <FormErrorMessage>
                Invalid characters or is the wrong length
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={formErrors.includes("SSN")} my="2">
            <FormLabel htmlFor="SSN">Last 4 Digits of SSN</FormLabel>
            <Input
              id="SSN"
              type="password"
              value={SSN}
              onChange={(e) => {
                if (e.target.value && e.target.value.length > 4) {
                  return;
                }

                setSSN(e.target.value);
              }}
            />
            {formErrors.includes("SSN") && (
              <FormErrorMessage>
                Invalid characters or is the wrong length
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" alignItems="flex-end" my="4" mx="10">
        <Box>
          <Button
            colorScheme={"purple"}
            isDisabled={isFetching}
            isLoading={isFetching}
            onClick={() => {
              const formErrors = [];
              if (!zipCode || !passcode || !SSN) {
                if (!zipCode) {
                  formErrors.push("zipCode");
                }

                if (!passcode) {
                  formErrors.push("passcode");
                }

                if (!SSN) {
                  formErrors.push("SSN");
                }

                setFormErrors(formErrors);

                return;
              }

              const digitsZipCode = zipCode.match(/\d/g).join("");
              const digitsPasscode = passcode.match(/\d/g).join("");
              const digitsSSN = SSN.match(/\d/g).join("");

              const isValidPasscode = digitsPasscode.length === 6;
              const isValidSSN = digitsSSN.length === 4;
              const isValidZipCode = digitsZipCode.length === 5;

              if (!isValidPasscode) {
                formErrors.push("passcode");
              }

              if (!isValidSSN) {
                formErrors.push("SSN");
              }

              if (!isValidZipCode) {
                formErrors.push("zipCode");
              }

              if (formErrors.length === 0) {
                setIsFetching(true);
              } else {
                setFormErrors(formErrors);
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Flex>
      {isFetching && (
        <PasscodeFetch
          SSN={SSN}
          zipCode={zipCode}
          passcode={passcode}
          setIsFetching={setIsFetching}
          setFormErrors={setFormErrors}
          {...props}
        />
      )}
      {formErrors && formErrors.includes("server") && (
        <Box color={"red.600"}>Internal server error</Box>
      )}
    </>
  );
};

export default Passcode;

const PasscodeFetch = ({
  currentState,
  passcode,
  setCurrentState,
  setFormErrors,
  setIsFetching,
  SSN,
  zipCode,
}) => {
  const { data, error } = useFetch<any>(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
          query completeInstaTouchIdOtp($mobileNumber: String!, $passcode: String!, $sessionId: String!, $transactionKey: String!, $zipCode: String!, $ssn: String!) {
            completeInstaTouchIdOtp(mobileNumber: $mobileNumber, passcode: $passcode, sessionId: $sessionId, transactionKey: $transactionKey, zipCode: $zipCode, SSN: $ssn) {
                sessionId
                transactionKey
            }
          }
        `,
      variables: {
        mobileNumber: currentState.mobileNumber,
        passcode,
        sessionId: currentState.sessionId,
        SSN,
        transactionKey: currentState.transactionKey,
        zipCode,
      },
    }),
  });

  useEffect(() => {
    if (data) {
      if (data.data) {
        if (data.data.completeInstaTouchIdOtp) {
          const newState = { ...currentState };

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
