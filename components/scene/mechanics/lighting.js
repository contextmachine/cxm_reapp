import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import useStatusStore from "../../../store/status-store";

import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { Octahedron, TransformControls } from "@react-three/drei";
import useLightingStore from "../../../store/lighting-store";

const Lighting = () => {
  const { scene, get } = useThree();

  const [isEdit, setEdit] = useState(false);

  const lights = useLightingStore(({ lights }) => lights);
  const setLights = useLightingStore(({ setLights }) => setLights);

  const loadingMessage = useStatusStore(({ loadingMessage }) => loadingMessage);

  const [point, setPoint] = useState();

  const userData = useStatusStore(({ userData }) => userData);
  const GUIData = useStatusStore(({ GUIData }) => GUIData);

  useEffect(() => {
    if (!loadingMessage) {
      const box3 = new THREE.Box3();
      box3.setFromObject(scene);

      let center = new THREE.Vector3();
      let size = new THREE.Vector3();

      box3.getCenter(center);
      box3.getSize(size);

      center = [
        center.x - size.x * 0.8,
        center.y - size.y * 0.8,
        center.z + (size.z + size.x + size.y) * /* 0.4 */ 0.2,
      ];

      const square = size.x + size.y + size.z;
      const intensity = 0.05 * square;

      let scale = size.x > size.y ? size.x : size.y;
      scale *= 2;

      size = [size.x, size.y, size.z];

      setPoint({ center, scale, logId: uuidv4(), intensity });
    }
  }, [loadingMessage, scene, lights]);

  useEffect(() => {
    if (isEdit) {
      const handleClick = (e) => {
        const pointer = new THREE.Vector2();

        let { camera } = get();

        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.firstHitOnly = true;

        raycaster.setFromCamera(pointer, camera);

        /* try { */
        let intersects = raycaster.intersectObjects(scene.children, true);

        if (Array.isArray(intersects)) {
          let foundTransformChildren = false;

          intersects.map((item = {}) => {
            const { object } = item;
            const { isTransformControlsPlane } = object;

            if (!isTransformControlsPlane) {
              object.traverseAncestors((obj = {}, i) => {
                const { isTransformControls } = obj;
                if (isTransformControls) {
                  foundTransformChildren = true;
                }
              });
            }
          });

          if (!foundTransformChildren) setEdit(false);
        }
        /*  } catch (e) {} */
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, [isEdit]);

  useEffect(() => {
    if (userData) {
      const { name } = userData;

      if (name === "pointLight_1") {
        setEdit(true);
      }
    }
  }, [userData]);

  return (
    <>
      {point && point.center ? (
        <ambientLight name="ambientLight_0" intensity={point.intensity * 0.3} />
      ) : (
        <ambientLight name="ambientLight_0" />
      )}

      {point && point.center ? (
        <>
          <pointLight
            name="pointLight_1"
            position={point.center}
            intensity={point.intensity}
            userData={{ link: { name: "light-box" } }}
          />

          {isEdit && (
            <TransformControls
              name="bounding-box"
              mode="translate"
              position={point.center}
              onChange={(e) => {
                const { target } = e;

                if (target) {
                  const object = target.gizmo.object;
                  if (object) {
                    const position = object.position;
                    setPoint((state) => {
                      state = { ...state };
                      state.logId = uuidv4();

                      state.center = [position.x, position.y, position.z];

                      return state;
                    });
                  }
                }
              }}
            />
          )}

          <Octahedron
            userData={{ link: "pointLight_1" }}
            name="light-box"
            onClick={() => {
              setEdit(true);
            }}
            position={point.center}
            args={[(1.5 / 3.5) * point.intensity, 0]}
          >
            <meshBasicMaterial wireframe />
          </Octahedron>
        </>
      ) : (
        <pointLight name="pointLight_1" position={[50, 50, 60]} intensity={8} />
      )}
    </>
  );
};

export default Lighting;
