import { useMutation, useQuery } from "@apollo/client";
import { Button, Input, Modal } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useMemo } from "react";
import useStatusStore from "../../../../../store/status-store";
import Chat from "./blocks/chat";
import Editor from "./blocks/editor";
import GenerateChart from "./blocks/generate-chart";
import {
  ADD_INFOGRAPHICS,
  EDIT_INFOGRAPHICS,
  INFOGRAPHICS,
  INFOGRAPHICS_PK,
} from "./blocks/gql";
import { Btn, Form, Flex, GlobalStyles } from "./__styles";
import client from "../../../../apollo/apollo-client";

const { useForm } = Form;

const AddInfographics = ({ onClose, open }) => {
  const router = useRouter();
  const { query } = router;
  const { pid } = query;

  const { object_id, id: queryId } = open;

  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);

  const { data, loading, error } = useQuery(INFOGRAPHICS_PK, {
    client,
    variables: { id: queryId },
  });

  if (error) console.log("error", error);
  console.log("data", data);

  const cfgs = {
    client,
    onCompleted: onClose,
    onError: onClose,
    refetchQueries: [{ query: INFOGRAPHICS }, "getInfographics"],
  };

  const [addInfographics] = useMutation(ADD_INFOGRAPHICS, cfgs);
  const [editInfographics] = useMutation(EDIT_INFOGRAPHICS, cfgs);

  const isNew = useMemo(() => {
    if (loading) return;
    if (data) {
      const { projects_infographics_hub_by_pk: a } = data;
      if (a) return false;
    }
    return true;
  }, [data, loading, queryId]);

  const initValues = useMemo(() => {
    if (loading) return;

    if (data) {
      const { projects_infographics_hub_by_pk: a } = data;

      if (a) return { ...a };
    }

    return {};
  }, [data, loading, queryId]);

  console.log("data", initValues);

  const handleFinish = (e) => {
    const { body, name } = e;

    /* */
    let object_ = null;
    linksStructure.traverse(function (child) {
      if (child.uuid === object_id) {
        object_ = child;
      }
    });
    /* */

    if (!(typeof object_.id === "number")) return;
    const object = { body, name, project_name: pid, object_id: object_.id };
    if (isNew) return addInfographics({ variables: { object } });
    return editInfographics({ variables: { id: queryId, object } });
  };

  const [form] = useForm();

  const handleInputChange = (result) => {
    const nn = {
      id: "size-linechart",
      name: "график по размерам",
      type: "chart",
      require: result.type,
      key: result.key,
      colors: "default",
      data: result.data,
    };

    form.setFieldsValue({ body: result });
    form.setFieldsValue({ chart: nn });
  };

  const onChartChange = (e) => {
    console.log("e", e);
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
          form={form}
          onValuesChange={onChartChange}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onFinish={handleFinish}
          initialValues={initValues}
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
              <Chat {...{ handleInputChange }} object_id={object_id} />

              <Form.Item
                className="no-style edit-wrapper"
                name={"body"}
                rules={[
                  {
                    required: true,
                    message: "Please fill the JSON!",
                  },
                ]}
              >
                <Editor />
              </Form.Item>

              <Form.Item style={{ padding: 0 }}>
                <Button
                  type={"primary"}
                  style={{
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                    marginTop: "-36px",
                  }}
                  onClick={() => {
                    handleInputChange(form.getFieldsValue().body);
                  }}
                >
                  See changes on right side
                </Button>
              </Form.Item>
            </Form.Item>

            <Form.Item name={"chart"} label="Results in:">
              <GenerateChart object_id={object_id} />
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

export default AddInfographics;
