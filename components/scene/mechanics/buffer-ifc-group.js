import React, { useState, useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import BufferModel from "./buffer-model";

import { useRouter } from "next/router";

import axios from "axios";

const BufferIfcGroup = ({ includedKeys, pid }) => {
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

  useEffect(() => {
    console.log("pid", pid);

    if (!serverInit && (includedKeys || (!includedKeys && pid === "all"))) {
      setLoadingMessage({ message: "Подключаемся к серверу", type: "full" });

      const url = "https://mmodel.contextmachine.online:8181/get_keys";

      axios.get(url).then((response) => {
        const { data: keys } = response;

        setJSONllinks(
          keys
            .filter((name) => {
              if (includedKeys) {
                if (includedKeys.includes(name)) return true;

                return false;
              } else {
                return true;
              }
            })
            .filter((_, i) => i <= 14)
            .map((item) => {
              return `https://mmodel.contextmachine.online:8181/get_part/${item}`;
            })
        );
        setJSON_names(keys);
        setServerInit(true);
        setLoadingMessage({ message: "Подключился", type: "full" });
      });
    }
  }, [serverInit, includedKeys, pid]);

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

  return (
    <group>
      {JSONlinks &&
        JSONlinks.length > 0 &&
        JSONlinks.map((path, i) => {
          return (
            <BufferModel
              {...{ index: i }}
              key={`b:${i}`}
              path={path}
              layerName={JSON_names[i]}
            />
          );
        })}
    </group>
  );
};

export default BufferIfcGroup;
