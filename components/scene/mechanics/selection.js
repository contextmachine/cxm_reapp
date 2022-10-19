import { Sphere } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import useStatusStore from "../../../store/status-store";

import { v4 as uuidv4 } from "uuid";

const Selection = () => {
  const loadingMessage = useStatusStore(({ loadingMessage }) => loadingMessage);
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const [deepLevel, setDeepLevel] = useState(1);

  const { camera, scene } = useThree();

  const [caughtMeshes, setCaughtMeshes] = useState([]);
  const [caughtLevel, setCaughtLevel] = useState();

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);

  console.log("caughtMeshes", caughtMeshes);

  useEffect(() => {
    const handleRaycasting = (e) => {
      const pointer = new THREE.Vector2();

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.firstHitOnly = true;
      raycaster.setFromCamera(pointer, camera);

      try {
        let intersects = raycaster.intersectObjects(scene.children, true);

        if (Array.isArray(intersects)) {
          let points = [];

          const handleUUID = (intersect = {}) => {
            const { object = {} } = intersect;
            const { uuid, id } = object;

            return id;
          };

          const intersect = intersects.filter(handleUUID).filter((_, i) => {
            return i === 0;
          });

          setCaughtMeshes(intersect.map(handleUUID));
        }
      } catch (err) {
        console.log("errpr", err);
      }
    };

    if (true) {
      window.addEventListener("mousemove", handleRaycasting);

      return () => {
        window.removeEventListener("mousemove", handleRaycasting);
      };
    }
  }, [scene, camera]);

  useEffect(() => {
    const children = scene.children;

    if (caughtMeshes && caughtMeshes.length > 0 && scene) {
      /* Шаг 1: Берем деталь, на которую наведен курсор */
      const caughtItem = scene.getObjectById(caughtMeshes[0]);
      if (caughtItem) {
        const indexList = [];

        caughtItem.traverseAncestors((obj = {}, i) => {
          indexList.push(obj.id);
        });

        indexList = [...indexList].reverse();

        const caughtLevelId =
          deepLevel < indexList.length
            ? indexList[deepLevel]
            : indexList[indexList.length - 1];

        setCaughtLevel(caughtLevelId);
      }
    } else {
      setCaughtLevel(null);
    }
  }, [caughtMeshes, scene, deepLevel]);

  useEffect(() => {
    if (typeof caughtLevel === "number") {
      const caughtLevelObject = scene.getObjectById(caughtLevel);

      if (caughtLevelObject) {
        scene.children.map((item = {}) => {
          if (item.type === "BoxHelper" && item.id !== caughtLevel) {
            scene.remove(item);
          }
        });

        const box = new THREE.BoxHelper(caughtLevelObject, 0x0000ff);
        box.material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        scene.add(box);
      }
    } else {
      scene.children.map((item = {}) => {
        if (item.type === "BoxHelper") {
          scene.remove(item);
        }
      });
    }

    setNeedsRender(true);
  }, [caughtLevel, scene]);

  useEffect(() => {
    if (typeof caughtLevel === "number") {
      const handleClick = () => {
        const object = scene.getObjectById(caughtLevel);
        if (object) {
          const box3 = new THREE.Box3();
          box3.setFromObject(object);

          setBoundingBox({ ...box3, logId: uuidv4() });
        }

        setDeepLevel((state) => state + 1);
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, [caughtLevel]);

  return <></>;
};

export default Selection;
