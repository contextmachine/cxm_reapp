import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";

import { Grid } from "antd";

import Camera from "./camera";

import Mouse from "./mechanics/mouse";
import BufferModel from "./mechanics/buffer-model";

import CursorProvider from "./providers/cursor-providers";
import useStatusStore from "../../store/status-store";

import file_size_url from "file_size_url";
import Buffer3dm from "./mechanics/buffer-3dm";

import UpdateLayers from "./mechanics/update-layers";

const MeasurerCanvas = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  pointer-events: none;

  z-index: 100;
`;

const { useBreakpoint } = Grid;

const LayersWrapper = styled.div`
  position: fixed;
  left: 40px;
  bottom: 140px;
  width: 100%;
  max-width: 250px;

  display: flex;
  flex-direction: column;

  z-index: 10;

  && > * + * {
    margin-top: 10px;
  }
`;

const Scene = ({ viewType, children }) => {
  const [percents, setPercents] = useState(0);

  const way = "s2"; // l - local, s - server

  /* ***** */

  /* Approach 1 */
  const [JSONlinks, setJSONllinks] = useState();
  const [JSON_names, setJSON_names] = useState();
  const [serverInit, setServerInit] = useState(false);
  const [serverFinish, setServerFinish] = useState(false);
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
    if (!serverInit) {
      setLoadingMessage({ message: "Подключаемся к серверу", type: "full" });

      fetch("https://mmodel.contextmachine.online:8181/get_keys")
        .then((response) => {
          return response.json();
        })
        .then((keys) => {
          setJSONllinks(
            keys
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

  const meshRef = useRef();

  const [windowSize, setWindowSize] = useState([1920, 1080]);

  const [measurer2d, setMeasurer2d] = useState(`M0 0`);

  const measurerRef = useRef();
  useEffect(() => {
    setWindowSize([windowSize[0], windowSize[1]]);
  }, []);

  return (
    <>
      {/*<MeasurerCanvas>
        <svg
          width={windowSize[0]}
          height={windowSize[1]}
          viewBox={`0 0 ${windowSize[0]} ${windowSize[1]}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_3003_13616)">
            <path d={measurer2d} stroke="black" />
          </g>
          <defs>
            <clipPath id="clip0_3003_13616">
              <rect width={windowSize[0]} height={windowSize[1]} fill="white" />
            </clipPath>
          </defs>
  </svg>
      </MeasurerCanvas>*/}

      <CursorProvider>
        <Canvas ref={meshRef}>
          {children}

          <Camera {...{ viewType }} />

          <UpdateLayers />

          <ambientLight />
          <pointLight position={[50, 50, 60]} intensity={8} />

          {/*<Mouse {...{ measurer2d, setMeasurer2d }} />*/}

          {JSONlinks &&
            JSONlinks.length > 0 &&
            JSONlinks.map((path, i) => {
              return (
                <BufferModel
                  {...{ index: i }}
                  way={way}
                  key={`b:${i}`}
                  path={path}
                  layerName={JSON_names[i]}
                />
              );
            })}
        </Canvas>
      </CursorProvider>
    </>
  );
};

export default Scene;
