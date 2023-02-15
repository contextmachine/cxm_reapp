import { useEffect, useState } from "react";
import { getSceneData } from "../../../../lib/sanity";
import useToolsStore from "../../../../store/tools-store";
import useStatusStore from "../../../../store/status-store";
import useLogsStore from "../../../../store/logs-store";
import useGetProjectMeta from "./project-info/a-get-project-meta";
import useUpdateMeta from "./project-info/b-update-meta";
/*<foo onClick={() => {
  gl.render(scene, camera)
  const screenshot = gl.domElement.toDataURL()
*/

const sendSceneData = async (sceneId, lastVisitedDate, createdDate) => {
  return await fetch("/api/sanitySendSceneData", {
    method: "POST",
    "content-type": "application/json",
    body: JSON.stringify({
      scene_id: sceneId,
      last_visited: lastVisitedDate,
      date_created: createdDate,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((e) => console.log(e));
};

const updateScenePreviewData = async (
  projectMeta,
  previewImage,
  thumbnail_last_updated
) => {
  const { id } = projectMeta;

  await fetch("/api/sanityUpdateScenePreview", {
    method: "POST",
    "content-type": "application/json",
    body: JSON.stringify({
      id,
      thumbnail_img: previewImage,
      thumbnail_last_updated: thumbnail_last_updated,
    }),
  })
    .then((response) => response.json())
    .then((data) => {});

  return true;
};

export const useHandleUpdateInfo = ({ previewImage }) => {
  const projectMeta = useGetProjectMeta();
  const updateMeta = useUpdateMeta(projectMeta, previewImage);

  const [needsUpdate, setNeedsUpdate] = useState(false);
  const currentTime = new Date();

  const currentTimeString = `${currentTime.getFullYear()}-${(
    "0" +
    (currentTime.getMonth() + 1)
  ).slice(-2)}-${("0" + currentTime.getDate()).slice(-2)}`;

  /* useEffect(() => {
    if (needsUpdate || true) {
      let sceneUpdateStartTime = performance.now();

      sendSceneData(pid, currentTimeString, currentTimeString)
        .then((res) => {
          const { data } = res;
          if (data) {
            setSceneData(data);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setNeedsUpdate(false);
        });

      let sceneUpdateEndTime = performance.now();

      const processTimeResult = sceneUpdateEndTime - sceneUpdateStartTime;

      setLoadingDataSceneSanity(processTimeResult);

      setLogs([
        {
          content: `Call to update scene data on Sanity took ${
            sceneUpdateEndTime - sceneUpdateStartTime
          } milliseconds`,
        },
      ]);
    }
  }, [needsUpdate, pid, currentTimeString]); */
};
