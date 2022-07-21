import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  ButtonGroup,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import GeographySearch from "./GeographySearch";
import { GET_INSTA_TOUCH_ID_SESSION } from "./graphql";
import PlaidButton from "./PlaidButton";
import { VerifyProperty } from "./VerifyProperty";

const VerifyIdentity = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [verifyProperty, setVerifyProperty] = useState("");

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      flexDirection={"column"}
    >
      <Box fontSize="md" fontWeight="400" padding="1rem 1.5rem">
        Welcome to Safe Rate! What would you like to do?
      </Box>
      <ButtonGroup>
        <Button
          colorScheme={"purple"}
          isDisabled={isFetching}
          isLoading={isFetching}
          my="3"
          onClick={() => {
            setIsFetching(true);
          }}
        >
          Verify My Identity
        </Button>
        <PlaidButton />
      </ButtonGroup>
      {verifyProperty ? (
        <VerifyProperty fullAddress={verifyProperty} />
      ) : (
        <GeographySearch
          label={"Verify A Property"}
          name={"Address"}
          allowMultiple={false}
          maxSelect={1}
          searchAddress={true}
          searchCity={false}
          searchNeighborhood={false}
          searchPostcode={false}
          searchCountry={false}
          searchCounty={false}
          onChange={(value) => {
            if (Array.isArray(value) && value.length > 0) {
              const fullAddress = value[0].label;
              setVerifyProperty(fullAddress);
            }
          }}
        />
      )}

      {isFetching && (
        <VerifyIdentityFetch
          {...props}
          setFormErrors={setFormErrors}
          setIsFetching={setIsFetching}
        />
      )}
      {formErrors && formErrors.includes("server") && (
        <Box color={"red.600"}>Internal server error</Box>
      )}
    </Flex>
  );
};

export default VerifyIdentity;

const VerifyIdentityFetch = ({
  currentState,
  setCurrentState,
  setFormErrors,
  setIsFetching,
}) => {
  const { data, error } = useQuery(GET_INSTA_TOUCH_ID_SESSION);

  useEffect(() => {
    if (data) {
      if (data.getInstaTouchIdSession) {
        const fetchedData = data.getInstaTouchIdSession;

        const newState = { ...currentState };
        if (fetchedData.carrier !== currentState.carrier) {
          newState.carrier = fetchedData.carrier;
        }
        if (fetchedData.instaTouch !== currentState.instaTouch) {
          newState.instaTouch = fetchedData.instaTouch;
        }
        if (fetchedData.sessionId !== currentState.sessionId) {
          newState.sessionId = fetchedData.sessionId;
        }

        newState.stepNumber = currentState.stepNumber += 1;

        setCurrentState(newState);
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
