import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import useStatusStore from "../../../store/status-store";

import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const Grid = () => {
  const { scene } = useThree();

  const loadingMessage = useStatusStore(({ loadingMessage }) => loadingMessage);

  const [grid, setGrid] = useState();

  useEffect(() => {
    if (!loadingMessage) {
      const box3 = new THREE.Box3();
      box3.setFromObject(scene);

      let center = new THREE.Vector3();
      let size = new THREE.Vector3();

      box3.getCenter(center);
      box3.getSize(size);

      center = [center.x, center.y, center.z - size.z - 1];
      let scale = size.x > size.y ? size.x : size.y;
      scale *= 2;

      size = [size.x, size.y, size.z];

      setGrid({ center, center, scale, logId: uuidv4() });
    }
  }, [loadingMessage, scene]);

  if (!grid) return <></>;

  return (
    <>
      <gridHelper
        infiniteGrid={true}
        rotation={[Math.PI * 0.5, 0, 0]}
        position={grid.center}
        args={[grid.scale, Math.round(grid.scale / 5), "#786060", "#514D4D"]}
        name="bounding-box"
      />
    </>
  );
};

export default Grid;
