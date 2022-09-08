import React from "react";
import { Canvas } from "@react-three/fiber";

import Camera from "./camera";

import Mouse from "./mechanics/mouse";

import CursorProvider from "./providers/cursor-providers";

import UpdateLayers from "./mechanics/update-layers";
import BufferIfcGroup from "./mechanics/buffer-ifc-group";
import useToolsStore from "../../store/tools-store";

const Scene = ({ viewType, includedKeys, pid }) => {
  const mouse = useToolsStore(({ mouse }) => mouse);

  return (
    <>
      <CursorProvider>
        <Canvas>
          <Camera {...{ viewType }} />

          <UpdateLayers />

          <ambientLight />
          <pointLight position={[50, 50, 60]} intensity={8} />

          {mouse && <Mouse />}

          <BufferIfcGroup includedKeys={includedKeys} pid={pid} />

          {/* <Buffer3dm /> */}
          {/*<BufferRhinoGroup />*/}
        </Canvas>
      </CursorProvider>
    </>
  );
};

export default Scene;
