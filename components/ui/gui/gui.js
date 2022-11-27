import styled from "styled-components";
import { useRef } from "react";
import useStatusStore from "../../../store/status-store";
import { Header, Wrapper, HR, Overflow, List, Tag } from "./__styles";
import { Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ChartBlock from "./blocks/chart";
import ControlsBlock from "./blocks/controls";

/* userData для item */
/*const userData = {
  properties: [
    {
      id: "shape",
      name: "Какая форма в сечении",
      value: "circle",
    },
    {
      id: "size",
      name: "Какая фигура по размеру",
      value: "big",
    },
    {
      id: "length",
      name: "длина фигуры",
      value: 9000, //1000 - 10000
    },
    {
      id: "color",
      name: "цвет фигуры",
      color: "purple",
    },
  ],
};*/

/*  userData для itemGroup */
/*
const userData = {
  gui: [
    {
      id: "shape-linechart",
      name: "график по фигурам",
      type: "linechart",
      data: {
        key: "category-shape",
        colors: "default",
      },
    },
  ],
};*/

const GUI = () => {
  const GUIData = useStatusStore(({ GUIData }) => GUIData);
  const setGUIData = useStatusStore(({ setGUIData }) => setGUIData);

  const { name, id, gui = [] } = GUIData ? GUIData : {};

  const handleClose = () => {
    setGUIData(null);
  };

  const panelRef = useRef();
  const backTop = () => {
    panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!GUIData) return <></>;

  return (
    <>
      <Wrapper id={`right-panel`} ref={panelRef}>
        <Header>
          <div style={{ fontSize: "24px" }}>
            {name ? name : `Группа без имени`}
          </div>
          <div
            onClick={handleClose}
            style={{ fontSize: "20px", cursor: "pointer" }}
          >
            <CloseOutlined />
          </div>
        </Header>

        <Overflow>
          <List>
            <HR />
            {gui.map((item = {}, i) => {
              const { type } = item;

              return (
                <Row
                  style={{ display: "flex", flexDirection: "column" }}
                  key={`key:${i}`}
                >
                  {type && type === "chart" && (
                    <ChartBlock data={item} key={`c`} />
                  )}

                  {type && type === "controls" && (
                    <ControlsBlock backTop={backTop} data={item} />
                  )}

                  <HR />
                </Row>
              );
            })}
          </List>
        </Overflow>
      </Wrapper>
    </>
  );
};

export default GUI;
