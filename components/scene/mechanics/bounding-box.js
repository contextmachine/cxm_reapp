import React, { useMemo } from "react";
import { Box, Line } from "@react-three/drei";
import useStatusStore from "../../../store/status-store";

const BoundingBox = () => {
  const boundingBox = useStatusStore(({ boundingBox }) => boundingBox);

  const edges = useMemo(() => {
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
  }, [boundingBox]);

  return (
    <>
      {edges.flat().map((point = [], i) => {
        return (
          <Box
            key={`p:${i}`}
            color="orange"
            args={[0.4, 0.4, 0.4]}
            position={point}
          />
        );
      })}

      {edges.map((side = [], i) => {
        return (
          <Line
            key={`side:${i}`}
            points={side}
            lineWidth={0.1}
            opacity={0.4}
            transparent
            dashed={false}
            color={"white"}
            name={"bounding-box"}
            depthTest={false}
            depthWrite={false}
            vertexColors={side.map((_) => [255, 255, 255])}
          >
            <lineBasicMaterial color="white" />
          </Line>
        );
      })}
    </>
  );
};

export default BoundingBox;
