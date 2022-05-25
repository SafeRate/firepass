import React from "react";
import { GRAPHQL_URL } from "./utils/constants";
import useFetch from "./utils/useFetch";

const App = () => {
  // const { data, error } = useFetch(GRAPHQL_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     query: `
  //         query GetLearnWithJasonEpisodes($now: DateTime!) {
  //           allEpisode(limit: 10, sort: {date: ASC}, where: {date: {gte: $now}}) {
  //             date
  //             title
  //             guest {
  //               name
  //               twitter
  //             }
  //             description
  //           }
  //         }
  //       `,
  //     variables: {
  //       now: new Date().toISOString(),
  //     },
  //   }),
  // });

  return <div>App</div>;
};

export default App;
