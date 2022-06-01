import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { SafeRateLogo } from "./components/SafeRateLogo";
import Passcode from "./Passcode";
import Success from "./Success";
import VerifyIdentity from "./VerifyIdentity";
import MobileNumber from "./MobileNumber";
import Consent from "./Consent";

const Home = () => {
  const [currentState, setCurrentState] = useState({
    carrier: null,
    consent: null,
    instaTouch: null,
    mobileNumber: null,
    passcode: null,
    sessionId: null,
    SSN: null,
    stepNumber: 1,
    transactionKey: null,
    zipCode: null,
  });

  return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
      <Box
        maxW="32rem"
        w="full"
        bg={"white"}
        boxShadow="2xl"
        rounded={"lg"}
        p="2"
      >
        <Flex alignItems={"center"}>
          <SafeRateLogo width="9rem" />{" "}
          <Box
            ml={2}
            mt={0.8}
            fontFamily={"arial"}
            fontWeight={"normal"}
            fontSize="1.20rem"
          >
            FirePass
          </Box>
        </Flex>
        <Divider my="1" />
        <Box my="2">
          {currentState.stepNumber === 1 ? (
            <VerifyIdentity
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : currentState.stepNumber === 2 ? (
            <Consent
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : currentState.stepNumber === 3 ? (
            <MobileNumber
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : currentState.stepNumber === 4 ? (
            <Passcode
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : (
            <Success />
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Home;
