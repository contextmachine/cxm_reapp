import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import useToolsStore from "../../../store/tools-store";

const Invalidate = () => {
  const needsRender = useStatusStore(({ needsRender }) => needsRender);
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const controlsInProccess = useStatusStore(
    ({ controlsInProccess }) => controlsInProccess
  );

  const mouse = useToolsStore(({ mouse }) => mouse);

  const { invalidate } = useThree();

  useEffect(() => {
    if (needsRender && !controlsInProccess && !mouse) {
      const timer = setTimeout(() => setNeedsRender(false), 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [needsRender, controlsInProccess, mouse]);

  console.log("needsRender", needsRender);

  useFrame(({ gl, scene, camera }) => {
    if (needsRender) {
      gl.render(scene, camera);
      invalidate();
    }
  }, 1);

  useEffect(() => {
    if (needsRender) invalidate();
  }, [needsRender]);

  return <></>;
};

export default Invalidate;
