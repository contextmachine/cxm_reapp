import React, { useEffect, useMemo } from "react";
import { Box, Line } from "@react-three/drei";
import useStatusStore from "../../../store/status-store";

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

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  useEffect(() => {
    console.log("caughtItemcaughtItem");
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

  return (
    <>
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
      {hoverBox_edges.map((side = [], i) => {
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
