import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { SafeRateLogo } from "./components/SafeRateLogo";
import { GET_USER_DATA } from "./graphql";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useNavigate, createSearchParams } from "react-router-dom";

const Quote = () => {
  const [creditReport, setCreditReport] = useState("");
  const [property, setProperty] = useState("");

  const navigate = useNavigate();

  const { data, error } = useQuery(GET_USER_DATA, {
    variables: {},
  });

  let creditReports = [];
  let properties = [];

  console.log(creditReport);
  console.log(property);

  if (Array.isArray(data?.getUserCreditReports)) {
    creditReports = data.getUserCreditReports;
  }

  if (Array.isArray(data?.getUserProperties)) {
    properties = data.getUserProperties;
  }

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
          {!data ? (
            <div>Loading...</div>
          ) : (
            <div>
              <Box>
                <FormControl>
                  <FormLabel>Credit Report to Use</FormLabel>
                  <Select
                    placeholder="Select credit report"
                    onChange={(e) => setCreditReport(e.target.value)}
                  >
                    {creditReports.map((creditReport, cr) => {
                      return (
                        <option key={cr} value={creditReport.timestamp}>
                          {creditReport.timestamp.substring(0, 10)}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>Address to Use</FormLabel>
                  <Select
                    placeholder="Select property"
                    onChange={(e) => setProperty(e.target.value)}
                  >
                    {properties.map((property, p) => {
                      return (
                        <option key={p} value={property.display}>
                          {property.display}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    navigate({
                      pathname: "/quote-results",
                      search: `?${createSearchParams({
                        creditReport,
                        property,
                      })}`,
                    })
                  }
                  disabled={property === "" || creditReport === ""}
                  mt={3}
                >
                  Get Quote
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Quote;
