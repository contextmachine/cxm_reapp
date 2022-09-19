import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import useStatusStore from "../../../../store/status-store";
import { Tree } from "antd";
import { useThree } from "@react-three/fiber";
import { Typography } from "antd";

import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const { Text } = Typography;

const Wrapper = styled.div`
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

const LayerTreemap = () => {
  let linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);

  const renderTree = (nodes) => {
    if (!(nodes.isCamera || nodes.isLight || nodes.name === "bounding-box"))
      return (
        <TreeItem
          key={nodes.id}
          nodeId={nodes.id}
          label={
            <FlexLabel
              fill={nodes.type === "Group" ? "/layers/3.svg" : "/layers/4.svg"}
            >
              <Text ellipsis={{ rows: 1 }}>
                {nodes.name ? nodes.name : nodes.type}
              </Text>
            </FlexLabel>
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (linksStructure) {
              const object = linksStructure.getObjectByProperty("id", nodes.id);

              const box3 = new THREE.Box3();
              box3.setFromObject(object);

              setBoundingBox({ ...box3, logId: uuidv4() });
            }
          }}
        >
          {Array.isArray(nodes.children)
            ? nodes.children
                .filter((_, i) => i < 50)
                .map((node) => renderTree(node))
            : null}
        </TreeItem>
      );
  };

  return (
    <>
      <Wrapper>
        {linksStructure && (
          <TreeView
            aria-label="rich object"
            defaultExpanded={sceneLogId ? [linksStructure.id] : []}
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
