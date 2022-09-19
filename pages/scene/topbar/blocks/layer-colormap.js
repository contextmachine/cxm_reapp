import React, { useEffect, useMemo, useState } from "react";
import { LabelLayer, Layer, LayersWrapper } from "..";
import useStatusStore from "../../../../store/status-store";
import { Typography } from "antd";
import { VisIcon } from "..";
import { Popconfirm, Button } from "antd";
import styled from "styled-components";
import Colorful from "@uiw/react-color-colorful";
import Popover from "@mui/material/Popover";

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

import { v4 as uuidv4 } from "uuid";

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  const color = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  return color;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

const { Text } = Typography;

const num_word = (value, words) => {
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
};

const ColorLayer = ({
  item = {},
  colorRgb,
  i,
  r,
  g,
  b,
  count = 0,
  colorPickerPanel,
  setColorPickerPanel,
  handleObjectVisibility,
}) => {
  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setColorPickerPanel(`color${i}`);
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
    setColorPickerPanel(null);
  };

  const open = colorPickerPanel === `color${i}`;
  const id = open ? "simple-popover" : undefined;

  const [currColor, setCurrColor] = useState("#ffffff");
  const [resultColor, setResultColor] = useState("#ffffff");

  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  useEffect(() => {
    const hex = rgbToHex(r * 255, g * 255, b * 255);

    setCurrColor(hex);
    setResultColor(hex);
  }, [r, g, b]);

  const saveColor = () => {
    const colorToRGB = hexToRgb(currColor);

    linksStructure.traverse(function (object) {
      if (object.material) {
        if (item.hasIds.includes(object.material.id)) {
          if (object.material.color.isColor) {
            object.material.color.r = Math.round(colorToRGB.r / 255);
            object.material.color.g = Math.round(colorToRGB.g / 255);
            object.material.color.b = Math.round(colorToRGB.b / 255);
          }
        }
      }
    });

    setResultColor(currColor);
    setNeedsRender(true);
  };

  return (
    <Layer>
      <LabelLayer>
        <ColorCircle
          onClick={handleClick}
          aria-describedby={`color:${i}`}
          variant="contained"
          fill={resultColor}
        />
        <Popover
          key={`colorPicker:${i}`}
          id={`color:${i}`}
          open={open}
          anchorEl={anchor}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div
            style={{
              pointerEvents: "visible",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Colorful
              color={currColor}
              disableAlpha
              onChange={(color) => {
                setCurrColor(color.hex);
              }}
            />
            <br />
            <Button
              onClick={saveColor}
              style={{
                border: "2px solid black",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            >
              Сохранить
            </Button>
          </div>
        </Popover>

        <Text ellipsis={{ rows: 1 }} style={{ maxWidth: "120px" }}>
          {`Цвет #${i}`}{" "}
          <span style={{ opacity: 0.75 }}>
            {" "}
            — {`(${count} ${num_word(count, ["блок", "блока", "блоков"])})`}
          </span>
        </Text>
      </LabelLayer>

      <VisIcon
        data-function={"visibility"}
        onClick={() => handleObjectVisibility(r, g, b)}
      />
    </Layer>
  );
};

const LayerColormap = ({
  colorPickerPanel,
  setColorPickerPanel = () => {},
}) => {
  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  /* Шаг 1: Составить список материалов */
  const colorsList = useMemo(() => {
    if (linksStructure) {
      let materials = [];

      linksStructure.traverse(function (object) {
        if (object.material) {
          const { color, id } = object.material;
          const { isColor, r, g, b } = color ? color : {};

          let colorStr = isColor ? `${r}, ${g}, ${b}` : "white";
          let foundMaterial = materials.find(
            ({ colorStr: _cs }) => _cs === colorStr
          );

          if (!foundMaterial) {
            materials.push({
              r,
              g,
              b,
              isColor,
              colorStr,
              id: uuidv4(),
              count: 1,
              hasIds: [id],
            });
          } else {
            foundMaterial.count += 1;

            if (!foundMaterial.hasIds.includes(id)) {
              foundMaterial.hasIds.push(id);
            }
          }
        }
      });

      return materials;
      /* 
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
      });*/

      /*return matArr;*/
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

  return (
    <>
      <LayersWrapper key={`lay:${sceneLogId}`}>
        {colorsList &&
          colorsList.map((item = {}, i) => {
            const { isColor, r, g, b, count } = item;

            const colorRgb = isColor
              ? `rgb(${r * 255}, ${g * 255}, ${b * 255})`
              : "purple";

            return (
              <ColorLayer
                {...{ item, colorRgb, i, r, g, b, count }}
                key={`colorLayer:${i}`}
                {...{ colorPickerPanel, setColorPickerPanel }}
                {...{ handleObjectVisibility }}
              />
            );
          })}
      </LayersWrapper>
    </>
  );
};

export default LayerColormap;
