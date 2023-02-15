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
import {
  Wrapper,
  FlexLabel,
  FlexItem,
  Tag,
} from "../../../../components/ui/topbar/patterns/treemap/__styles";

import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

import FocusIcon from "./icons/focus";
import VisibleIcon from "./icons/visible";
import HiddenIcon from "./icons/hidden";
import stc from "string-to-color";

const { Text } = Typography;

const LayerTreemap = ({ type }) => {
  /* linksStructure = scene. Те же самые данные */
  let linksStructure = useStatusStore(({ linksStructure }) => linksStructure);
  const sceneLogId = useStatusStore(({ sceneLogId }) => sceneLogId);

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  const setUserData = useStatusStore(({ setUserData }) => setUserData);

  const GUIData = useStatusStore(({ GUIData }) => GUIData);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

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

  const renderTree = (nodes) => {
    if (
      !(
        nodes.isCamera ||
        nodes.isLight ||
        nodes.isTransformControls ||
        nodes.name === "bounding-box" ||
        nodes.name === "hover-box" ||
        nodes.name === "light-box"
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
      <Wrapper>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {tags && Object.keys(tags).length > 0 && (
            <>
              <div
                style={{
                  width: "100%",
                  padding: "0px 10px 10px 10px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Tags
              </div>
              <Space
                style={{ width: "100%", padding: "0 10px 30px 10px" }}
                size={2}
                wrap
              >
                {Object.keys(tags).map((name, i) => {
                  return (
                    <Tag color={stc(name)} key={`tag:${i}`}>
                      <div style={{ position: "relative" }}>
                        {name}
                        <span style={{ opacity: 0.7 }}>
                          -{tags[name]?.count}
                        </span>
                      </div>
                    </Tag>
                  );
                })}
              </Space>
            </>
          )}
        </div>

        <div
          style={{
            width: "100%",
            padding: "0px 10px 5px 10px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Scene structure:
        </div>

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
