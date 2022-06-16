import { Box, Button, ButtonGroup, Flex, LinkBox } from "@chakra-ui/react";
import React from "react";

const Success = (props) => {
  console.log("props.currentState", props.currentState);

  if (!props.currentState.successData) {
    return <Box>Ut oh! We did not find your data</Box>;
  }

  const { successData } = props.currentState;

  const currentAddress = successData.currentAddresses[0];

  return (
    <Flex
      justifyContent={"left"}
      alignItems="left"
      flexDirection={"column"}
      padding="1rem 1.5rem"
    >
      <Box fontSize="md" fontWeight="600" my="2">
        Great, we were able to get your info!
      </Box>
      <Box>Address</Box>
      <Box>
        {currentAddress.streetAddress} {currentAddress.city},{" "}
        {currentAddress.state} {currentAddress.zipCode}
      </Box>
      <Box mt="1rem">Date of Birth</Box>
      <Box>{successData.identification.dob}</Box>
      <Box mt="1rem">Phone number</Box>
      <Box>{getPrettyPhone(successData.contact.mobile)}</Box>
      <Box mt="1rem">Last 4 digits of SS#</Box>
      <Box>
        {successData.identification.ssn.substr(
          successData.identification.ssn.length - 4
        )}
      </Box>
      <Box mt="1rem">Email</Box>
      <Box>{successData.contact.emailAddress}</Box>
      <ButtonGroup mt="1rem">
        <LinkBox>
          <Button as="a" colorScheme={"purple"} href="https://saferate.com">
            Get preapproved for a loan
          </Button>
        </LinkBox>
        <Button as={"a"} colorScheme={"blue"} href="https://saferate.com">
          Enroll in credit tracking
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default Success;

const getPrettyPhone = (s: string) => {
  return s.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};
