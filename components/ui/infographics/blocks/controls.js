import { Space, Input } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import useStatusStore from "../../../../store/status-store";
import { v4 as uuidv4 } from "uuid";

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

const ControlsBlock = ({ data = {} }) => {
  const { button = {}, fetch = {} } = data;
  const { body = {}, ...otherFetchParams } = fetch;
  const { label = "Отправить" } = button;

  const infographicsData = useStatusStore(
    ({ infographicsData }) => infographicsData
  );
  const { id } = infographicsData;

  const [params, setParams] = useState([]);
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
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {params.map((item = {}, i) => {
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
        })}

        <Btn onClick={handleFetch}>{label}</Btn>
      </div>
    </>
  );
};

export default ControlsBlock;
