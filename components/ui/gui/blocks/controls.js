import { Button, Space } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import useStatusStore from "../../../../store/status-store";
import { v4 as uuidv4 } from "uuid";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Wrapper } from "../../../../pages/scene/topbar/blocks/layer-treemap";

import { Input, Checkbox, Select, Slider } from "antd";

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

export const TreeRow = styled.div`
  width: 100%;

  && .MuiTreeItem-group {
    margin-left: 10px;
  }

  && .MuiTreeItem-iconContainer {
    width: 10px;
    margin-right: 0px;
  }

  && .MuiTreeItem-label {
    padding-left: 0px;
    padding-top: 3.5px;
    padding-bottom: 3.5px;
  }

  &&& > * > * {
    padding-left: 0;
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

export const ControlWrapper = styled.div`
  max-width: 160px;
  width: 100%;
`;

const ModuleString = ({ value }) => {
  return <Input defaultValue={value} />;
};

const ModuleCheck = ({ value }) => {
  return <Checkbox checked />;
};

const ModuleSelect = ({ value }) => {
  return (
    <Select
      defaultValue="lucy"
      onChange={() => {}}
      options={[
        {
          value: "jack",
          label: "Jack",
        },
        {
          value: "lucy",
          label: "Lucy",
        },
        {
          value: "disabled",
          disabled: true,
          label: "Disabled",
        },
        {
          value: "Yiminghe",
          label: "yiminghe",
        },
      ]}
    />
  );
};

const ModuleSlider = ({ min, max, value, dbl }) => {
  return (
    <>
      <Slider range={dbl} defaultValue={value} min={min} max={max} />
    </>
  );
};

const ModuleDifition = ({ data, name }) => {
  const { value } = data;

  let isButton = false;
  let isSelect = false;

  let isSlider = false;
  let isDblSlider = false;

  if (typeof value === "object") {
    const { type, options, min, max, value: _value } = value;
    if (type === "button") isButton = true;
    if (options) isSelect = true;

    if (typeof min === "number" && typeof max === "number") {
      isSlider = true;

      if (typeof value === "object") isDblSlider = true;
    }
  }

  let module;

  if (typeof value === "string") {
    module = <ModuleString {...{ value }} />;
  } else if (typeof value === "boolean") {
    module = <ModuleCheck />;
  } else if (isSelect) {
    module = <ModuleSelect />;
  } else if (isSlider) {
    const { min, max, value: _value } = value;

    if (!isDblSlider) {
      module = <ModuleSlider {...{ min, max, value: _value }} />;
    } else {
      module = <ModuleSlider {...{ min, max, value: _value }} dbl />;
    }
  }

  return (
    <>
      {isButton ? (
        <Button>{name}</Button>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "400", opacity: 0.7 }}>{`${name}:`}</div>

          <ControlWrapper>{module ? module : <ModuleString />}</ControlWrapper>
        </div>
      )}
    </>
  );
};

const ControlsBlock = ({ data: parentData = {} }) => {
  const GUIData = useStatusStore(({ GUIData }) => GUIData);
  const { id } = GUIData;

  let { data = {} } = parentData;

  /*const [params, setParams] = useState([]);
  useEffect(() => {
    if (body) {
      let params = [];
      Object.keys(body).map((name) => {
        const item = body[name];

        params.push({ name, data: item });
      });

      setParams(params);
    }
  }, [body]);

  const setKeyFetch = useStatusStore(({ setKeyFetch }) => setKeyFetch);

  const handleFetch = () => {
    let obj = {};
    params.map((item = {}) => {
      const { name, data = [] } = item;

      obj[name] = data;
    });

    setKeyFetch({
      fetch: { body: obj, ...otherFetchParams },
      id,
      logId: uuidv4(),
    });
  }; */

  let usedIndex = 0;
  const addId = (data) => {
    const { children } = data;
    data.id = `${usedIndex}`;
    usedIndex += 1;

    if (children) {
      children.map((child) => addId(child));
    }
  };
  addId(data);

  console.log("data", data);

  let allKeys = [];

  const handleId = (data) => {
    const { id } = data;
    const { children } = data;

    allKeys.push(id);

    if (children) {
      children.map((child) => handleId(child));
    }
  };
  handleId(data);

  const renderTree = (nodes) => (
    <TreeRow>
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          nodes.children ? (
            <div
              style={{ fontWeight: "600", marginLeft: "10px" }}
            >{`${nodes.name}`}</div>
          ) : (
            <>{<ModuleDifition data={nodes} name={nodes.name} />}</>
          )
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    </TreeRow>
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Wrapper>
          <SubWrapper>
            <TreeView
              aria-label="rich object"
              defaultCollapseIcon={
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <ExpandMoreIcon />
                </div>
              }
              defaultExpanded={allKeys}
              defaultExpandIcon={
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <ChevronRightIcon />
                </div>
              }
              sx={{ flexGrow: 1, maxWidth: 260, overflowY: "auto" }}
            >
              {renderTree(data)}
            </TreeView>
          </SubWrapper>
        </Wrapper>

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
