import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button } from "@chakra-ui/react";
import React from "react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box>
      <Button colorScheme={"pink"} onClick={() => {}}>
        Sign In
      </Button>
    </Box>
  );
};

export default Login;
