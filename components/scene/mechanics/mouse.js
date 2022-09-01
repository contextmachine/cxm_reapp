import React, { useRef } from "react";
import { useState } from "react";
import * as THREE from "three";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import { Box, Line, Html } from "@react-three/drei";
import styled from "styled-components";

const BlackPoint = styled.div`
  background: black;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;

  &&:hover {
    transform: scale(1.4, 1.4);
    border: 2px solid rgba(255, 255, 255, 1);
    cursor: pointer;

    &::before {
      content: "";
    }
  }
`;

const ToolTip = styled.div`
  position: absolute;
  top: -40px;
  background: black;
  color: white;
  padding: 5px;
`;

const MeasureLength = ({ data = [] }) => {
  let lengthValues = [];

  for (let i = 0; i < data.length; i++) {
    const currItem = data[i];
    const nextItem = data[i + 1];

    if (currItem && nextItem) {
      const vector3d = [
        nextItem.x - currItem.x,
        nextItem.y - currItem.y,
        nextItem.z - currItem.z,
      ];

      const pos = [
        currItem.x + vector3d[0] / 2,
        currItem.y + vector3d[1] / 2,
        currItem.z + vector3d[2] / 2,
      ];

      const length = Math.sqrt(
        Math.pow(vector3d[0], 2) + Math.pow(vector3d[1], 2),
        Math.pow(vector3d[2], 2)
      );

      let numberString = Math.round(length * 1000 * 10) / 10;
      numberString = numberString
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      lengthValues.push(
        <Html as="div" center position={pos}>
          <div
            style={{
              background: "black",
              color: "white",
              paddingLeft: "7px",
              paddingRight: "7px",
              borderRadius: "10px",
              width: "max-content",
            }}
          >
            {numberString}
          </div>
        </Html>
      );
    }
  }

  return <>{lengthValues}</>;
};

const Mouse = ({ measurer2d, setMeasurer2d = () => {} }) => {
  const { scene, gl, camera } = useThree();

  const [mousePosition, setMousePosition] = useState([0, 0, 0]);

  const [caughtMesh, setCaughtMesh] = useState();

  const [measurer, setMeasurer] = useState([]);

  const [caughtMeshes, setCaughtMeshes] = useState([]);
  const [caughtPoints, setCaughtPoints] = useState([]);
  const [prevMaterials, setPrevMaterials] = useState([]);

  const boxRef = useRef();

  useEffect(() => {
    if (boxRef && boxRef.current) {
      boxRef.current.position.set(
        mousePosition[0],
        mousePosition[1],
        mousePosition[2]
      );
    }
  }, [mousePosition, boxRef]);

  const lineRef = useRef();

  /*useEffect(() => {
    if (lineRef && lineRef.current) {
      console.log("lineRef", lineRef);
    }
  }, [lineRef]);*/

  /*useEffect(() => {
    if (scene) {
      const measurer_line = scene.getObjectByName("measurer-line");
    }
  }, [scene, lineRef]);*/

  useEffect(() => {
    const handleRaycasting = (e) => {
      const pointer = new THREE.Vector2();

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.firstHitOnly = true;
      raycaster.setFromCamera(pointer, camera);
      /*raycaster.linePrecision = 100;*/

      const foundLine = scene.getObjectByName("measurer-line");
      if (foundLine) {
        const { geometry } = foundLine;
        geometry.boundingBox = null;

        console.log("geometry", geometry);
      }

      console.log("scene", scene);
      console.log("raycaster", raycaster);

      const children = scene.children.filter(
        ({ isMesh, isLine2, isGroup }) => isMesh && !isLine2
      );

      console.log("children", children);

      try {
        let intersects = raycaster.intersectObjects(children);

        if (Array.isArray(intersects)) {
          let points = [];

          const handleUUID = (intersect = {}) => {
            const { object = {} } = intersect;
            const { uuid } = object;

            return uuid;
          };

          const intersect = intersects.filter(handleUUID).filter((_, i) => {
            return i === 0;
          });

          setCaughtPoints(
            intersect.map((item = {}) => {
              const { point = {} } = item;

              return point;
            })
          );

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

  const handleMeasurer = () => {
    setMeasurer((state) => [...state, ...caughtPoints]);
  };

  useEffect(() => {
    if (true) {
      window.addEventListener("click", handleMeasurer);

      return () => {
        window.removeEventListener("click", handleMeasurer);
      };
    }
  }, [handleMeasurer]);

  useEffect(() => {
    if (caughtMeshes && caughtMeshes.length > 0) {
      let currentMaterials = {};

      Object.keys(prevMaterials).map((uuid) => {
        const object = scene.getObjectByProperty("uuid", uuid);

        object.material = prevMaterials[uuid];
      });

      caughtMeshes.map((uuid) => {
        if (uuid) {
          const object = scene.getObjectByProperty("uuid", uuid);

          const { material } = object;
          if (material) {
            currentMaterials[uuid] = object.material.clone();

            object.material = new THREE.MeshStandardMaterial({
              color: 0xff0000,
              side: THREE.DoubleSide,
            });
          }
        }
      });

      setPrevMaterials(currentMaterials);
    }
  }, [caughtMeshes, scene, prevMaterials]);

  /*useEffect(() => {
    if (measurer && measurer.length > 0) {
      let measurer_to2d = measurer.map((item = []) => {
        let vector = new THREE.Vector3();

        let widthHalf = 0.5 * window.innerWidth;
        let heightHalf = 0.5 * window.innerHeight;

        vector = item;

        vector.project(camera);

        vector.x = vector.x * widthHalf + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;

        return [vector.x, vector.y];
      });

      if (measurer_to2d.length >= 2) {
        let string = "";

        measurer_to2d.map((_locs = [], i) => {
          let locs = [Math.round(_locs[0]), Math.round(_locs[1])];

          if (i === 0) {
            string += `M${locs[0]} ${locs[1]}`;
            return;
          } else {
            string += `L${locs[0]} ${locs[1]}`;
          }
        });

        console.log("string", string);

        setMeasurer2d(string);
      }

      console.log("measurer_to2d", measurer_to2d);
    }
  }, [measurer, camera]);*/

  return (
    <>
      {measurer.length > 0 && (
        <>
          {measurer.map((item = {}, i) => {
            return (
              <Html
                as="div"
                key={`html::${i}`}
                center
                position={[item.x, item.y, item.z]}
              >
                <BlackPoint
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("sdfsdfs");

                    setMeasurer((state) => state.filter((_, b) => b !== i));
                  }}
                />
              </Html>
            );
          })}

          <MeasureLength data={measurer} />

          <Line
            points={measurer}
            ref={lineRef}
            color="black"
            lineWidth={1}
            dashed={false}
            renderOrder={1}
            name={"measurer-line"}
            depthTest={false}
            depthWrite={false}
            vertexColors={measurer.map((_) => [0, 0, 0])}
          >
            <lineBasicMaterial color={"red"} />
          </Line>
        </>
      )}
    </>
  );
};
export default Mouse;
