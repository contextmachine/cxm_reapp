import { Space } from "antd";
import { useMemo, useState } from "react";
import useStatusStore from "../../../../../../store/status-store";

import { v4 as uuidv4 } from "uuid";
import stc from "string-to-color";
import { Tag } from "../../../../topbar/patterns/treemap/__styles";

const Tags = ({ value, onChange }) => {
  let linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const [logId, setLogId] = useState(uuidv4());

  const tags = useMemo(() => {
    if (linksStructure) {
      let tags = {};

      linksStructure.traverse((obj = {}) => {
        const { userData } = obj;

        if (userData && typeof userData?.properties === "object") {
          const properties = userData?.properties;

          Object.keys(properties).map((name) => {
            if (!tags[name]) tags[name] = { count: 0 };

            tags[name].count += 1;
            tags[name].type = typeof properties[name];
          });
        }
      });

      return tags;
    }
  }, [linksStructure]);

  return (
    <>
      <div style={{ maxHeight: "300px", overflow: "hidden" }}>
        <div style={{ marginBottom: "24px", opacity: 0.5 }}>
          Select the tags that belong to the objects where the updated data will
          be located
        </div>

        <Space direction="vertical">
          {tags &&
            Object.keys(tags).map((name, i) => {
              return (
                <Tag
                  active={value && value.includes(name)}
                  onClick={() =>
                    value && !value.includes(name)
                      ? onChange(value ? [...value, name] : [name])
                      : onChange(
                          value ? [...value].filter((n) => n !== name) : []
                        )
                  }
                  style={{ height: "40px" }}
                  color={stc(name)}
                  key={`tag:${i}`}
                >
                  <div style={{ position: "relative" }}>
                    {name}
                    <span style={{ opacity: 0.7 }}>-{tags[name]?.count}</span>
                  </div>
                </Tag>
              );
            })}
        </Space>
      </div>
    </>
  );
};

export default Tags;
