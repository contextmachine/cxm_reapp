import React, { useMemo } from "react";
import { LabelLayer, Layer, LayersWrapper } from "..";
import useStatusStore from "../../../../store/status-store";
import { Typography } from "antd";
import { VisIcon } from "..";
import { Popconfirm } from "antd";
import styled from "styled-components";
import Colorful from "@uiw/react-color-colorful";

const ColorCircle = styled.div`
  width: 17px;
  height: 17px;
  margin-right: 10px;
  border-radius: 8px;
  background: ${({ fill }) => (fill ? fill : "lightgrey")};
  filter: brightness(3.5) contrast(1.5);
  border: 1px solid rgba(0, 0, 0, 0.5);

  cursor: pointer;
`;

const { Text } = Typography;

const LayerColormap = () => {
  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const colorsList = useMemo(() => {
    if (linksStructure) {
      const materials = new Set();

      linksStructure.traverse(function (object) {
        if (object.material) materials.add(object.material);
      });

      let matArr = Array.from(materials);

      let existingColors = [];

      matArr = matArr.filter((item = {}) => {
        const { color = {} } = item;
        const { isColor, r, g, b } = color ? color : {};
        const colorString = isColor ? `${r},${g},${b}` : "no-color";

        if (existingColors.includes(colorString)) {
          return false;
        } else {
          existingColors.push(colorString);
          return true;
        }
      });

      return matArr;
    }
    return [];
  }, [linksStructure, sceneLogId]);

  const handleObjectVisibility = (_r, _g, _b) => {
    if (linksStructure) {
      linksStructure.traverse(function (object) {
        if (object.material) {
          const { color } = object.material;
          const { isColor, r, g, b } = color ? color : {};

          if (isColor) {
            if (
              typeof _r === "number" &&
              typeof _g === "number" &&
              typeof _b === "number"
            ) {
              if (r === _r && g === _g && b === _b) {
                object.visible = !object.visible;
              }
            }
          }
        }
      });

      setNeedsRender(true);
    }
  };

  console.log("linksStructure", colorsList);

  return (
    <>
      <LayersWrapper key={`lay:${sceneLogId}`}>
        {colorsList &&
          colorsList.map((item = {}, i) => {
            const { color = {} } = item;
            const { isColor, r, g, b } = color ? color : {};

            const colorRgb = isColor
              ? `rgb(${r * 255}, ${g * 255}, ${b * 255})`
              : "purple";

            console.log("colorRgb", colorRgb);

            return (
              <Layer key={`colorLayer:${i}`}>
                <LabelLayer fill={colorRgb}>
                  <Popconfirm
                    title={
                      <Colorful
                        color={"#ff0000"}
                        onChange={(color) => {
                          console.log("color", color);
                        }}
                      />
                    }
                  >
                    <ColorCircle fill={colorRgb} />
                  </Popconfirm>

                  <Text
                    ellipsis={{ rows: 1 }}
                    style={{ maxWidth: "120px" }}
                  >{`Цвет #${i}`}</Text>
                </LabelLayer>

                <VisIcon
                  data-function={"visibility"}
                  onClick={() => handleObjectVisibility(r, g, b)}
                />
              </Layer>
            );
          })}
      </LayersWrapper>
    </>
  );
};

export default LayerColormap;
