import React from "react";
import { Canvas } from "@react-three/fiber";

import Camera from "./camera";

import Mouse from "./mechanics/mouse";

import UpdateLayers from "./mechanics/update-layers";
import BufferIfcGroup from "./mechanics/buffer-ifc-group";
import useToolsStore from "../../store/tools-store";
import BoundingBox from "./mechanics/bounding-box";

const Scene = ({ viewType, includedKeys, pid }) => {
  const mouse = useToolsStore(({ mouse }) => mouse);

  return (
    <>
      <Canvas>
        <Camera {...{ viewType }} />

        <UpdateLayers />

        <ambientLight />
        <pointLight position={[50, 50, 60]} intensity={8} />

        {mouse && <Mouse />}

        <BufferIfcGroup includedKeys={includedKeys} pid={pid} />

        <BoundingBox />

        {/* <Buffer3dm /> */}
        {/*<BufferRhinoGroup />*/}
      </Canvas>
    </>
  );
};

export default Scene;
