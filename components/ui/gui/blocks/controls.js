import { Space } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import useStatusStore from "../../../../store/status-store";

import { Segmented } from "antd";
import JSONEditor from "./controls/json-editor";
import { Btn as BtnPrimary } from "./__styles";
import TreeViewEditor from "./controls/tree-view-editor";
import { notification } from "antd";

import { BackTop, Row as AntRow } from "antd";
import { HR } from "../__styles";
import { Tabs } from "./__styles";

import { v4 as uuidv4 } from "uuid";
import { Alert } from "antd";

import * as THREE from "three";

const Btn = styled.div`
  width: 100%;
  height: 30px;
  background: #625af6;
  border-radius: 10px;

  margin-top: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  &,
  & * {
    color: white;
    font-size: 11px;
  }

  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  width: 100%;

  && * {
    font-size: 11px;
  }

  && .ant-input {
    height: 24px;
    width: 100%;
  }

  && .ant-segmented {
    width: 100%;
    margin-bottom: 8px;
    background: rgb(0 0 0 / 24%);
    overflow: hidden;
    border-radius: 10px;

    & .ant-segmented-item {
      width: 100%;
      border-radius: 10px;
    }
  }
`;

const FragmentSpace = styled(Space)`
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 4px;
  padding-right: 4px;

  border-radius: 5px;

  &&:hover {
    outline: 1px solid #625af6;
  }
`;

export const SubWrapper = styled.div`
  &&&&&&& .Mui-selected {
    background: none !important;

    & * {
      color: black;
    }
  }

  &&& {
    & .ant-input {
      height: 24px;
    }

    & .ant-btn {
      width: 100%;
      height: 24px;
      background: #1890ff;
      color: white;
      font-size: 12px;
      border-radius: 10px;
      border: 0px;
    }

    & .ant-select {
      width: 100%;
      height: 24px;

      & .ant-select-arrow {
        top: 9px;
      }

      & .ant-select-selection-item {
        padding-top: 3px;
      }

      & > * {
        height: 100%;
      }
    }
  }
`;

const ControlsBlock = ({ data: parentData = {}, backTop = () => {} }) => {
  const GUIData = useStatusStore(({ GUIData }) => GUIData);
  const metaData = useStatusStore(({ metaData }) => metaData);
  const { id } = GUIData;

  let { data = {}, post = {} } = parentData;

  const [input, setInput] = useState();
  const [output, setOutput] = useState();
  useEffect(() => {
    if (data) {
      setInput(data);
    }

    if (post) {
      setOutput(post);
    }
  }, [data, post]);

  const [editorType, setEditorType] = useState("code");
  const [resultType, setResultType] = useState("code");

  const setKeyFetch = useStatusStore(({ setKeyFetch }) => setKeyFetch);

  const handleUpdate = () => {
    setKeyFetch({ data: input, post: output, logId: uuidv4() });
    notification.info({
      message: "Ожидаем ответ от сервера...",
      placement: "bottomRight",
      duration: 1,
    });
    backTop();
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <AntRow>
          <Tabs>
            <Tabs.TabPane tab="Форма" key="item-1">
              <div style={{ fontSize: "18px", marginBottom: "12px" }}>
                Входные данные:
              </div>

              <Row>
                <Segmented
                  options={[
                    { label: "JSON редактор", value: "code" },
                    { label: "UI", value: "ui" },
                  ]}
                  onChange={setEditorType}
                />
              </Row>

              {editorType === "code" && (
                <div
                  style={{
                    height: "300px",
                    background: "lightgrey",
                    border: "1px solid grey",
                    width: "calc(100% - 0px)",
                    overflow: "hidden",
                    borderRadius: "3px",
                  }}
                >
                  <JSONEditor data={input} onChange={setInput} type={1} />
                </div>
              )}

              {editorType === "ui" && (
                <TreeViewEditor data={input} onChange={setInput} />
              )}

              <div
                style={{
                  fontSize: "18px",
                  marginBottom: "12px",
                  marginTop: "24px",
                }}
              >
                Результат заменяет:
              </div>
              <Row>
                <Segmented
                  options={[
                    { label: "JSON редактор", value: "code" },
                    { label: "UI", value: "ui" },
                  ]}
                  onChange={setResultType}
                />
              </Row>

              {resultType === "code" && (
                <div
                  style={{
                    height: "300px",
                    background: "lightgrey",
                    border: "1px solid grey",
                    width: "calc(100% - 0px)",
                    overflow: "hidden",
                    borderRadius: "3px",
                  }}
                >
                  <JSONEditor type={2} data={output} onChange={setOutput} />
                </div>
              )}

              {resultType === "ui" && (
                <TreeViewEditor data={output} onChange={setOutput} />
              )}

              <BackTop />
              <BtnPrimary
                type="primary"
                style={{ marginTop: "16px", height: "40px", width: "100%" }}
                onClick={handleUpdate}
              >
                Send data
              </BtnPrimary>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Консоль" key="item-2">
              <span>
                <i style={{ opacity: 0.7 }}>
                  Раздел "Консоль" пока еще в разработке
                </i>
              </span>

              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: "18px" }}
              >
                <Alert message="Success Tips" type="success" showIcon />
                <Alert message="Informational Notes" type="info" showIcon />
                <Alert message="Warning" type="warning" showIcon closable />
                <Alert message="Error" type="error" showIcon />
              </Space>
            </Tabs.TabPane>
          </Tabs>
        </AntRow>
      </div>
    </>
  );
};

export default ControlsBlock;

/* <Btn onClick={handleFetch}>{label}</Btn> */
