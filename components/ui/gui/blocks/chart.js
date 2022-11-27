import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

import { Row, Space } from "antd";
import BarChartIcon from "@mui/icons-material/BarChart";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { useState } from "react";
import { useEffect } from "react";
import { Tag } from "../__styles";
import stc from "string-to-color";
import useStatusStore from "../../../../store/status-store";

const ChartBlock = ({ data: props }) => {
  let { type, require = [], data = [], key } = props;

  data = data.map((item = {}, i) => {
    return { ...item, color: stc(i), label: `sdfs${i}` };
  });

  const [section, setSection] = useState(null);
  useEffect(() => {
    if (require && require.length > 0) {
      setSection(require[0]);
    }
  }, [require]);

  const typeIcons = {
    linechart: <BarChartIcon />,
    piechart: <DataUsageIcon />,
  };

  console.log("section", section);

  const setKeyFilter = useStatusStore(({ setKeyFilter }) => setKeyFilter);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Row justify="space-between">
          <div style={{ fontSize: "18px", marginBottom: "18px" }}>{key}</div>

          {require && require.length > 0 && (
            <Space>
              {require.map((name, i) => {
                return (
                  <Tag
                    data-active={name === section ? "active" : "def"}
                    key={`t:${i}`}
                    onClick={() => setSection(name)}
                  >
                    {typeIcons[name] && typeIcons[name]}
                  </Tag>
                );
              })}
            </Space>
          )}
        </Row>

        <div
          style={{
            height: "150px",
            background: "rgba(0,0,0,.08)",
            borderRadius: "10px",
          }}
        >
          {section === "linechart" && (
            <ResponsiveBar
              onMouseEnter={(e) => {
                const { indexValue } = e;
                if (indexValue) setKeyFilter({ key, value: indexValue });
              }}
              onMouseLeave={() => setKeyFilter(null)}
              data={data}
              keys={["value"]}
              indexBy="id"
              margin={{ top: 10, right: 10, bottom: 30, left: 0 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              axisTop={null}
              axisRight={null}
              enableGridY={false}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              role="application"
            />
          )}

          {section === "piechart" && (
            <ResponsivePie
              onMouseEnter={(e) => {
                const { id } = e;
                if (id) setKeyFilter({ key, value: id });
              }}
              onMouseLeave={() => setKeyFilter(null)}
              data={data}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChartBlock;
