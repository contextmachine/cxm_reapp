import { Form, Button } from "antd";
import useStatusStore from "../../../../../store/status-store";
import Editor from "../modules/blocks/editor";
import { v4 as uuidv4 } from "uuid";

const UpdateForm = ({ body, id, endpoint, tags = [] }) => {
  const setKeyFetch = useStatusStore(({ setKeyFetch }) => setKeyFetch);

  const handleUpdate = (e) => {
    const { body } = e;

    setKeyFetch({
      data: body,
      post: {
        endpoint,
        tags,
      },
      logId: uuidv4(),
    });
    notification.info({
      message: "Ожидаем ответ от сервера...",
      placement: "bottomRight",
      duration: 1,
    });
  };

  const handleFinish = (e) => {
    console.log("e", e);
  };

  return (
    <>
      <Form initialValues={{ body }} onFinish={handleUpdate}>
        <Form.Item name="body">
          <Editor />
        </Form.Item>

        <Form.Item>
          <div style={{ width: "100%" }}>
            <Button
              htmlType="submit"
              style={{
                width: "100%",
                marginTop: "8px",
                boxShadow: "none",
                background: "#5649F9",
                color: "white",
                borderRadius: "10px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              type="primary"
            >
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdateForm;
