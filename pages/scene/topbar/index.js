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

import stc from "string-to-color";

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
  width: 200px;
  height: 400px;
  background: white;
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
    background: ${({ fill }) => (fill ? fill : "lightgrey")};
  }

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
  }
`;

const TopBar = () => {
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

  return (
    <>
      <Bar>
        {layersPanel && (
          <LayersPanel ref={layersRef}>
            <TabLine defaultActiveKey="1" onChange={() => {}}>
              {Object.keys(layersData).map((name, i) => {
                return (
                  <TabPane tab={name} key={`layerTab:${i}`}>
                    <LayersWrapper>
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
                  </TabPane>
                );
              })}
            </TabLine>
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
