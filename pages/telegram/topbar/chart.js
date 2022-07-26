import React from "react";
import styled from "styled-components";
import { Column, Pie } from "@ant-design/plots";

const handleColor = (label_type) => {
  let radius;
  let color;

  if (label_type === 0) {
    radius = 0.45;
    color = "#00FF85";
  }
  if (label_type === 1) {
    radius = 0.45;
    color = "#EBFF00";
  }
  if (label_type === 2) {
    radius = 0.45;
    color = "#FFB800";
  }
  if (label_type === 3) {
    radius = 1;
    color = "#FF6B00";
  }
  if (label_type === 4) {
    radius = 1;
    color = "#FB0707";
  }

  return [radius, color];
};

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 50px);

  padding: 0 10px;

  position: absolute;
  top: 50px;
`;

const Arrow = styled.div`
  position: absolute;
  z-index: 20;
  width: 36px;
  height: 36px;

  top: 50%;
  background: black;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  &&::before {
    content: "";
    background: url("/icons/arr-1.svg");
    background-size: cover;
    width: 11.84px;
    height: 21px;
  }

  &&[data-pos="left"] {
    left: 5px;
    transform: translateY(-120%);
  }

  &&[data-pos="right"] {
    right: 5px;
    transform: translateY(-120%) scaleX(-100%);
  }
`;

const ChartBar = () => {
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

  const labels = Array(5)
    .fill(1)
    .map((_, i) => {
      return { type: i, count: 100 + Math.floor(250 * Math.random()) };
    });

  const data1 = labels.map(({ type, count }) => {
    return {
      value: count,
      type: `${type}`,
    };
  });

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

  const pieConfigAccess = {
    ...commonPieCfgs,
    data: data1,
    angleField: "value",
    colorField: "type",
    color: ({ type }) => {
      return handleColor(parseInt(type))[1];
    },
  };

  return (
    <Wrapper>
      <Arrow data-pos="left"/>
      

      <Column {...lineConfigAccess} />
      {null && <Pie {...pieConfigAccess} />}
    </Wrapper>
  );
};

export default ChartBar;
