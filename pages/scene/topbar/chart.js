import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Column, Pie } from "@ant-design/plots";
import useStatusStore from "../../../store/status-store";

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

const NoData = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  &&::before {
    content: "Данных пока нет";
    justify-content: center;
    align-items: center;
    display: flex;
    height: 100px;
    width: 400px;
    /*background: rgba(0, 0, 0, 0.1);*/
    border: 10px solid rgba(0, 0, 0, 0.1);
    border-radius: 20px;
  }
`;

const CatWrapper = styled.div`
  width: 100%;
  height: 20px;
  margin-bottom: 16px;
  overflow: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &&::-webkit-scrollbar {
    display: none;
  }
`;

const CatList = styled.div`
  display: flex;
  width: max-content;
  height: 20px;

  && > * + * {
    margin-left: 5px;
  }
`;

const Cat = styled.div`
  width: min-content;
  background: grey;
  border-radius: 10px;
  height: 20px;

  display: flex;
  align-items: center;
  padding-left: 6px;
  padding-right: 6px;

  cursor: pointer;

  font-size: 9px;
  color: white;

  &&[data-type="active"] {
    background: lightgrey;
  }
`;

const ChartBar = ({ headers = [] }) => {
  headers = headers ? headers : [];

  const metaData = useStatusStore(({ metaData }) => metaData);
  const { __v } = metaData;
  const metaAmount = metaData && Object.keys(metaData).length;

  const [selMeta, setSelMeta] = useState(null);

  useEffect(() => {
    if (metaAmount >= 1) {
      setSelMeta(0);
    } else {
      setSelMeta(null);
    }
  }, [metaAmount]);

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

  const labels = [];

  const data1 = labels.map(({ type, count }) => {
    return {
      value: count,
      type: `${type}`,
    };
  });

  const lineConfigAccess = useMemo(() => {
    let selData = [];
    let selMetaName;

    if (selMeta || selMeta === 0) {
      const allMeta = Object.keys(metaData).filter((name) => name !== "__v");
      const selMetaName_ = allMeta[selMeta];
      selMetaName = selMetaName_;

      selData = metaData[selMetaName_];
    }

    return {
      ...commonLineCfgs,
      data: selData,
      xAxis: {
        label: {
          formatter: (e) => {
            if (selMetaName === "material") {
              return "";

              return (
                <div
                  style={{ width: "15px", height: "20px", background: rgba }}
                ></div>
              );
            } else {
              return e;
            }
          },
        },
      },
      xField: "type",
      yField: "value",
      colorField: "type",
      color: ({ value, type }) => {
        if (selMetaName === "material") {
          const colorSplit = type ? type.split("^") : [];
          const [r, g, b, a] = colorSplit;
          const round = (e) => Math.round(e * 255);

          const rgba = `rgb(${round(r)}, ${round(g)}, ${round(b)})`;

          return rgba;
        }

        return "grey";
      },
    };
  }, [__v, metaData, selMeta]);

  return (
    <Wrapper>
      {/* <NoData /> */}
      <CatWrapper>
        <CatList>
          {Object.keys(metaData)
            .filter((name) => name !== "__v" && headers.includes(name))
            .map((name, i) => {
              return (
                <Cat
                  data-type={selMeta === i ? "active" : "default"}
                  key={`cat:${i}`}
                  onClick={() => setSelMeta(i)}
                >
                  {name}
                </Cat>
              );
            })}
        </CatList>
      </CatWrapper>

      <Column {...lineConfigAccess} />
    </Wrapper>
  );
};

export default ChartBar;

/*const commonPieCfgs = {
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
  };*/

/* <>
        <Arrow data-pos="left" />

        <Column {...lineConfigAccess} />
        {null && <Pie {...pieConfigAccess} />}
  </>*/
