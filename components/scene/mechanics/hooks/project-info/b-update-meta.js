import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

import useLogsStore from "../../../../../store/logs-store";

import { gql, useMutation } from "@apollo/client";
import client from "../../../../apollo/apollo-client";

const UPDATE_META = gql`
  mutation updateMeta($id: uuid!, $thumb: String) {
    update_projects_projects_hub_by_pk(
      pk_columns: { id: $id }
      _set: { thumb: $thumb }
    ) {
      id
    }
  }
`;

const useUpdateMeta = (projectMeta, previewImage) => {
  const router = useRouter();
  const { query } = router;
  const { pid } = query;

  const [updateMeta, { data, error }] = useMutation(UPDATE_META, {
    client,
  });

  const setLogs = useLogsStore(({ setLogs }) => setLogs);

  useEffect(() => {
    if (pid && previewImage && projectMeta) {
      let start_task = performance.now();

      const { id } = projectMeta;

      axios
        .post("/api/sanityUpdateScenePreview", {
          id,
          thumbnail_img: previewImage,
        })
        .then((response) => {
          const { data = {} } = response;
          const { url } = data;

          updateMeta({ variables: { id, thumb: url } });
        })
        .catch((error) => {
          console.error(error);
        });

      let end_task = performance.now();
      const processTimeResult = end_task - start_task;

      setLogs([
        {
          content: `Call to update scene thumbnail on Sanity took ${processTimeResult} milliseconds`,
        },
      ]);
    }
  }, [previewImage, pid, projectMeta]);
};

export default useUpdateMeta;
