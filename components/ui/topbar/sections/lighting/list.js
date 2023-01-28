import React, { useMemo, useState } from "react";
import useStatusStore from "../../../../../store/status-store";
import { Space, Typography } from "antd";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Wrapper, FlexLabel, FlexItem } from "../../patterns/treemap/__styles";

import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

import FocusIcon from "../../../../../pages/scene/topbar/blocks/icons/focus";
import VisibleIcon from "../../../../../pages/scene/topbar/blocks/icons/visible";

const { Text } = Typography;

const List = (props = {}) => {
  let linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  const setUserData = useStatusStore(({ setUserData }) => setUserData);

  const GUIData = useStatusStore(({ GUIData }) => GUIData);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const [logId, setLogId] = useState(uuidv4());

  const renderTree = (nodes) => {
    const { isLight } = nodes;

    if (nodes.isLight || nodes.isScene)
      return (
        <TreeItem
          key={nodes.id}
          nodeId={nodes.id}
          ContentProps={
            GUIData && GUIData.id === nodes.id
              ? { className: "Mui-selected" }
              : {}
          }
          label={
            <FlexItem style={!nodes.visible ? { opacity: 0.5 } : {}}>
              <FlexLabel
                fill={
                  nodes.type === "Group" ? "/layers/3.svg" : "/layers/4.svg"
                }
              >
                <Text ellipsis={{ rows: 1 }}>
                  {nodes.name ? nodes.name : nodes.type}
                </Text>
              </FlexLabel>

              <Space>
                <FocusIcon data-type="actions" />
                <VisibleIcon
                  data-type={nodes.visible ? "actions" : ""}
                  visible={nodes.visible}
                  onClick={() => {
                    let vis = nodes.visible;

                    if (linksStructure) {
                      nodes.traverse((obj) => {
                        obj.visible = vis ? false : true;
                      });

                      setNeedsRender(true);
                    }
                  }}
                />
              </Space>
            </FlexItem>
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (linksStructure) {
              const object = linksStructure.getObjectByProperty("id", nodes.id);

              const { userData, name, id } = object;
              setUserData({ ...userData, logId: uuidv4(), name, id });

              const box3 = new THREE.Box3();
              box3.setFromObject(object);

              setBoundingBox({ ...box3, logId: uuidv4() });
            }
          }}
        >
          {Array.isArray(nodes.children)
            ? nodes.children
                .filter((obj, i) => {
                  let isSel = false;
                  if (GUIData) {
                    isSel = obj.id === GUIData.id;
                  }

                  return i < 50 || isSel;
                })
                .map((node) => renderTree(node))
            : null}
        </TreeItem>
      );
  };

  const defExpanded = useMemo(() => {
    if (sceneLogId) {
      let keys = [linksStructure.id];

      if (GUIData) {
        const objId = GUIData.id;

        let parentKeys = [];

        linksStructure.traverse((obj = {}) => {
          if (obj.id === objId) {
            obj.traverseAncestors((par = {}) => {
              parentKeys.push(par.id);
            });
          }
        });

        keys = parentKeys;
      }

      return keys;
    } else {
      return [];
    }
  }, [sceneLogId, linksStructure, GUIData]);

  return (
    <>
      <Wrapper {...props}>
        {linksStructure && (
          <TreeView
            key={`fd:${logId}`}
            aria-label="rich object"
            defaultExpanded={defExpanded}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              flexGrow: 1,
              height: "100%",
              maxWidth: 400,
              overflowY: "auto",
            }}
          >
            {sceneLogId && renderTree(linksStructure)}
          </TreeView>
        )}
      </Wrapper>
    </>
  );
};

export default List;
