import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { EyeInvisibleOutlined } from "@ant-design/icons";
import useClickedOutside from "./outside-hook";
import ChartBar from "./chart";

const Bar = styled.div`
  position: absolute;
  z-index: 10;

  width: 100%;
  padding: 0 10px;
  margin-top: 10px;

  display: flex;
  justify-content: space-between;

  height: 50px;
  pointer-events: none;

  && > * {
    pointer-events: visible;

    box-shadow: rgb(0 0 0 / 20%) 0px 2px 1px -1px,
      rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px;
  }
`;

const LeftSide = styled.div`
  width: max-content;
  height: 50px;
  background: white;
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 480px) {
    & {
      height: 40px;
    }
  }

  position: absolute;
  left: 10px;
  top: 10px;

  display: flex;
`;

LeftSide.Btn = styled.div`
  width: 50px;
  height: 50px;
  background: white;
  cursor: pointer;

  @media (max-width: 480px) {
    & {
      width: 40px;
      height: 40px;
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;

  &&::before {
    content: "";
    width: 31px;
    height: 31px;

    @media (max-width: 480px) {
      & {
        width: 23px;
        height: 23px;
      }
    }

    ${({ section }) =>
      section === "layers"
        ? `
      background: url('/icons/layers-ic-1.svg');
      `
        : `
      background: url('/icons/history-ic-1.svg');
      `}
    background-size: cover;
    mix-blend-mode: difference;
  }
`;

const RightSide = styled.div`
  width: 150px;
  height: 50px;

  @media (max-width: 480px) {
    & {
      width: 110px;
      height: 40px;
    }
  }

  transition: all 0.2s ease-in-out;

  background: white;
  border-radius: 10px;

  position: absolute;
  right: 10px;
  top: 10px;

  &[data-type="fullsize"] {
    width: 100%;
    right: -0px;
    height: 230px;
  }
`;

const ChartHeader = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
  cursor: pointer;

  @media (max-width: 480px) {
    & {
      height: 40px;
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;

  && > * + * {
    margin-left: 8px;
  }

  &&,
  && * {
    color: black;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: -0.4px;

    @media (max-width: 480px) {
      & {
        font-size: 9px;
      }
    }
  }
`;

const Arrow = styled.div`
  min-width: 7.18px;
  height: 4.59px;
  background: url("/icons/arrow-bar.svg");
  mix-blend-mode: difference;
  transition: all 0.3s ease-in-out;

  &[data-rotation="up"] {
    transform: rotate(180deg);
  }
`;

const LayersPanel = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 200px;
  height: 200px;
  background: #262628;
  overflow: scroll;

  top: 70px;
  border-radius: 10px;
  padding-left: 10px;
`;

const LayersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: max-content;
`;

const Layer = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &&&[data-mode="hidden"] * {
    opacity: 0.6;
  }

  border-bottom: 1px solid #646468;
  padding-right: 10px;

  &&,
  && * {
    font-weight: 400;
    font-size: 13px;
    line-height: 22px;
    letter-spacing: -0.4px;
    color: white;
  }
`;

const VisIcon = styled(EyeInvisibleOutlined)`
  &&,
  && * {
    font-size: 16px;
  }
`;

const LabelLayer = styled.div`
  display: flex;
  align-items: center;

  &&::before {
    content: "";
    width: 15px;
    height: 15px;
    margin-right: 10px;
    border-radius: 8px;
    background: lightgrey;
  }

  && > * + * {
    margin-left: 10px;
  }
`;

const TopBar = ({ fullsize, layers, setLayers }) => {
  const [graphicsPanel, showGraphicsPanel] = useState(false);
  const [graphicsAreReady, setGraphicsReady] = useState(false);

  useEffect(() => {
    if (graphicsPanel) {
      const timer = setTimeout(() => setGraphicsReady(true), 400);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setGraphicsReady(false);
    }
  }, [graphicsPanel]);

  const [layersPanel, setLayersPanel] = useState(false);

  const graphicsRef = useRef();
  const layersRef = useRef();

  useClickedOutside(graphicsRef, showGraphicsPanel);
  useClickedOutside(layersRef, setLayersPanel);

  return (
    <>
      <Bar>
        {layersPanel && (
          <LayersPanel ref={layersRef}>
            <LayersWrapper>
              {layers.map((item = {}, i) => {
                const { name, visible } = item;

                return (
                  <Layer
                    key={`layer${i}`}
                    data-mode={visible ? "default" : "hidden"}
                  >
                    <LabelLayer>
                      <div>{name}</div>
                    </LabelLayer>
                    <VisIcon
                      onClick={() =>
                        setLayers((state) =>
                          state.map((item, _i) => {
                            if (i !== _i) return item;
                            const { visible: _visible, ...otherItemProps } =
                              item;

                            return { visible: !_visible, ...otherItemProps };
                          })
                        )
                      }
                    />
                  </Layer>
                );
              })}
            </LayersWrapper>
          </LayersPanel>
        )}

        <LeftSide>
          <LeftSide.Btn
            section="layers"
            onClick={(e) => {
              e.stopPropagation();
              return setLayersPanel((state) => !state);
            }}
          />
          <LeftSide.Btn section="history" />
        </LeftSide>

        <RightSide
          ref={graphicsRef}
          data-type={graphicsPanel ? "fullsize" : "default"}
        >
          <ChartHeader
            onClick={(e) => {
              e.stopPropagation();
              return showGraphicsPanel((state) => !state);
            }}
          >
            <Arrow data-rotation={graphicsPanel ? "up" : "down"} />
            <div>Инфографика</div>
          </ChartHeader>

          {graphicsAreReady && <ChartBar />}
        </RightSide>
      </Bar>
    </>
  );
};

export default TopBar;
