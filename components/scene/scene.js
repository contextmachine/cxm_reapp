import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import Camera from "./camera";

import Mouse from "./mechanics/mouse";

import UpdateLayers from "./mechanics/update-layers";
import BufferIfcGroup from "./mechanics/buffer-ifc-group";
import useToolsStore from "../../store/tools-store";
import BoundingBox from "./mechanics/bounding-box";
import LayersProvider from "./mechanics/layers-provider";

import Invalidate from "./mechanics/invalidate";
import Selection from "./mechanics/selection";
import {
  Bounds,
  GizmoHelper,
  GizmoViewport,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";

import { useRouter } from "next/router";

import BufferExperimental from "./mechanics/buffer-experimental";
import GUIProvider from "./mechanics/gui-provider";

import useStatusStore from "../../store/status-store";
import BoundWrapper from "./mechanics/bound-wrapper";

import Grid from "./mechanics/grid";

const Scene = ({ viewType, includedKeys, pid, setPreviewImage }) => {
  const mouse = useToolsStore(({ mouse }) => mouse);

  const router = useRouter();
  const { query } = router;
  const { experimental } = query;

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
      <Selection viewType={viewType} />

      <Grid />

      <Bounds damping={0} margin={viewType === "perspective" ? 40 : 3}>
        <BoundWrapper>
          <group>
            {!experimental && (
              <BufferIfcGroup
                includedKeys={includedKeys}
                pid={pid}
                setPreviewImage={setPreviewImage}
              />
            )}

            {experimental && <BufferExperimental pid={pid} />}
          </group>
        </BoundWrapper>
      </Bounds>

      <BoundingBox />
      <LayersProvider />
      <GUIProvider />
      <Invalidate />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {/* <Buffer3dm /> */}
      {/*<BufferRhinoGroup />*/}
    </Canvas>
  );
};

export default Scene;
