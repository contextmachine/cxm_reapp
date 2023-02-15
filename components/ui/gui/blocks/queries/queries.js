import { CaretRightOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, Col, Collapse, Row, Tooltip, Space, List } from "antd";
import { HR } from "../../__styles";
import JSONEditor from "../controls/json-editor";
import Editor from "../modules/blocks/editor";
import { DELETE_QUERY, QUERIES } from "../modules/blocks/gql";
import { Thumb } from "./styles";

import client from "../../../../apollo/apollo-client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useStatusStore from "../../../../../store/status-store";
import { Btn } from "../__styles";
import { v4 as uuidv4 } from "uuid";
import UpdateForm from "./update-form";

const value = {
  depth: 16,
  offsets: 0.6,
  segments: [
    {
      length: 40,
      angle: 0,
      radius: 5,
    },
    {
      length: 20,
      angle: -60,
      radius: 2,
    },
    {
      length: 15,
      angle: 60,
      radius: 5,
    },
    {
      length: 15,
      angle: 0,
      radius: 5,
    },
  ],
};

const { Panel } = Collapse;

const Queries = ({ pid }) => {
  const setQueryModal = useStatusStore(({ setQueryModal }) => setQueryModal);

  const { data, loading } = useQuery(QUERIES, {
    client,
    variables: { project_name: pid },
  });

  const [deleteQuery] = useMutation(DELETE_QUERY, {
    client,
    refetchQueries: [{ query: QUERIES }, "getQueries"],
  });

  const [logId, setLogId] = useState(uuidv4());

  const queries = useMemo(() => {
    if (loading) return;
    if (data) {
      setLogId(logId);

      const { projects_queries_hub: a = [] } = data;
      return a.map((item = {}) => {
        return item;
      });
    }
  }, [data, loading]);

  return (
    <>
      {!loading && queries.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              textAlign: "center",
              lineHeight: 1.1,
              paddingBottom: "20px",
              opacity: 0.5,
            }}
          >
            You do not have any queries. Would you like to create new one?
          </div>

          <Btn
            style={{ width: "100%" }}
            type="primary"
            onClick={() => setQueryModal(uuidv4())}
          >
            Create new Query
          </Btn>
        </div>
      )}

      <Collapse
        bordered={false}
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        {queries &&
          queries.map((item = {}, i) => {
            const { name, body, endpoint, tags, id } = item;

            const settings = [
              { name: "Edit", action: () => setQueryModal(id) },
              {
                name: "Delete",
                action: () => deleteQuery({ variables: { id } }),
              },
            ];

            const renderSettings = () => {
              return (
                <List
                  size="small"
                  dataSource={settings}
                  renderItem={(item = {}) => (
                    <List.Item
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        item.action();
                      }}
                    >
                      {item.name}
                    </List.Item>
                  )}
                />
              );
            };

            return (
              <Panel
                header={
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>{name}</div>

                    <Tooltip title={renderSettings()} placement="bottomLeft">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        style={{ color: "rgb(86, 73, 249)" }}
                      >
                        Settings
                      </div>
                    </Tooltip>
                  </div>
                }
                key={`${i + 1}`}
              >
                <UpdateForm
                  key={`f;${id}:${logId}`}
                  {...{ body, endpoint, tags, id }}
                />
              </Panel>
            );
          })}
      </Collapse>
    </>
  );
};

export default Queries;

/* 

/* <div
                    style={{
                      width: "100%",
                      border: "1px sold white !important",
                      color: "#5649F9",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "16px",
                    }}
                  >
                    + Add to Collection
                  </div> */

/* <>
                    <HR />

                    <Row style={{ width: "100%" }} gutter={[12, 12]}>
                      <Col span={12}>
                        <Thumb index={1} />
                      </Col>
                      <Col span={12}>
                        <Thumb index={2} />
                      </Col>
                    </Row>
                    <Row style={{ width: "100%" }} gutter={[12, 12]}>
                      <Col span={12}>
                        <Thumb index={3} />
                      </Col>
                      <Col span={12}>
                        <Thumb index={4} />
                      </Col>
                    </Row>
                </> */
