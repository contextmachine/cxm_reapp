import React, { useState, useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import BufferModel from "./buffer-model";
import { globalUrl } from "../../../store/server";

import axios from "axios";

const BufferIfcGroup = ({ includedKeys, pid }) => {
  const [serverInit, setServerInit] = useState(false);

  const [JSONlinks, setJSONllinks] = useState();
  const [JSON_names, setJSON_names] = useState();

  /* Хук: статус сообщение */
  const setLoadingMessage = useStatusStore(
    ({ setLoadingMessage }) => setLoadingMessage
  );

  const setLoadingFileIndex = useStatusStore(
    ({ setLoadingFileIndex }) => setLoadingFileIndex
  );
  const loadingFileIndex = useStatusStore(
    ({ loadingFileIndex }) => loadingFileIndex
  );

  /* Шаг 1: Получаем ключи и отфильтировываем нужные для отображения */
  useEffect(() => {
    if (!serverInit && (includedKeys || (!includedKeys && pid === "all"))) {
      setLoadingMessage({ message: "Подключаемся к серверу", type: "full" });

      const url = `${globalUrl}get_keys`;

      axios.get(url).then((response) => {
        const { data: keys = [] } = response;

        /* Шаг 1.1 отфильтровать ключи, которые не относятся к данной сцене */
        const usedKeys = includedKeys
          ? keys.filter((name) => includedKeys.includes(name))
          : [...keys];

        const keyLinks = [...usedKeys].map(
          (item) => `${globalUrl}get_part/${item}`
        );

        setJSONllinks(keyLinks);
        setJSON_names(usedKeys);
        setServerInit(true);

        setLoadingMessage({ message: "Подключился", type: "full" });
      });
    }
  }, [serverInit, includedKeys, pid]);

  /* Шаг 2: Запускаем загрузку первого ключа по индексу */
  useEffect(() => {
    if (serverInit) {
      if (JSONlinks && JSONlinks.length > 0) {
        setLoadingFileIndex(0);
      }
    }
  }, [JSONlinks, serverInit]);

  /* Шаг 2.1: Закидываем в Статус номер загружаемого ключа */
  useEffect(() => {
    if (serverInit) {
      if (loadingFileIndex < JSONlinks.length) {
        setLoadingMessage({
          message: `Файл ${loadingFileIndex + 1} из ${JSONlinks?.length}`,
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
