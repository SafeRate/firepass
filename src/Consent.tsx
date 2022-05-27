import { Box, Button, Code, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const Consent = ({ currentState, setCurrentState }) => {
  return (
    <Flex
      justifyContent={"left"}
      alignItems="left"
      flexDirection={"column"}
      padding="1rem 1.5rem"
    >
      <Box fontSize="md" fontWeight="bold" textAlign={"center"}>
        About your data
      </Box>
      <Box mt="1rem" fontWeight="600" fontSize="sm">
        What information about me are you obtaining?
      </Box>
      <Box mt="0.25rem" fontSize="sm">
        The data we obtain from Equifax may include date of birth, social
        security number, current address, email, and mobile phone number.
      </Box>
      <Box mt="1rem" fontWeight="600" fontSize="sm">
        How will the information be used?
      </Box>
      <Box mt="0.25rem" fontSize="sm">
        You can decide to use your identity information to begin monitoring your
        credit score and receive personalized recommendations to strengthen your
        credit score. You can also request that we use your identity information
        to obtain a pre-approval or complete a loan application. These uses will
        only take place at your explicit request.
      </Box>
      <Box mt="1rem" fontWeight="600" fontSize="sm">
        How is the information being secured?
      </Box>
      <Box mt="0.25rem" fontSize="sm">
        We secure your identity information on the <a href="">Oasis Parcel</a>{" "}
        secure storage layer which is designed by a Macarthur Genius to put your
        most sensitive data to use while keeping it secure and private.
      </Box>
      <Box mt="1rem" fontWeight="600" fontSize="sm">
        Is the information shared with any other companies?
      </Box>
      <Box mt="0.25rem" fontSize="sm">
        No! Unless you specifically request for us to do so.
      </Box>
      <Box mt="1rem" fontWeight="600" fontSize="sm">
        Can I remove your access to the information?
      </Box>
      <Box mt="0.25rem" fontSize="sm">
        Yes! You can do so at any time. We will only need to retain the
        information if you complete a full loan application with us for
        regulatory reasons.
      </Box>
      <Button
        colorScheme={"purple"}
        my="3"
        onClick={() => {
          setCurrentState({
            ...currentState,
            consent: new Date().toISOString(),
            stepNumber: currentState.stepNumber + 1,
          });
        }}
      >
        I consent
      </Button>
    </Flex>
  );
};

export default Consent;
