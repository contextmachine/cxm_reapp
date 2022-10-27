import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Router from "next/router";

import styled from "styled-components";

import { EyeInvisibleOutlined } from "@ant-design/icons";
import useClickedOutside from "./outside-hook";
import ChartBar from "./chart";
import useStatusStore from "../../../store/status-store";

import { Space, Tabs, Typography } from "antd";
import { v4 as uuidv4 } from "uuid";
import { LeftOutlined } from "@ant-design/icons";
import LayerTreemap from "./blocks/layer-treemap";

import stc from "string-to-color";
import LayerColormap from "./blocks/layer-colormap";

const { TabPane } = Tabs;
const { Text } = Typography;

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

const LogoHome = styled.div`
  font-weight: 900;
  letter-spacing: 0.8px;
  padding-left: 5px;
  padding-right: 5px;

  display: flex;
  && > * + * {
    margin-left: 5px;
    align-items: center;
  }

  && svg {
    margin-top: 2px;
    transform: scale(0.8, 0.8);
  }

  cursor: pointer;
`;

const PaperWrapper = styled.div`
  &&[data-type="bar"] {
    height: 50px;

    @media (max-width: 480px) {
      & {
        height: 40px;
      }
    }
  }

  background: white;
  border-radius: 10px;
  overflow: hidden;

  display: flex;
  align-items: center;
  padding: 5px;

  cursor: pointer;
`;

const Paper = (props) => {
  const { type, children, ...otherProps } = props;

  return (
    <PaperWrapper data-type={type} {...otherProps}>
      {children}
    </PaperWrapper>
  );
};

const LeftSide = styled.div`
  width: max-content;

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
    width: 500px;
    right: 10px;
    height: 230px;

    @media (max-width: 480px) {
      right: -0px;
      width: 100%;
    }
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
  width: 240px;
  height: calc(100vh - 100px);
  max-height: 800px;
  background: white;
  overflow: scroll;

  top: 70px;
  border-radius: 10px;
`;

export const LayersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: max-content;
  padding: 5px;

  && > * + * {
    margin-top: 4px;
  }
`;

export const Layer = styled.div`
  width: 100%;
  height: 32px;
  background: rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &&&[data-mode="hidden"] * {
    opacity: 0.6;
  }

  padding-right: 10px;
  padding-left: 10px;

  && *[data-function="visibility"] {
    opacity: 0;
  }

  &&:hover {
    background: rgba(0, 0, 0, 0.15);
  }

  &&:hover *[data-function="visibility"] {
    opacity: 1;
  }

  &&,
  && * {
    font-weight: 400;
    font-size: 11px;
    line-height: 22px;
    letter-spacing: -0.4px;
    color: black;

    @media (max-width: 480px) {
      & {
        font-size: 9px;
      }
    }
  }
`;

export const VisIcon = styled(EyeInvisibleOutlined)`
  &&,
  && * {
    font-size: 16px;
  }
`;

export const LabelLayer = styled.div`
  display: flex;
  align-items: center;

  && > * + * {
    margin-left: 10px;
  }
`;

const TabLine = styled(Tabs)`
  && {
    .ant-tabs-tab-btn {
      font-size: 10px;
    }

    .ant-tabs-tab + .ant-tabs-tab {
      margin: 0 0 0 18px;
    }

    position: relative;
  }
`;

const Sections = styled.div`
  width: 100%;
  height: 35px;
  background: lightgrey;
  display: flex;
  border-radius: 10px;
  padding: 2px;
`;

Sections.Wrapper = styled.div`
  width: 100%;
  padding: 5px;
  margin-bottom: 24px;
`;

Sections.Tab = styled.div`
  width: 100%;
  height: 100%;
  color: rgb(60, 60, 60);

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;

  font-size: 12px;

  cursor: pointer;

  &&&[data-active="active"] {
    background: rgb(60, 60, 60) !important;
    color: white;
  }
