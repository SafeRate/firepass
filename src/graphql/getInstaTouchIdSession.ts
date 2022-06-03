import { gql } from "@apollo/client";

export const getInstaTouchIdSession = gql`
  query getInstaTouchIdSession {
    getInstaTouchIdSession {
      carrier
      instaTouch
      sessionId
    }
  }
`;
