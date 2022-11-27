import { Extrude } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

const star = () => {
  /* ch. Star */
  var alpha = (2 * Math.PI) / 10;
  var radius = 2;
  var starXY = [0, 0];

  const starShape = new THREE.Shape();
  for (var i = 11; i != 0; i--) {
    var r = (radius * ((i % 2) + 1)) / 2;
    var omega = alpha * i;

    const a = r * Math.sin(omega) + starXY[0];
    const b = r * Math.cos(omega) + starXY[1];

    if (i === 11) {
      starShape.moveTo(a, b);
    } else {
      starShape.lineTo(a, b);
    }
  }

  return starShape;
};

const rectangle = () => {
  const size = 2;

  const shape = new THREE.Shape();
  shape.moveTo(-size / 2, size / 2);
  shape.lineTo(size / 2, size / 2);
  shape.lineTo(size / 2, -size / 2);
  shape.lineTo(-size / 2, -size / 2);

  return shape;
};

const triangle = () => {
  const size = 2;

  const shape = new THREE.Shape();
  const angle = 360 / 3;
  for (let i = 0; i < 3; i++) {
    const a = size * Math.cos((i * angle * Math.PI) / 180);
    const b = size * Math.sin((i * angle * Math.PI) / 180);

    if (i === 0) {
      shape.moveTo(a, b);
    } else {
      shape.lineTo(a, b);
    }
  }

  return shape;
};

const handleLength = (size = "medium") => {
  const intervals = {
    small: [2, 6],
    medium: [8, 12],
    big: [14, 20],
  };

  const interval = intervals[size];
  const length = interval[0] + (interval[1] - interval[0]) * Math.random();

  return { steps: 1, depth: length, bevelEnabled: false };
};

const InfographicsScene = () => {
  const gridX = 20;
  const gridY = 20;

  const gridWidth = 200;
  const gridLength = 200;

  const gridStepX = gridWidth / gridX;
  const gridStepY = gridLength / gridY;

  const { scene } = useThree();

  const [figures, setFigures] = useState();
  useEffect(() => {
    let shapeIndex = 0;

    let itemsList = Array(gridX)
      .fill(1)
      .map((_, i) => {
        const posX = -gridWidth / 2 + i * gridStepX;

        return Array(gridY)
          .fill(1)
          .map((_, b) => {
            const posY = -gridLength / 2 + b * gridStepY;

            const pos = [posX, posY, 0];

            /* Шаг 1: Определение шейпа в сечении */
            const shapeType = Math.round(Math.random() * 2);
            let shape;
            let shapeName;
            if (shapeType === 0) {
              shape = star();
              shapeName = "star";
            }
            if (shapeType === 1) {
              shape = rectangle();
              shapeName = "rectangle";
            }
            if (shapeType === 2) {
              shape = triangle();
              shapeName = "triangle";
            }

            /* Шаг 2: Определение цвета */
            const colorType = Math.round(Math.random() * 3);

            const colors = ["red", "green", "blue", "purple"];
            let color = colors[colorType];

            /* Шаг 3: Определние длины */
            const sizeType = Math.round(Math.random() * 2);

            let sizes = ["small", "medium", "big"];
            let size = sizes[sizeType];

            /* Шаг 4: properties  */
            const properties = {
              shape: shapeName,
              color,
              size,
            };

            shapeIndex += 1;

            return (
              <Extrude
                userData={{
                  properties,
                }}
                name={`${
                  shapeType === 0
                    ? "star"
                    : shapeType === 1
                    ? "rectangle"
                    : "triangle"
                } #${shapeIndex}`}
                key={`f:${i}:${b}`}
                position={pos}
                args={[shape, handleLength(size)]}
              >
                <meshStandardMaterial color={color} />
              </Extrude>
            );
          });
      })
      .flat();

    let itemQuatro = [];
    for (let i = 0; i < 4; i++) {
      const q = itemsList.length / 4;

      itemQuatro.push(
        [...itemsList].filter((_, v) => v >= q * i && v < q * (i + 1))
      );
    }

    let items = itemQuatro.map((l, i) => {
      return (
        <group
          key={`g:${i}`}
          name={`Quarter #${i + 1}`}
          userData={{
            version: "1.0",
            gui: [
              {
                id: "color-linechart",
                name: "график по цветам",
                type: ["piechart"],
                key: "color",
                colors: "default",
              },
              {
                id: "shape-linechart",
                name: "график по фигурам",
                type: ["linechart"],
                key: "shape",
                colors: "default",
              },
            ],
          }}
        >
          {l}
        </group>
      );
    });

    const figures = (
      <group
        name={"figures"}
        userData={{
          version: "1.0",
          gui: [
            {
              id: "shape-linechart",
              name: "график по фигурам",
              type: "chart",
              require: ["linechart"],
              key: "shape",
              colors: "default",
            },
            {
              id: "size-linechart",
              name: "график по размерам",
              type: "chart",
              require: ["linechart", "piechart"],
              key: "size",
              colors: "default",
            },
            {
              id: "color-linechart",
              name: "график по цветам",
              type: "chart",
              require: ["piechart"],
              key: "color",
              colors: "default",
            },
          ],
        }}
      >
        {items}
      </group>
    );

    setFigures(figures);
  }, []);

  return figures;
};

export default InfographicsScene;