`;

const TopBar = ({ headers = [] }) => {
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
  const [colorPickerPanel, setColorPickerPanel] = useState(false);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);
  const setControlsInProcess = useStatusStore(
    ({ setControlsInProcess }) => setControlsInProcess
  );
  useEffect(() => {
    if (!layersPanel) {
      setNeedsRender(false);
      setControlsInProcess(false);
    }
  }, [layersPanel]);

  const graphicsRef = useRef();
  const layersRef = useRef();

  useClickedOutside(graphicsRef, showGraphicsPanel);
  useClickedOutside(layersRef, setLayersPanel, true, colorPickerPanel);

  const layersData = useStatusStore(({ layersData }) => layersData);
  const setLayersData = useStatusStore(({ setLayersData }) => setLayersData);
  const setLayerCurrentChange = useStatusStore(
    ({ setLayerCurrentChange }) => setLayerCurrentChange
  );

  const layersUpdated = useStatusStore(({ layersUpdated }) => layersUpdated);
  const setLayersUpdated = useStatusStore(
    ({ setLayersUpdated }) => setLayersUpdated
  );

  const layersCopyData = useMemo(() => {
    return layersData;
  }, [layersData, layersUpdated]);

  const [layersKey, setLayersKey] = useState(uuidv4());

  useEffect(() => {
    if (layersUpdated) {
      setLayersUpdated(false);
    }
  }, [layersUpdated]);

  const handleLayerVisibility = ({ section, layerName }) => {
    let updLayersData = layersData;
    const sectionLayers = updLayersData[section];

    let foundLayer = sectionLayers.find((item = {}) => {
      const { name } = item;
      return name === layerName;
    });

    if (foundLayer) foundLayer.visible = !foundLayer.visible;

    setLayersData(updLayersData);
    setLayerCurrentChange({ section, layerName, visible: foundLayer.visible });
    setLayersUpdated(true);
  };

  const goHome = () => {
    Router.push(`/account`);
  };

  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);

  const [tab, setTab] = useState(1);

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  useEffect(() => {
    if (!(tab === 1) || !layersPanel) {
      setBoundingBox(null);
    }
  }, [tab, layersPanel]);

  return (
    <>
      <Bar>
        {layersPanel && (
          <LayersPanel ref={layersRef}>
            <Sections.Wrapper>
              <Sections>
                <Sections.Tab
                  data-active={tab === 1 ? "active" : "def"}
                  onClick={() => setTab(1)}
                >
                  Слои
                </Sections.Tab>
                <Sections.Tab
                  data-active={tab === 2 ? "active" : "def"}
                  onClick={() => setTab(2)}
                >
                  Цвета
                </Sections.Tab>
              </Sections>
            </Sections.Wrapper>

            {tab === 1 && <LayerTreemap />}

            {tab === 2 && (
              <LayerColormap {...{ colorPickerPanel, setColorPickerPanel }} />
            )}

            {tab === 3 &&
              Object.keys(layersData)
                .filter((_, i) => i === 1)
                .map((name, i) => {
                  return (
                    <LayersWrapper key={`layerTab:${i}`}>
                      {layersCopyData[name].map((item = {}, i) => {
                        const { name: layerName, visible } = item;

                        let colorArr;
                        if (name === "По цветам") {
                          colorArr = layerName ? layerName.split("^") : [];
                        }

                        return (
                          <Layer
                            key={`layer${i}`}
                            data-mode={visible ? "default" : "hidden"}
                          >
                            <LabelLayer
                              fill={
                                name === "По цветам"
                                  ? `rgba(${Math.round(
                                      parseFloat(colorArr[0]) * 255
                                    )}, ${Math.round(
                                      parseFloat(colorArr[1]) * 255
                                    )}, ${Math.round(
                                      parseFloat(colorArr[2]) * 255
                                    )}, ${Math.round(
                                      parseFloat(colorArr[3]) * 255
                                    )})`
                                  : stc(layerName)
                              }
                            >
                              <Text
                                ellipsis={{ rows: 1 }}
                                style={{ maxWidth: "120px" }}
                              >
                                {name === "По цветам"
                                  ? `Цвет #${i}`
                                  : layerName}
                              </Text>
                            </LabelLayer>
                            <VisIcon
                              onClick={() => {
                                handleLayerVisibility({
                                  section: name,
                                  layerName,
                                });
                              }}
                            />
                          </Layer>
                        );
                      })}
                    </LayersWrapper>
                  );
                })}
          </LayersPanel>
        )}

        <LeftSide>
          <Space>
            <Paper type="bar" onClick={goHome}>
              <LogoHome>
                <LeftOutlined />
                <div>CXM</div>
              </LogoHome>
            </Paper>

            <Paper type="bar">
              <LeftSide.Btn
                section="layers"
                onClick={(e) => {
                  e.stopPropagation();
                  return setLayersPanel((state) => !state);
                }}
              />
              <LeftSide.Btn section="history" />
            </Paper>
          </Space>
        </LeftSide>

        {/* <RightSide
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

          {graphicsAreReady && <ChartBar headers={headers} />}
          </RightSide> */}
      </Bar>
    </>
  );
};

export default TopBar;
