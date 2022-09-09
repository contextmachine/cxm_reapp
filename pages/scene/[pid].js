import React, { useEffect, useState } from "react";
import ToolsPanel from "./tools";
import TopBar from "./topbar";
import View from "./view";
import Scene from "../../components/scene/scene";
import { useRouter } from "next/router";

import Export from "./export";
import Loading from "./loading";
import useStatusStore from "../../store/status-store";
import useToolsStore from "../../store/tools-store";

import useHandleStatus from "./hooks/use-handle-status";
import LocalScripts from "./hooks/local-scripts";
import useKeysAndHeaders from "./hooks/use-keys-and-headers";

import { CoreLayout, Screen, Space3D } from "./__styles";

const App = () => {
  const [needsData, setNeedsData] = useState(false);

  const [tools, setTools] = useState(true);

  const [isExportScreen, setExportScreen] = useState(false);
  const [headers, setHeaders] = useState(null);

  const [viewType, setViewType] = useState("ortho");

  /* Шаг 1: Подчищаем данные */
  const setLayersData = useStatusStore(({ setLayersData }) => setLayersData);
  const setMetaData = useStatusStore(({ setMetaData }) => setMetaData);
  const setMouse = useToolsStore(({ setMouse }) => setMouse);
  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);

  useEffect(() => {
    setLayersData({});
    setMetaData({});
    setMouse(false);
    setBoundingBox(null);
  }, []);

  /* Шаг 1: Ключи, Headers и настройка камеры */
  const [includedKeys, setIncludedKeys] = useState(null);

  const router = useRouter();
  const { query = {} } = router ? router : {};
  const { pid } = query;

  /* Шаг 1.1: Хук */
  useKeysAndHeaders({ pid, setIncludedKeys, setViewType, setHeaders });

  /* Настроить взаимодействие с telegram API */
  useHandleStatus({ pid, isExportScreen, tools });

  return (
    <CoreLayout>
      <LocalScripts />

      <Screen>
        <TopBar headers={headers} />

        <Export
          enabled={isExportScreen}
          {...{ setExportScreen, setNeedsData }}
        />

        <View {...{ viewType, setViewType }} />

        <Loading />

        <Space3D>
          {(includedKeys || (!includedKeys && pid === "all")) && (
            <Scene
              {...{
                viewType,
                includedKeys,
                pid,
              }}
            />
          )}
        </Space3D>

        <ToolsPanel enabled={tools} {...{ setTools, setExportScreen }} />
      </Screen>
    </CoreLayout>
  );
};

export default App;
