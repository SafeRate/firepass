import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { SafeRateLogo } from "./components/SafeRateLogo";
import { GET_FIREPASS_QUOTE } from "./graphql";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import numeral from "numeral";

const QuoteResult = () => {
  const [searchParams] = useSearchParams();
  const creditReport = searchParams.get("creditReport");
  const property = searchParams.get("property");

  let mortgage: any = {};
  let homeowners: any = {};
  let flood: any = {};

  let mortgagePayment = 0;
  let homeownersPayment = 0;
  let floodPayment = 0;
  let floodPaymentPrivate = 0;
  let floodPaymentPublic = 0;
  let totalPayment = 0;

  const loanTerm = 30;
  const loanAmount = 320000;
  const propertyValue = 400000;

  const { data, error } = useQuery(GET_FIREPASS_QUOTE, {
    variables: {
      quoteRequest: {
        auto: false,
        autoIds: [],
        creditTimestamp: creditReport,
        flood: true,
        floodOptions: {},
        homeowners: true,
        homeownersOptions: {},
        mortgage: true,
        mortgageOptions: {
          combinedLoanToValue: 80,
          loanAmount,
          loanTerm,
          loanToValue: 80,
          propertyValue,
        },
        propertyDisplay: property,
      },
    },
  });

  if (data?.getFirePassQuote) {
    const quoteResult = data.getFirePassQuote;

    if (quoteResult.mortgage) {
      mortgage = quoteResult.mortgage;
      mortgagePayment = mortgage.lowestRate.monthlyPayment;
    }

    if (quoteResult.flood) {
      flood = quoteResult.flood;
      if (Array.isArray(flood.public)) {
        for (let p = 0; p < flood.public.length; p++) {
          const fquote = flood.public[p];
          if (fquote.estimatedPremium) {
            if (
              floodPaymentPublic === 0 ||
              fquote.estimatedPremium < floodPaymentPublic
            ) {
              floodPaymentPublic = fquote.estimatedPremium;
            }
          }
        }

        floodPaymentPublic = floodPaymentPublic / 12.0;

        for (let p = 0; p < flood.private.length; p++) {
          const fquote = flood.private[p];
          if (fquote.estimatedPremium) {
            if (
              floodPaymentPrivate === 0 ||
              fquote.estimatedPremium < floodPaymentPrivate
            ) {
              floodPaymentPrivate = fquote.estimatedPremium;
            }
          }
        }

        floodPaymentPrivate = floodPaymentPrivate / 12.0;

        if (floodPaymentPublic === 0) {
          floodPayment = floodPaymentPrivate;
        } else if (floodPaymentPrivate === 0) {
          floodPayment = floodPaymentPublic;
        } else {
          floodPayment =
            floodPaymentPrivate < floodPaymentPublic
              ? floodPaymentPrivate
              : floodPaymentPublic;
        }
      }
    }

    if (quoteResult.homeowners) {
      homeowners = quoteResult.homeowners;
      if (homeowners.premium) {
        homeownersPayment = homeowners.premium.total.amount / 12.0;
      }
    }

    totalPayment = homeownersPayment + floodPayment + mortgagePayment;
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
          <div>
            <Box>
              <Text>
                <b>{data ? "One Click Quote For" : "Getting Quote for..."}</b>
              </Text>
              <Text>Credit Report: {creditReport.substring(0, 10)}</Text>
              <Text>Property: {property}</Text>
            </Box>
            <Divider />
            {!data ? (
              <div>Loading...</div>
            ) : (
              <div>
                <Box mt={5}>
                  <Text>
                    <b>
                      Total Monthly Payment:{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(totalPayment)}
                    </b>
                  </Text>
                </Box>
                <Box mt={5}>
                  <Text>
                    <b>Mortgage</b>
                  </Text>
                  <Text>
                    Loan Amount:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(loanAmount)}
                  </Text>
                  <Text>
                    Property Value:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(propertyValue)}
                  </Text>
                  <Text>
                    Interest Rate:{" "}
                    {new Intl.NumberFormat("default", {
                      style: "percent",
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    }).format(mortgage.lowestRate.interestRate)}
                  </Text>
                  <Text>
                    Monthly Payment:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(mortgage.lowestRate.monthlyPayment)}
                  </Text>
                  <Text>Loan Term: {loanTerm} years</Text>
                </Box>
                <Box mt={5}>
                  <Text>
                    <b>Homeowners Insurance</b>
                  </Text>
                  <Text>
                    Monthly Premium:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(homeownersPayment)}
                  </Text>
                </Box>
                <Box mt={5}>
                  <Text>
                    <b>Flood</b>
                  </Text>
                  <Text>Flood Zone: {flood.floodZone}</Text>
                  <Text>
                    Public option payment:{" "}
                    {floodPaymentPublic
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(floodPaymentPublic)
                      : "Not available"}
                  </Text>
                  <Text>
                    Private option payment:{" "}
                    {floodPaymentPrivate
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(floodPaymentPrivate)
                      : "Not available"}
                  </Text>
                  <Text>
                    Lowest payment:{" "}
                    {floodPayment === floodPaymentPublic
                      ? "Public"
                      : "Private "}
                  </Text>
                </Box>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </Flex>
  );
};

export default QuoteResult;
