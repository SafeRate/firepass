import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { SafeRateLogo } from "./components/SafeRateLogo";
import Passcode from "./Passcode";
import Success from "./Success";
import VerifyIdentity from "./VerifyIdentity";
import MobileNumber from "./MobileNumber";

const App = () => {
  const [currentState, setCurrentState] = useState({
    carrier: null,
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
          <SafeRateLogo width="6rem" />{" "}
          <Box fontWeight={"extrabold"} fontSize="2xl">
            SafeRate FirePass
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
            <MobileNumber
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : currentState.stepNumber === 3 ? (
            <Passcode
              currentState={currentState}
              setCurrentState={setCurrentState}
            />
          ) : (
            <Success />
          )}
        </Box>
        {/* <Flex py="2" justifyContent={"flex-end"}>
          {currentState.stepNumber > 1 && (
            <Button
              colorScheme={"blue"}
              size="xs"
              onClick={() =>
                setCurrentState({ ...currentState, stepNumber: 1 })
              }
            >
              Start over
            </Button>
          )}
        </Flex> */}
      </Box>
    </Flex>
  );
};

export default App;
