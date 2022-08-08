import React, { useState, useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import Buffer3dm from "./buffer-3dm";
import BufferModel from "./buffer-model";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const BufferRhinoGroup = () => {
  const [JSONlinks, setJSONllinks] = useState();
  const [JSON_names, setJSON_names] = useState();
  const [serverInit, setServerInit] = useState(false);
  const setLoadingMessage = useStatusStore(
    ({ setLoadingMessage }) => setLoadingMessage
  );

  const setLoadingFileIndex = useStatusStore(
    ({ setLoadingFileIndex }) => setLoadingFileIndex
  );
  const loadingFileIndex = useStatusStore(
    ({ loadingFileIndex }) => loadingFileIndex
  );

  const { scene } = useThree();

  useEffect(() => {
    if (!serverInit) {
      setLoadingMessage({ message: "Подключаемся к серверу", type: "full" });

      fetch("https://mmodel.contextmachine.online:8181/rh/get_keys")
        .then((response) => {
          return response.json();
        })
        .then((keys) => {
          setJSONllinks(
            keys
              .filter((_, i) => i <= 14)
              .map((item) => {
                return `https://mmodel.contextmachine.online:8181/rh/get_part/${item}`;
              })
          );
          setJSON_names(keys);
          setServerInit(true);
          setLoadingMessage({ message: "Подключился", type: "full" });
        });
    }
  }, [serverInit]);

  useEffect(() => {
    if (serverInit) {
      if (JSONlinks && JSONlinks.length > 0) {
        setLoadingFileIndex(0);
      }
    }
  }, [JSONlinks, serverInit]);

  useEffect(() => {
    if (serverInit) {
      if (loadingFileIndex < JSONlinks.length) {
        setLoadingMessage({
          message: <>Файл&nbsp;{loadingFileIndex}</>,
          type: "mini",
        });
      } else {
        setLoadingMessage(null);
      }
    }
  }, [serverInit, loadingFileIndex, JSONlinks]);

  const group = new THREE.Group();

  useEffect(() => {
    scene.add(group);
    group.scale.x = 0.0001;
    group.scale.y = 0.0001;
    group.scale.z = 0.0001;
  }, [group]);

  return (
    <group>
      {JSONlinks &&
        JSONlinks.length > 0 &&
        JSONlinks.map((path, i) => {
          return (
            <Buffer3dm
              {...{ index: i }}
              key={`b:${i}`}
              path={path}
              group={group}
              layerName={JSON_names[i]}
            />
          );
        })}
    </group>
  );
};

export default BufferRhinoGroup;
