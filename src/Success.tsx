import { Box, Button, ButtonGroup, Flex, LinkBox } from "@chakra-ui/react";
import React from "react";

const Success = (props) => {
  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
    >
      <Box fontSize="2xl" fontWeight="bold" my="4">
        Success!
      </Box>
      <ButtonGroup>
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
