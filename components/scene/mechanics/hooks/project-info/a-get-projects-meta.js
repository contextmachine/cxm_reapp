import { gql, useLazyQuery } from "@apollo/client";
import client from "../../../../apollo/apollo-client";
import { useEffect, useState } from "react";

const getProjectsHub = gql`
  query getProjectsHub {
    projects_projects_hub {
      id
      name
      thumb
      last_visited
    }
  }
`;

const useGetProjectsMeta = () => {
  const [projectsMeta, setProjectsMeta] = useState();

  const [getProjects, { data }] = useLazyQuery(getProjectsHub, {
    client,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (data) {
      const { projects_projects_hub: p = [] } = data;
      setProjectsMeta(p);
    }
  }, [data]);

  return projectsMeta;
};

export default useGetProjectsMeta;
