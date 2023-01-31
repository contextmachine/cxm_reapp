import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Edges, Line } from "@react-three/drei";
import useStatusStore from "../../../store/status-store";
import { notification } from "antd";

import { Bounds, useBounds } from "@react-three/drei";
import useModeStore from "../../../store/mode-store";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const handleBoxEdges = (boundingBox) => {
  if (boundingBox) {
    let points = [];

    let { min = {}, max = {} } = boundingBox;

    let { x: x0, y: y0, z: z0 } = min;
    let { x: x1, y: y1, z: z1 } = max;

    points = [
      [
        [x0, y0, z0],
        [x0, y0, z1],
        [x0, y1, z1],
        [x0, y1, z0],
        [x0, y0, z0],
      ],
      [
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y1, z0],
        [x0, y1, z0],
        [x0, y0, z0],
      ],
      [
        [x0, y0, z1],
        [x0, y1, z1],
        [x1, y1, z1],
        [x1, y0, z1],
        [x0, y0, z1],
      ],
      [
        [x1, y1, z1],
        [x1, y1, z0],
        [x1, y0, z0],
        [x1, y0, z1],
        [x1, y1, z1],
      ],
    ];

    return points;
  } else {
    return [];
  }
};

const BoundingBox = () => {
  /* Вид переменных:  { min: {x,y,z}, max: {x,y,z}, isBox3:true } */
  const boundingBox = useStatusStore(({ boundingBox }) => boundingBox);
  const hoverBox = useStatusStore(({ hoverBox }) => hoverBox);
  const setHoverBox = useStatusStore(({ setHoverBox }) => setHoverBox);

  const selection = useModeStore(({ selection }) => selection);

  const [drawEdges, setDrawEdges] = useState();

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const [init, setInit] = useState(false);
  useEffect(() => {
    setHoverBox();

    setInit((state) => {
      if (state) {
        notification.open({
          message: (
            <div>
              Switched to{" "}
              <span style={{ color: "#ED5516" }}>
                {selection === "bbox" ? "Bbox mode" : "Object mode"}
              </span>
            </div>
          ),
          placement: "leftBottom",
        });
      }

      return true;
    });
  }, [selection]);

  useEffect(() => {
    setNeedsRender(true);
  }, [boundingBox]);

  /* Описать грани для boudning box */
  const boundingBox_edges = useMemo(() => {
    return handleBoxEdges(boundingBox);
  }, [boundingBox]);

  const hoverBox_edges = useMemo(() => {
    return handleBoxEdges(hoverBox);
  });

  /* Общие настройки для <Line/> */
  const commonProps = {
    opacity: 1,
    depthTest: false,
    depthWrite: false,
    dashed: false,
    transparent: true,
  };

  const shapeRef = useRef();
  const [memoMaterial, setMemoMaterial] = useState(); // {object, material, logId}

  useEffect(() => {
    if (selection === "object") {
      if (hoverBox) {
        if (hoverBox.object && hoverBox.object.geometry) {
          setDrawEdges(false);
          shapeRef.current.geometry = hoverBox.object.geometry;

          hoverBox.object.updateWorldMatrix(true, false);
          hoverBox.object.matrixWorld.decompose(
            shapeRef.current.position,
            shapeRef.current.quaternion,
            shapeRef.current.scale
          );

          setDrawEdges(true);

          setMemoMaterial((state) => {
            if (state) {
              state.object.material = state.material;
              state.object.material.needsUpdate = true;
            }

            let _state = {};
            _state.material = hoverBox.object.material.clone();
            _state.object = hoverBox.object;
            _state.logId = uuidv4();

            hoverBox.object.material = new THREE.MeshBasicMaterial({
              color: 0x3b9df9,
              side: THREE.DoubleSide,
            });
            hoverBox.object.material.needsUpdate = true;

            return _state;
          });
        }
      } else {
        setMemoMaterial((state) => {
          if (state) {
            state.object.material = state.material;
            state.object.material.needsUpdate = true;
          }

          return null;
        });
      }

      setNeedsRender(true);
    }
  }, [hoverBox, selection]);

  return (
    <>
      {selection === "object" && hoverBox && (
        <>
          <mesh ref={shapeRef} name={"bounding-box"}>
            <shapeBufferGeometry />
            <meshBasicMaterial visible={false} color={"#3B9DF9"} />
            {drawEdges && (
              <Edges
                key={`edges:${hoverBox.logId}`}
                onUpdate={() => setNeedsRender(true)}
                name={"bounding-box"}
                scale={1}
                lineWidth={5}
                threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
                color="black"
              />
            )}
          </mesh>
        </>
      )}

      {/* Bounding Box - при выбранном объекте */}
      {boundingBox_edges.map((side = [], i) => {
        return (
          <Line
            key={`side:${i}`}
            lineWidth={0.8}
            points={side}
            name={"bounding-box"}
            {...commonProps}
            color={"white"}
            vertexColors={side.map((_) => [255, 255, 255])}
          >
            <lineBasicMaterial color="white" />
          </Line>
        );
      })}

      {/* Hover Bounding Box - при наведении */}
      {selection === "bbox" &&
        hoverBox_edges.map((side = [], i) => {
          return (
            <Line
              key={`hover-side:${i}`}
              lineWidth={1.2}
              points={side}
              name={"hover-box"}
              {...commonProps}
              color={"#3B9DF9"}
            >
              <lineBasicMaterial color="#3B9DF9" />
            </Line>
          );
        })}
    </>
  );
};

export default BoundingBox;
