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
    console.log("needsRender", needsRender);
    console.log("controlsInProccess", controlsInProccess);
    console.log("mouse", mouse);

    if (needsRender && !controlsInProccess && !mouse) {
      const timer = setTimeout(() => setNeedsRender(false), 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [needsRender, controlsInProccess, mouse]);

  useFrame(({ gl, scene, camera }) => {
    if (needsRender) {
      gl.render(scene, camera);
      invalidate();
    }
  }, 1);

  console.log("needsRender", needsRender);

  useEffect(() => {
    if (needsRender) invalidate();
  }, [needsRender]);

  return <></>;
};

export default Invalidate;
