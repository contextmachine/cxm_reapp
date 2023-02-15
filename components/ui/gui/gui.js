import styled from "styled-components";
import { useMemo, useRef } from "react";
import useStatusStore from "../../../store/status-store";
import {
  Header,
  Wrapper,
  HR,
  Overflow,
  List,
  Tag,
  Plus,
  Line,
} from "./__styles";
import { Row, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ChartBlock from "./blocks/chart";
import ControlsBlock from "./blocks/controls";
import TreeViewEditor from "./blocks/controls/tree-view-editor";

import Modules from "./blocks/modules";

import { Tabs } from "./blocks/__styles";
import Queries from "./blocks/queries/queries";
import { useRouter } from "next/router";

const { Text } = Typography;

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
  const router = useRouter();
  const { query } = router;
  const { pid } = query;

  const GUIData = useStatusStore(({ GUIData }) => GUIData);
  const setGUIData = useStatusStore(({ setGUIData }) => setGUIData);

  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);

  const { name, id, gui = [], logId } = GUIData ? GUIData : {};

  const handleClose = () => {
    setGUIData(null);
  };

  const panelRef = useRef();
  const backTop = () => {
    panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const object = useMemo(() => {
    if (linksStructure && GUIData) {
      const { id } = GUIData;

      let found;
      linksStructure.traverse((obj = {}) => {
        const { id: _id } = obj;
        if (id === _id) {
          found = obj;
        }
      });

      const { logId, ...other } = GUIData;
      let res = { ...other };

      if (found) {
        const { type, isLight } = found;
        res = { ...res, type };

        if (isLight) {
          const { intensity } = found;
          res = { ...res, intensity };
        }
      }

      return res;
    }
  }, [GUIData, linksStructure]);

  if (!GUIData) return <></>;

  return (
    <>
      <Wrapper id={`right-panel`} ref={panelRef} key={`vv:${logId}`}>
        <Header>
          <Text ellipsis={{ rows: 1 }} style={{ fontSize: "24px" }}>
            {name ? name : `Группа без имени`}
          </Text>
          <div
            onClick={handleClose}
            style={{ fontSize: "20px", cursor: "pointer" }}
          >
            <CloseOutlined />
          </div>
        </Header>

        <Modules />

        <Line>
          <Tabs
            style={{ marginBottom: "16px" }}
            defaultActiveKey={gui.length > 0 ? "item-2" : "item-1"}
          >
            <Tabs.TabPane tab="Детали" key="item-1">
              <Overflow>
                <TreeViewEditor data={/* GUIData */ object} objectName={name} />
              </Overflow>
            </Tabs.TabPane>

            {/* gui.length > 0 && (
              <Tabs.TabPane tab="GUI" key="item-2">
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
              </Tabs.TabPane>
                  ) */}

            <Tabs.TabPane tab="Form" key="item-3">
              <Queries {...{ pid }} />
            </Tabs.TabPane>
          </Tabs>
        </Line>
      </Wrapper>
    </>
  );
};

export default GUI;
