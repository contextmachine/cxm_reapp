import { useEffect, useState } from "react";
import { getSceneData } from "../../../../lib/sanity";
import { useThree } from "@react-three/fiber";
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
  _id,
  previewImage,
  thumbnail_last_updated
) => {
  return await fetch("/api/sanityUpdateScenePreview", {
    method: "POST",
    "content-type": "application/json",
    body: JSON.stringify({
      _id: _id,
      thumbnail_img: previewImage,
      thumbnail_last_updated: thumbnail_last_updated,
    }),
  });
};

export const useHandleUpdateInfo = ({
  pid,
  sceneData,
  setSceneData,
  previewImage,
}) => {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const currentTime = new Date();

  const currentTimeString = `${currentTime.getFullYear()}-${(
    "0" +
    (currentTime.getMonth() + 1)
  ).slice(-2)}-${("0" + currentTime.getDate()).slice(-2)}`;

  // Загрузка данных из Sanity
  useEffect(() => {
    if (pid) {
      getSceneData({ pid })
        .then((res) => {
          console.log({ res });
          if (res.length === 0) {
            //setSceneData({});
            setNeedsUpdate(true);
          } else {
            setSceneData(res[0]);
          }
        })
        .catch((e) => console.log({ e }));
    }
  }, []);

  useEffect(() => {
    if (needsUpdate) {
      sendSceneData(pid, currentTimeString, currentTimeString)
        .then((res) => {
          console.log({ res }, 100);
          setSceneData(res[0]);
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setNeedsUpdate(false);
        });
    }
  }, [needsUpdate]);

  console.log({ sceneData });

  useEffect(() => {
    if (pid && previewImage && sceneData?._id) {
      const _id = sceneData?._id;

      const thumbnail_img = previewImage;
      //console.log({ thumbnail_img });

      updateScenePreviewData(_id, thumbnail_img, currentTimeString)
        .then((res) => console.log({ res }, 2000))
        .catch((e) => console.log(e));
    }
  }, [previewImage]);
};
