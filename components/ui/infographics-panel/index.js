import React, { useRef, useEffect, useState } from "react";
import { Modal } from "antd";
import Draggable from "react-draggable";
import styled from "styled-components";
import stc from "string-to-color";
import { Select } from "antd";

import { Paper } from "../../models/edit";
import { Column, Pie } from "@ant-design/plots";
import useStore from "../../../store/store";
import handleColor from "../../models/utils/handle-color";

const { Option } = Select;

const SwitchWrapper = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  padding: 2px;

  display: flex;
  align-items: center;
  max-width: max-content;
`;

const Switch = styled.div`
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 50px;
  cursor: pointer;

  &&[data-type="active"] {
    background: grey;
    color: white;
  }
`;

const HeadPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Selection = styled(Select)`
  && {
    min-width: 150px;
  }

  &&& .ant-select-selector {
    border-radius: 50px;
    border: 1px solid grey;
  }

  & .ant-select-item-option-content {
    font-size: 12px;
  }
`;

const InfographicsPanel = ({ labels = [], racks = [] }) => {
  const showInfographics = useStore(({ showInfographics }) => showInfographics);
  const setShowInfographics = useStore(
    ({ setShowInfographics }) => setShowInfographics
  );

  const infoSection = useStore(({ infoSection }) => infoSection);
  const setInfoSection = useStore(({ setInfoSection }) => setInfoSection);

  const setSelectedLength = useStore(
    ({ setSelectedLength }) => setSelectedLength
  );
  const setSelectedAccess = useStore(
    ({ setSelectedAccess }) => setSelectedAccess
  );

  const [viewType, setViewType] = useState("pie");

  const data = racks.map(({ type, count }) => {
    return {
      length: `${type}`,
      value: count,
      type: `${type}`,
    };
  });

  const data1 = labels.map(({ type, count }) => {
    return {
      value: count,
      type: `${type}`,
    };
  });

  const commonLineCfgs = {
    isStack: true,
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

  const commonPieCfgs = {
    appendPadding: 10,
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  const lineConfig = {
    ...commonLineCfgs,
    data,
    xField: "length",
    yField: "value",
    colorField: "type",
    color: ({ length }) => {
      return stc(`${length}`);
    },
  };

  const pieConfigAccess = {
    ...commonPieCfgs,
    data: data1,
    angleField: "value",
    colorField: "type",
    color: ({ type }) => {
      return handleColor(parseInt(type))[1];
    },
  };

  const lineConfigAccess = {
    ...commonLineCfgs,
    data: data1,
    xField: "type",
    yField: "value",
    colorField: "type",
    color: ({ type }) => {
      return handleColor(parseInt(type))[1];
    },
  };

  const pieConfig = {
    ...commonPieCfgs,
    data,
    angleField: "value",
    colorField: "length",
    color: ({ length }) => {
      return stc(`${length}`);
    },
  };

  const PaperRef = useRef();
  const ListRef = useRef();

  useEffect(() => {
    const clickOutside = (e) => {
      if (
        PaperRef.current &&
        !PaperRef.current.contains(e.target) &&
        ListRef.current &&
        !ListRef.current.contains(e.target)
      )
        setShowInfographics(false);
    };

    window.addEventListener("click", clickOutside);

    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, []);

  if (!showInfographics) return <></>;

  return (
    <Paper ref={PaperRef} data-type="infographics">
      <HeadPanel>
        <Selection
          value={infoSection}
          dropdownRender={(menu) => {
            return <div ref={ListRef}>{menu}</div>;
          }}
          onChange={(value) => {
            setInfoSection(value);
          }}
          dropdownStyle={{ fontSize: "12px" }}
        >
          <Option value="racks">Стойки</Option>
          <Option value="access">Коммуникации</Option>
        </Selection>

        <SwitchWrapper>
          <Switch
            data-type={viewType === "pie" ? "active" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              setViewType("pie");
            }}
          >
            Пай чарт
          </Switch>
          <Switch
            data-type={viewType === "line" ? "active" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              setViewType("line");
            }}
          >
            Линейный чарт
          </Switch>
        </SwitchWrapper>
      </HeadPanel>

      {infoSection === "racks" && (
        <>
          {viewType === "line" ? (
            <Column
              {...lineConfig}
              onReady={(plot) => {
                plot.on("mouseover", (evt = {}) => {
                  const { data = {} } = evt ? evt : {};
                  const { data: data_l2 = {} } = data ? data : {};

                  const { length } = data_l2 ? data_l2 : {};

                  if (length) setSelectedLength(length);
                });

                plot.on("mouseout", (evt = {}) => {
                  setSelectedLength(null);
                });
              }}
            />
          ) : (
            <Pie
              {...pieConfig}
              onReady={(plot) => {
                plot.on("mouseover", (evt = {}) => {
                  const { data = {} } = evt ? evt : {};
                  const { data: data_l2 = {} } = data ? data : {};

                  const { length } = data_l2 ? data_l2 : {};

                  if (length) setSelectedLength(length);
                });

                plot.on("mouseout", (evt = {}) => {
                  setSelectedLength(null);
                });
              }}
            />
          )}
        </>
      )}

      {infoSection === "access" && (
        <>
          {viewType === "line" ? (
            <Column
              {...lineConfigAccess}
              onReady={(plot) => {
                plot.on("mouseover", (evt = {}) => {
                  const { data = {} } = evt ? evt : {};

                  const { data: data_l2 = {} } = data ? data : {};

                  const { type } = data_l2 ? data_l2 : {};

                  if (type) setSelectedAccess(type);
                });

                plot.on("mouseout", (evt = {}) => {
                  setSelectedAccess(null);
                });
              }}
            />
          ) : (
            <Pie
              {...pieConfigAccess}
              onReady={(plot) => {
                plot.on("mouseover", (evt = {}) => {
                  const { data = {} } = evt ? evt : {};
                  const { data: data_l2 = {} } = data ? data : {};

                  const { type } = data_l2 ? data_l2 : {};

                  if (type) setSelectedAccess(type);
                });

                plot.on("mouseout", (evt = {}) => {
                  setSelectedAccess(null);
                });
              }}
            />
          )}
        </>
      )}
    </Paper>
  );
};

export default InfographicsPanel;
