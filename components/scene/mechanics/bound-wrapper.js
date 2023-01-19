import useStatusStore from "../../../store/status-store";
import { useBounds } from "@react-three/drei";
import { useEffect, useRef } from "react";

import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const BoundWrapper = ({ children }) => {
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);
  const boundingBox = useStatusStore(({ boundingBox }) => boundingBox);

  const ref = useRef();

  const { scene, camera } = useThree();

  const api = useBounds();
  useEffect(() => {
    if (ref) {
      const handleKey = (e) => {
        const isGlobal = e.key === "g";
        const isLocal = e.key === "z";

        if (isGlobal || isLocal) {
          let box3;

          if (!boundingBox || isGlobal) {
            box3 = new THREE.Box3();
            box3.setFromObject(scene);
          } else {
            box3 = boundingBox;
          }

          api.refresh(box3).clip().fit();

          setNeedsRender(true);
        }

        const rerender = () => {
          setNeedsRender(true);
        };

        const timer = setTimeout(rerender, 500);
        return () => {
          clearTimeout(timer);
        };
      };

      document.addEventListener("keydown", handleKey);

      return () => {
        document.removeEventListener("keydown", handleKey);
      };
    }
  }, [api, ref, scene, boundingBox, camera]);

  return <group ref={ref}>{children}</group>;
};

export default BoundWrapper;
