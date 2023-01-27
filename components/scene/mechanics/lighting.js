import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import useStatusStore from "../../../store/status-store";

import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { Octahedron } from "@react-three/drei";
import useLightingStore from "../../../store/lighting-store";

const Lighting = () => {
  const { scene } = useThree();

  const lights = useLightingStore(({ lights }) => lights);
  const setLights = useLightingStore(({ setLights }) => setLights);

  const loadingMessage = useStatusStore(({ loadingMessage }) => loadingMessage);

  const [point, setPoint] = useState();

  useEffect(() => {
    if (!loadingMessage) {
      const box3 = new THREE.Box3();
      box3.setFromObject(scene);

      let center = new THREE.Vector3();
      let size = new THREE.Vector3();

      box3.getCenter(center);
      box3.getSize(size);

      center = [
        center.x - size.x * 0.5,
        center.y - size.y * 0.5,
        center.z + size.z + 10,
      ];

      const square = size.x * size.y;
      const intensity = (5 / 2318) * 0.7 * square;

      let scale = size.x > size.y ? size.x : size.y;
      scale *= 2;

      size = [size.x, size.y, size.z];

      setPoint({ center, center, scale, logId: uuidv4(), intensity });
    }
  }, [loadingMessage, scene, lights]);

  return (
    <>
      <ambientLight />

      {point ? (
        <>
          <pointLight position={point.center} intensity={point.intensity} />

          <Octahedron position={point.center}>
            <meshBasicMaterial wireframe />
          </Octahedron>
        </>
      ) : (
        <pointLight position={[50, 50, 60]} intensity={8} />
      )}
    </>
  );
};

export default Lighting;
