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

import useHandleStatus from "../../components/ui/main/hooks/use-handle-status";
import LocalScripts from "../../components/ui/main/hooks/local-scripts";
import useKeysAndHeaders from "../../components/ui/main/hooks/use-keys-and-headers";

import { CoreLayout, Screen, Space3D } from "../../components/ui/main/__styles";
import AuthWrapper from "../../components/main/auth-wrapper";
import GUI from "../../components/ui/gui/gui";

const App = () => {
  const [needsData, setNeedsData] = useState(false);

  const [tools, setTools] = useState(true);

  const [isExportScreen, setExportScreen] = useState(false);
  const [headers, setHeaders] = useState(null);

  const [viewType, setViewType] = useState("ortho");

  /* Шаг 0: данные пользователя */
  const [userFetched, setUserFetched] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          }

          setUserFetched(true);
        });
    }
  }, [user]);

  /* Шаг 1: Подчищаем данные */
  const setLayersData = useStatusStore(({ setLayersData }) => setLayersData);
  const setMetaData = useStatusStore(({ setMetaData }) => setMetaData);
  const setMouse = useToolsStore(({ setMouse }) => setMouse);
  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  const setInitialZoomId = useStatusStore(
    ({ setInitialZoomId }) => setInitialZoomId
  );

  useEffect(() => {
    setLayersData({});
    setMetaData({});
    setMouse(false);
    setBoundingBox(null);
    setInitialZoomId(null);
  }, []);

  /* Шаг 1: Ключи, Headers и настройка камеры */
  const [includedKeys, setIncludedKeys] = useState(null);

  const router = useRouter();
  const { query = {} } = router ? router : {};
  const { pid, experimental } = query;

  /* Шаг 1.1: Хук */
  useKeysAndHeaders({
    pid,
    setIncludedKeys,
    setViewType,
    setHeaders,
    setInitialZoomId,
  });

  /* Настроить взаимодействие с telegram API */
  useHandleStatus({ pid, isExportScreen, tools, user });

  return (
    <AuthWrapper user={user} userFetched={userFetched}>
      <CoreLayout>
        <LocalScripts />

        <Screen>
          <TopBar headers={headers} />

          <GUI />

          <Export
            enabled={isExportScreen}
            {...{ setExportScreen, setNeedsData }}
          />

          <View {...{ viewType, setViewType }} />

          <Loading />

          <Space3D>
            {(includedKeys ||
              (!includedKeys && pid === "all") ||
              experimental) && (
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
    </AuthWrapper>
  );
};

export default App;
