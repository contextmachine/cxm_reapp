import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import styled from "styled-components";
import { useRouter } from "next/router";
import ToolsPanel from "./tools";
import TopBar from "./topbar";
import View from "./view";
import Scene from "../../components/scene/scene";

import Export from "./export";
import CursorProvider from "../../components/scene/providers/cursor-providers";
import Loading from "./loading";
import axios from "axios";
import useStatusStore from "../../store/status-store";

const CoreLayout = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

const Screen = styled.div`
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background: white;

  position: relative;
`;

const DevMainbutton = styled.div`
  width: 100%;
  height: 62px;
  background: #40a7e3;
  font-size: 15px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Space3D = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  /* background: #f2f2f2; */

  background: #474141;
`;

const App = () => {
  const [needsData, setNeedsData] = useState(false);

  const [rhinoConnected, setRhinoConnected] = useState(false);
  const [tools, setTools] = useState(true);

  const [version, setVersion] = useState(null);

  const [isExportScreen, setExportScreen] = useState(false);
  const [headers, setHeaders] = useState(null);

  const [viewType, setViewType] = useState("ortho");

  /* Подчищаем данные */
  const setLayersData = useStatusStore(({ setLayersData }) => setLayersData);
  const setMetaData = useStatusStore(({ setMetaData }) => setMetaData);

  useEffect(() => {
    setLayersData({});
    setMetaData({});
  }, []);

  /* router */
  const router = useRouter();
  const { query = {} } = router ? router : {};
  const { dev, full, pid } = query;

  const [includedKeys, setIncludedKeys] = useState(null);

  const getIncludedKeys = (pid) => {
    if (pid === "all") return setIncludedKeys(null);

    const url = `https://mmodel.contextmachine.online:8181/scenes/${pid}`;

    return axios.get(url).then((response) => {
      const { data } = response;
      const { includes = [], metadata = {}, chart = {} } = data;
      const { headers = [] } = chart;
      const { default_view } = metadata;

      setHeaders(headers);

      if (
        default_view === "top" ||
        (default_view === "perspective" && default_view === "ortho")
      ) {
        setViewType(default_view);
      }

      setIncludedKeys(includes);
    });
  };

  useEffect(() => {
    if (pid) {
      getIncludedKeys(pid);
    }
  }, [pid]);

  const devMainbutton = useMemo(() => {
    if (dev) return true;
  }, [dev]);

  const fullsize = useMemo(() => {
    if (full) return true;
  });

  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;

      if (isExportScreen) {
        webapp.setBackgroundColor("#8F8F8F");
      } else {
        webapp.setBackgroundColor("#f2f2f2");
      }
    }
  }, [isExportScreen]);

  const handleStatus = (pid) => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;
      const mainbutton = webapp.MainButton;

      webapp.setBackgroundColor("#f2f2f2");

      webapp.expand();

      /*console.log("version", webapp.version);*/

      setVersion(webapp.version);

      /*webapp.headerColor = "#f2f2f2";
      webapp.backgroundColor = "#f2f2f2";*/

      if (mainbutton) {
        mainbutton.enable();
        mainbutton.show();
        mainbutton.setText("Открыть в новом окне");

        mainbutton.onClick(() => {
          window.open("https://cxm-reapp.vercel.app/scene/" + pid, "_blank");
          /*setTools((state) => !state)*/
        });
      }
    }
  };

  useEffect(() => {
    handleStatus(pid);
  }, [pid]);

  useEffect(() => {
    if (window.Telegram) {
      const webapp = window.Telegram.WebApp;

      console.log("webapp", webapp);
      const mainbutton = webapp.MainButton;

      if (mainbutton) {
        if (tools) {
          mainbutton.setText("Открыть в новом окне");
        } else {
          mainbutton.setText("Открыть в новом окне");
        }
      }
    }
  }, [tools]);

  return (
    <CoreLayout>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={() => true}
      ></Script>

      <Script
        src="https://cdn.jsdelivr.net/npm/rhino3dm@0.12.0/rhino3dm.min.js"
        onLoad={() => setRhinoConnected(true)}
      ></Script>

      <Screen>
        <TopBar headers={headers} />

        <Export
          enabled={isExportScreen}
          {...{ setExportScreen, setNeedsData }}
        />

        <View {...{ fullsize, viewType, setViewType }} />

        <Loading />

        <Space3D>
          <CursorProvider>
            {(includedKeys || (!includedKeys && pid === "all")) && (
              <Scene
                {...{
                  rhinoConnected,
                  needsData,
                  setNeedsData,
                  viewType,
                  setViewType,
                  includedKeys,
                  pid,
                }}
              />
            )}
          </CursorProvider>
        </Space3D>

        <ToolsPanel
          enabled={tools}
          {...{ setTools, setExportScreen, setNeedsData, fullsize }}
        />
      </Screen>

      {devMainbutton && (
        <DevMainbutton
          onClick={(e) => {
            e.stopPropagation();
            return setTools((state) => !state);
          }}
        >
          Открыть инструменты
        </DevMainbutton>
      )}
    </CoreLayout>
  );
};

export default App;
