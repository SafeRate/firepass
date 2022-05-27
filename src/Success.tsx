import { Box, Button, ButtonGroup, Flex, LinkBox } from "@chakra-ui/react";
import React from "react";

const Success = (props) => {
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
      <Box>123 Main St Chicago, IL 12345</Box>
      <Box mt="1rem">Date of Birth</Box>
      <Box>April 12, 1986</Box>
      <Box mt="1rem">Phone number</Box>
      <Box>(XXX) 123-1234</Box>
      <Box mt="1rem">Email</Box>
      <Box>name@domain.com</Box>
      <ButtonGroup mt="1rem">
        <LinkBox>
          <Button as="a" colorScheme={"purple"} href="https://saferate.com">
            Get preapproved
          </Button>
        </LinkBox>
        <Button as={"a"} colorScheme={"blue"} href="https://saferate.com">
          Track my credit
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default Success;
