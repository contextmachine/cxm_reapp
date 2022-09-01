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
import BufferIfcGroup from "./mechanics/buffer-ifc-group";
import BufferRhinoGroup from "./mechanics/buffer-rhino-group";
import useToolsStore from "../../store/tools-store";

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

const Scene = ({ viewType, children, includedKeys, pid }) => {
  /* ***** */

  /* Approach 1 */

  const meshRef = useRef();

  const [windowSize, setWindowSize] = useState([1920, 1080]);

  const [measurer2d, setMeasurer2d] = useState(`M0 0`);
  useEffect(() => {
    if (mouse) {
      setMeasurer2d(`M0 0`);
    }
  }, [mouse]);

  const mouse = useToolsStore(({ mouse }) => mouse);
  const setMouse = useToolsStore(({ setMouse }) => setMouse);

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

          {mouse && <Mouse {...{ measurer2d, setMeasurer2d }} />}
          {/* <Buffer3dm /> */}

          <BufferIfcGroup includedKeys={includedKeys} pid={pid} />

          {/*<BufferRhinoGroup />*/}
        </Canvas>
      </CursorProvider>
    </>
  );
};

export default Scene;
