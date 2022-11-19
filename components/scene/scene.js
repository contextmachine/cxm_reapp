import React, { useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";

import Camera from "./camera";

import Mouse from "./mechanics/mouse";

import UpdateLayers from "./mechanics/update-layers";
import BufferIfcGroup from "./mechanics/buffer-ifc-group";
import useToolsStore from "../../store/tools-store";
import BoundingBox from "./mechanics/bounding-box";
import LayersProvider from "./mechanics/layers-provider";

import Invalidate from "./mechanics/invalidate";
import Selection from "./mechanics/selection";
import { Box } from "@react-three/drei";

import { useRouter } from "next/router";

import ExperimentalList from "./mechanics/experimental/experimental-list";
import BufferExperimental from "./mechanics/buffer-experimental";
import GUIProvider from "./mechanics/gui-provider";

import useStatusStore from "../../store/status-store";

const Scene = ({ viewType, includedKeys, pid, setPreviewImage }) => {
  const mouse = useToolsStore(({ mouse }) => mouse);

  const router = useRouter();
  const { query } = router;
  const { experimental } = query;

  let experimentalModule = useMemo(() => {
    if (experimental) {
      const foundModule = ExperimentalList.find(({ id }) => id === pid);
      if (foundModule) {
        const { module } = foundModule;

        return module;
      }
    }
  }, [experimental, pid]);

  const setLoadingMessage = useStatusStore(
    ({ setLoadingMessage }) => setLoadingMessage
  );
  useEffect(() => {
    if (experimental) {
      setLoadingMessage(null);
    }
  }, [experimental]);

  return (
    <Canvas frameloop="demand" gl={{ preserveDrawingBuffer: true }}>
      <Camera {...{ viewType }} />

      <UpdateLayers />

      <ambientLight />
      <pointLight position={[50, 50, 60]} intensity={8} />

      {mouse && <Mouse />}
      <Selection />

      {!experimental && (
        <BufferIfcGroup
          includedKeys={includedKeys}
          pid={pid}
          setPreviewImage={setPreviewImage}
        />
      )}

      {experimental && <BufferExperimental pid={pid} />}

      <BoundingBox />
        <LayersProvider />
        <GUIProvider />

      <Invalidate />

      {/* <Buffer3dm /> */}
      {/*<BufferRhinoGroup />*/}
    </Canvas>
  );
};

export default Scene;
