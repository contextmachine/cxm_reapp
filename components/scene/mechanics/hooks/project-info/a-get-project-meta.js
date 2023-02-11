import { useRouter } from "next/router";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import client from "../../../../apollo/apollo-client";
import { useEffect, useState } from "react";

const getProjectsHub = gql`
  query getProjectsHub($name: String!) {
    projects_projects_hub(where: { name: { _eq: $name } }) {
      id
      name
      thumb
    }
  }
`;

const addProjectQ = gql`
  mutation addProject($name: String!) {
    insert_projects_projects_hub_one(object: { name: $name }) {
      id
      name
      thumb
    }
  }
`;

const useGetProjectMeta = () => {
  const router = useRouter();
  const { query, isReady } = router;
  const { pid } = query;

  const [projectMeta, setProjectMeta] = useState();

  const [getProjects, { data }] = useLazyQuery(getProjectsHub, {
    client,
  });

  const [addProject] = useMutation(addProjectQ, {
    client,
    refetchQueries: [{ query: getProjectsHub }, "getProjectsHub"],
  });

  useEffect(() => {
    if (isReady) {
      getProjects({
        variables: {
          name: pid,
        },
      });
    }
  }, [pid, isReady]);

  useEffect(() => {
    if (data && isReady && pid) {
      const { projects_projects_hub: p = [] } = data;

      if (p && p.length > 0) {
        const [projectMeta] = p;
        setProjectMeta(projectMeta);
      } else {
        addProject({
          variables: {
            name: pid,
          },
        });
      }
    }
  }, [data, pid, isReady]);

  return projectMeta;
};

export default useGetProjectMeta;
