import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import client from "./apollo-client";
import { useEffect } from "react";

const getProjectsHub = gql`
  query MyQuery {
    project_hub {
      id
    }
  }
`;

const TestApollo = () => {
  const [getProjects, { data, error }] = useLazyQuery(getProjectsHub, {
    client,
  });

  useEffect(() => {
    getProjects();
  }, []);

  return <></>;
};

export default TestApollo;
