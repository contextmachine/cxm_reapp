import { Form } from "antd";
import { useMemo } from "react";
import useStatusStore from "../../../../../../store/status-store";
import ChartBlock from "../../chart";
import Editor from "./editor";

const GenerateChart = ({ value, object_id }) => {
  /* const data = {
    id: "size-linechart",
    name: "график по размерам",
    type: "chart",
    require: ["linechart", "piechart"],
    key: "size",
    colors: "default",
    data: [
      {
        id: "small",
        value: 83,
      },
      {
        id: "big",
        value: 109,
      },
      {
        id: "medium",
        value: 208,
      },
    ],
  }; */

  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);

  const formattedValue = useMemo(() => {
    if (!(value && object_id && linksStructure)) return;

    const { key } = value;

    let values = {};

    let object = null;
    linksStructure.traverse(function (child) {
      if (child.uuid === object_id) {
        object = child;
      }
    });

    if (object) {
      /* Поиск, используя аттрибут "key" */
      object.traverseVisible((obj = {}) => {
        const { userData } = obj;
        if (userData) {
          const { properties = {} } = userData;
          const foundKey = properties ? properties[key] : null;

          if (foundKey) {
            if (!values[foundKey]) values[foundKey] = 0;
            values[foundKey] += 1;
          }
        }
      });
    }

    let data = [];
    Object.keys(values).map((name) => {
      const count = values[name];

      data.push({ id: name, value: count });
    });

    const { data: _, ...other } = value;

    return { data, ...other };
  }, [value, object_id, linksStructure]);

  if (!value) return value;

  return (
    <>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <ChartBlock data={formattedValue} />

        {formattedValue && (
          <Form.Item style={{ padding: "16px 0" }}>
            <Editor value={{ data: formattedValue.data }} />
          </Form.Item>
        )}
      </div>
    </>
  );
};

export default GenerateChart;
