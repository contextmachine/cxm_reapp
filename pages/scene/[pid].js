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
import { useHandleUpdateInfo } from "../../components/scene/mechanics/hooks/handle-update-info";
import Popover from "../../components/ui/popover/popover";
import useLightingStore from "../../store/lighting-store";
import useLogsStore from "../../store/logs-store";

const App = () => {
  const [needsData, setNeedsData] = useState(false);

  const [tools, setTools] = useState(true);

  const [isExportScreen, setExportScreen] = useState(false);
  const [headers, setHeaders] = useState(null);

  const [viewType, setViewType] = useState("ortho");

  /* Шаг 0: данные пользователя */
  const [userFetched, setUserFetched] = useState(false);
  const [user, setUser] = useState(null);

  const [sceneData, setSceneData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const setLoadingAuth = useStatusStore(({ setLoadingAuth }) => setLoadingAuth);

  /* Шаг 0.5: Логи */
  const setLogs = useLogsStore(({ setLogs }) => setLogs);
  const setEmptyLogs = useLogsStore(({ setEmptyLogs }) => setEmptyLogs);

  useEffect(() => {
    setEmptyLogs();
  }, []);

  useEffect(() => {
    if (!user && setLoadingAuth) {
      let authStartTime = performance.now();

      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          }

          setUserFetched(true);
        });

      let authEndTime = performance.now();

      const resultTime = authEndTime - authStartTime;
      setLoadingAuth(resultTime);

      setLogs([
        {
          content: (
            <div>
              Call to fetch user info took{" "}
              <span style={{ color: "#ef6016" }}>
                {Math.round(resultTime * 1000) / 1000} ms
              </span>
            </div>
          ),
        },
      ]);
    }
  }, [user, setLoadingAuth]);

  /* Шаг 1: Подчищаем данные */
  const setLayersData = useStatusStore(({ setLayersData }) => setLayersData);
  const setMetaData = useStatusStore(({ setMetaData }) => setMetaData);
  const setMouse = useToolsStore(({ setMouse }) => setMouse);
  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  const setInitialZoomId = useStatusStore(
    ({ setInitialZoomId }) => setInitialZoomId
  );

  const setLights = useLightingStore(({ setLights }) => setLights);

  useEffect(() => {
    let cleanupStartTime = performance.now();

    setLayersData({});
    setMetaData({});
    setMouse(false);
    setBoundingBox(null);
    setInitialZoomId(null);
    setPreviewImage(null);
    setLights({});

    let cleanupEndTime = performance.now();

    setLogs([
      {
        content: (
          <div>
            Call to clear states took&nbsp;
            <span style={{ color: "#ef6016" }}>
              {Math.round((cleanupEndTime - cleanupStartTime) * 1000) / 1000} ms
            </span>{" "}
          </div>
        ),
      },
    ]);
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

  useHandleUpdateInfo({ pid, sceneData, setSceneData, previewImage });

  return (
    <AuthWrapper user={user} userFetched={userFetched}>
      <CoreLayout>
        <LocalScripts />

        <Screen>
          <TopBar headers={headers} />

          <GUI />

          <Export
            enabled={isExportScreen}
            {...{ setExportScreen, setNeedsData, sceneData }}
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
                  setPreviewImage,
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
