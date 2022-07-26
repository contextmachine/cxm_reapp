import React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";

import {
  Button,
  Radio,
  Spin,
  Space,
  Grid,
  Typography,
  Checkbox,
  Dropdown,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import LayersIcon from "./icons/layers";
import PlusIcon from "./icons/plus";
import useStore from "../../../store/store";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Top = styled.div`
  position: fixed;
  top: 40px;
  z-index: 10;
  height: 60px;
  display: flex;

  ${({ position }) =>
    position === "left"
      ? `
    & {
      left: 40px;
    }
    `
      : position === "right"
      ? `
    
      & {
        right: 40px
      }
    `
      : `& {
        left: 0px
      `}
`;

const Bottom = styled.div`
  position: fixed;
  bottom: 40px;
  z-index: 10;

  ${({ position }) =>
    position === "left"
      ? `
      left: 40px;
    `
      : ``}

  ${({ position }) =>
    position === "center"
      ? `
    left: 50%;
    transform: translateX(-50%);
  `
      : ``}

  ${({ position }) =>
    position === "right"
      ? `
        left: auto;
        right: 40px;
      `
      : ``}

  display: flex;

  && > * + * {
    margin-left: 10px;
  }

  .ant-btn-noborder {
    border: 0px;
    border-radius: 200px;
  }

  .ant-btn {
    display: flex;
    align-items: center;

    & > * + * {
      margin-left: 12px;
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: max-content;
  display: flex;
  align-items: center;

  &&& button {
    box-shadow: inherit;
  }

  height: 60px;

  border-radius: 200px;

  padding: 10px;
  background: white;

  &&&[data-size="large"] {
    height: 80px;
    padding: 10px 30px;
    transform: translateY(10px);
  }

  && .ant-radio-button-wrapper {
    border-radius: 200px;

    &::before {
      display: none;
    }
  }

  @media (max-width: 576px) {
    &,
    & * {
      font-size: 12px;
    }
  }
`;

const Loading = styled.div`
  position: fixed;
  bottom: 120px;
  background: grey;
  z-index: 10;

  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: white;
  padding: 6px 12px;
  border-radius: 100px;

  @media (max-width: 576px) {
    &,
    & * {
      font-size: 12px;
    }
  }
`;

const Disabling = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: grayscale(1);

  z-index: 11;
`;

const VR = styled.div`
  position: relative;
  width: 1px;
  height: 60%;
  background: rgba(0, 0, 0, 0.15);

  margin-left: 10px;
  margin-right: 10px;
`;

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
      color: "black",
      paddingRight: "12px",
      marginRight: "12px",
    }}
    spin
  />
);

const DropWindow = styled.div`
  background: white;
  border-radius: 10px;
  padding: 10px;

  margin-bottom: 24px;
`;

const openLayers = () => {
  return (
    <DropWindow>
      <Space direction="vertical" size={40}>
        <Space direction="vertical">
          <div>Hello</div>
          <div>Hello 1</div>
          <div>Hello 2</div>
        </Space>

        <Space direction="vertical">
          <div>Hello</div>
          <div>Hello 1</div>
          <div>Hello 2</div>
        </Space>
      </Space>
    </DropWindow>
  );
};

const BottomNav = ({
  view,
  setView,
  percentsLoaded,
  loadingObj,
  loadingVisible,
  simpleModel,
  setSimpleModel,
  showLayersWindow = () => {},
  showPointsWindow = () => {},
  newPointMode,
}) => {
  const screens = useBreakpoint();

  const setShowInfographics = useStore(
    ({ setShowInfographics }) => setShowInfographics
  );

  return (
    <>
      {loadingVisible && (
        <Loading>
          <Space
            align="center"
            direction={screens.sm ? "horizontal" : "vertical"}
          >
            <Space size={0}>
              <Spin indicator={antIcon} /> {loadingObj}:{" "}
            </Space>
            <Text style={{ color: "white" }}>
              {Math.round(parseFloat(percentsLoaded))}% модели загрузилось
            </Text>
          </Space>
        </Loading>
      )}

      {newPointMode && (
        <Loading>
          <Space align="center">
            Кликните в любую область, чтобы создать точку
          </Space>
        </Loading>
      )}

      <Bottom position="left">
        <Wrapper>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              showPointsWindow(false);
              showLayersWindow(true);
            }}
            icon={
              <span style={{ fontSize: "24px" }}>
                <LayersIcon />
              </span>
            }
            size="large"
            type="noborder"
          >
            Слои
          </Button>

          <VR />

          <Button
            onClick={(e) => {
              e.stopPropagation();
              showLayersWindow(false);
              showPointsWindow(true);
            }}
            icon={
              <span style={{ fontSize: "24px" }}>
                <PlusIcon />
              </span>
            }
            size="large"
            type="noborder"
          >
            Точки
          </Button>
        </Wrapper>
      </Bottom>

      <Bottom position="center">
        <Wrapper
          data-size="large"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfographics(true);
          }}
        >
          <Button size="large" type="noborder">
            Показать инфографику
          </Button>
        </Wrapper>
      </Bottom>

      <Bottom position="right">
        <Wrapper data-type="radio">
          <Radio.Group value={view} size="large" onChange={() => {}}>
            <Radio.Button
              value="perspective"
              onClick={() => setView("perspective")}
            >
              Перспектива
            </Radio.Button>
            <Radio.Button value="ortho" onClick={() => setView("ortho")}>
              Орто
            </Radio.Button>
            <Radio.Button value="top" onClick={() => setView("top")}>
              План
            </Radio.Button>
          </Radio.Group>
        </Wrapper>
      </Bottom>

      {null && (
        <Top position="left">
          <Wrapper>
            {loadingVisible && <Disabling />}

            <Checkbox
              style={{ opacity: loadingVisible ? 0.5 : 1 }}
              checked={simpleModel}
              onChange={(e) => setSimpleModel(!simpleModel)}
            >
              Упростить модель
            </Checkbox>
          </Wrapper>
        </Top>
      )}
    </>
  );
};

export default BottomNav;
