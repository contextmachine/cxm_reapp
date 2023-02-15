import { useMutation, useQuery } from "@apollo/client";
import { Input, Modal } from "antd";
import { createGlobalStyle } from "styled-components";
import LayerTreemap from "../../../../../pages/scene/topbar/blocks/layer-treemap";
import Editor from "./blocks/editor";
import Endpoint from "./blocks/endpoint";
import { ADD_QUERY, EDIT_QUERY, QUERIES, QUERY } from "./blocks/gql";
import { Btn, Flex, Form } from "./__styles";

import { v4 as uuidv4 } from "uuid";

import client from "../../../../apollo/apollo-client";
import { useMemo } from "react";
import { useRouter } from "next/router";
import Tags from "./blocks/tags";

const GlobalStyles = createGlobalStyle`
    &&& {
        & .query-modal .ant-modal {
            width: 1200px !important;
            max-width: calc(100vw - 40px) !important;
            border-radius: 10px;

            & .ant-modal-body {
              padding: 0px;
            }
        }
    }
`;

const AddQuery = ({ onClose, open: queryId }) => {
  const router = useRouter();
  const { query } = router;
  const { pid } = query;

  const { data, loading } = useQuery(QUERY, {
    client,
    variables: { id: queryId },
  });

  const cfgs = {
    client,
    onCompleted: onClose,
    onError: onClose,
    refetchQueries: [{ query: QUERIES }, "getQueries"],
  };

  const [addQuery] = useMutation(ADD_QUERY, cfgs);
  const [editQuery] = useMutation(EDIT_QUERY, cfgs);

  const isNew = useMemo(() => {
    if (loading) return;
    if (data) {
      const { projects_queries_hub_by_pk: a } = data;
      if (a) return false;
    }
    return true;
  }, [data, loading, queryId]);

  const initValues = useMemo(() => {
    if (loading) return;

    if (data) {
      const { projects_queries_hub_by_pk: a } = data;

      console.log("a", a);

      if (a) return { ...a };
    }

    return { body: { param1: true, param2: [], param3: 1.45 }, tags: [] };
  }, [data, loading, queryId]);

  const handleFinish = (e) => {
    const object = { ...e, project_name: pid };
    if (isNew) return addQuery({ variables: { object } });
    return editQuery({ variables: { id: queryId, object } });
  };

  if (!initValues) return <></>;

  return (
    <>
      <GlobalStyles />

      <Modal
        title={""}
        open={true}
        onOk={onClose}
        onCancel={onClose}
        footer={null}
        style={{ width: "800px" }}
        wrapClassName="query-modal"
      >
        <Form
          layout="vertical"
          initialValues={initValues}
          onFinish={handleFinish}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Form.Item
            name={"name"}
            rules={[
              {
                required: true,
                message: "Please input name of this Query!",
              },
            ]}
          >
            <Input
              style={{ maxWidth: "calc(50% - 24px)" }}
              placeholder="Name of request"
            />
          </Form.Item>

          <Flex>
            <Form.Item label="Query:">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please give the URL as an endpoint",
                  },
                ]}
                className="no-style"
                name={"endpoint"}
              >
                <Endpoint />
              </Form.Item>

              <Form.Item className="no-style edit-wrapper" name={"body"}>
                <Editor />
              </Form.Item>
            </Form.Item>
            <Form.Item name={"tags"} label="Results in:">
              <Tags />
            </Form.Item>
          </Flex>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn
              onClick={(e) => {
                e.stopPropagation();
              }}
              type="primary"
              htmlType="submit"
            >
              Save form
            </Btn>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddQuery;
