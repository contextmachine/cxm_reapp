import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import useStatusStore from "../../../../store/status-store";
import { Space, Tree } from "antd";
import { useThree } from "@react-three/fiber";
import { Typography } from "antd";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const { Text } = Typography;

export const Wrapper = styled.div`
  width: 100%;

  &&&,
  &&& * {
    font-size: 12px;
    line-height: 1.3;
  }

  &&&& .ant-tree-treenode {
    margin-bottom: 8px;
  }

  && .ant-typography {
    max-width: 100%;
  }

  && .MuiTreeItem-label {
    padding-top: 7.5px;
    padding-bottom: 7.5px;
  }

  && .MuiTreeItem-content,
  && .MuiTreeItem-content {
    border-radius: 10px;
  }

  /* MuiTreeItem-group */

  && .MuiTreeItem-iconContainer > svg {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  && .MuiCollapse-vertical.MuiTreeItem-group {
    border-left: 0.1px solid rgba(0, 0, 0, 0.1);
  }

  &&&&& .Mui-selected {
    background-color: rgb(60 60 60);
    &,
    & * {
      color: white;
    }
  }
`;

const FlexLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  /* && > * + * {
    margin-left: 8px;
  } */

  &&::before {
    content: "";
    background: url("${({ fill }) => (fill ? fill : "")}");
    background-size: cover;
    margin-right: 8px;
    mix-blend-mode: difference;

    min-width: 13px;
    height: 13px;
  }
`;

const FlexItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const LayerTreemap = () => {
  /* linksStructure = scene. Те же самые данные */
  let linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  const setUserData = useStatusStore(({ setUserData }) => setUserData);

  const GUIData = useStatusStore(({ GUIData }) => GUIData);

  const [logId, setLogId] = useState(uuidv4());
  /* useEffect(() => {
    setLogId(uuidv4());
  }, [GUIData]); */

  const renderTree = (nodes) => {
    if (
      !(
        nodes.isCamera ||
        nodes.isLight ||
        nodes.name === "bounding-box" ||
        nodes.name === "hover-box"
      )
    )
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
            <FlexItem>
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
                <div>dfsdf</div>
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

  console.log("defExpanded", defExpanded);

  return (
    <>
      <Wrapper>
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

export default LayerTreemap;
