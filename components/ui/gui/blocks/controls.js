import { Space } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import useStatusStore from "../../../../store/status-store";

import { Segmented } from "antd";
import JSONEditor from "./controls/json-editor";
import { Btn as BtnPrimary } from "./__styles";
import TreeViewEditor from "./controls/tree-view-editor";

import { v4 as uuidv4 } from "uuid";

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

const ControlsBlock = ({ data: parentData = {} }) => {
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
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
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
          style={{ fontSize: "18px", marginBottom: "12px", marginTop: "24px" }}
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

        <BtnPrimary
          type="primary"
          style={{ marginTop: "16px", height: "40px" }}
          onClick={handleUpdate}
        >
          Send data
        </BtnPrimary>
        {/*params.map((item = {}, i) => {
          const { name, data = [] } = item;

          return (
            <Row key={`r:${i}`}>
              <div style={{ width: "30%", paddingTop: "8px" }}>{name}</div>
              <div style={{ width: "70%" }}>
                {data.map((subitem = {}, b) => {
                  let attrs = [];
                  Object.keys(subitem).map((name) => {
                    const value = subitem[name];

                    attrs.push({ name, value });
                  });

                  return (
                    <FragmentSpace size={2} direction="vertical" key={`s:${b}`}>
                      {attrs.map((attr, c) => {
                        const { name, value } = attr;

                        return (
                          <div
                            style={{ width: "100%", display: "flex" }}
                            key={`n:${c}`}
                          >
                            <div style={{ width: "30%" }}>{name}</div>
                            <div style={{ width: "70%" }}>
                              <Input
                                defaultValue={value}
                                onChange={(e) => {
                                  setParams((state) => {
                                    state[i].data[b][name] = parseFloat(
                                      e.target.value
                                    );

                                    return state;
                                  });
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </FragmentSpace>
                  );
                })}
              </div>
            </Row>
          );
        })*/}
      </div>
    </>
  );
};

export default ControlsBlock;

/* <Btn onClick={handleFetch}>{label}</Btn> */
