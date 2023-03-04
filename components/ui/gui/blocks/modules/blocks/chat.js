import { Button, Form, Input, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import { ChatForm } from "../__styles";

import { LoadingOutlined } from "@ant-design/icons";
import useStatusStore from "../../../../../../store/status-store";

const dJSON = require("dirty-json");

const Chat = ({ handleInputChange = () => {}, object_id }) => {
  const [form] = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const linksStructure = useStatusStore(({ linksStructure }) => linksStructure);

  const tags = useMemo(() => {
    if (!object_id) return {};

    let object = null;
    linksStructure.traverse(function (child) {
      if (child.uuid === object_id) {
        object = child;
      }
    });

    let tags = {};

    if (!object) return {};
    object.traverseVisible((obj = {}) => {
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
  }, [object_id, linksStructure]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const initValues = useMemo(() => {
    let tag = "ceil_fragment";
    if (tags) {
      let largestCount = 0;
      let largestCountKey = "";

      for (let key in tags) {
        if (tags[key].count > largestCount) {
          largestCount = tags[key].count;
          largestCountKey = key;
        }
      }

      tag = largestCountKey;
    }

    return {
      prompt: `Найти объекты которые имеют тег "${tag}" и используя круговую диаграмму и лайнчарт создать инфографику`,
    };
  }, [tags]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      let fullQuery = `here is technical task "${values.prompt}". 
    
    You need to make JSON that has next structure:  { "key": String, "name": String, "type": Array, "filter": Array, "operation": String or Number}. 
    
    From the task try :
    — to find "key" that means what's name of attribute by which we search objects. 
    — Then, try to find make "name" using value of "key" + "-chart". 
    — in "filter" you describe how to filter obects using "query syntax" for JSON (with "eq", "gt" and etc). In this case it should like {"gt": 13}
    — And in "type" you define list of diagram that task requires. If it describes round diagram you push "piechart" value in array. If task describes linechart you push "linechart" value in array.
    — In "operation" you need to find extra task from user, for example, perfoming addition or multiplication or something like this. If you don't see any extra task you leave ""
    
    In your answer you need to return only JSON that is ready to be JSON parsed. All key values should be quoted. As i get this response using api please give me only code fragment without any extra information`;

      const { data } = await axios.post("/api/chat/chat", {
        prompt: fullQuery,
      });

      try {
        const regex = /\{.*\}/s;
        const result = data.text.match(regex);

        try {
          handleInputChange(JSON.parse(data.text));
          setErrorMessage();
        } catch (error) {
          try {
            handleInputChange(JSON.parse(result[0]));
            setErrorMessage();
          } catch (error) {
            try {
              handleInputChange(dJSON.parse(result[0]));
              setErrorMessage();
            } catch (error) {
              try {
                handleInputChange(dJSON.parse(data.text));
                setErrorMessage();
              } catch (error) {
                handleInputChange(data.text);
                setErrorMessage(
                  "You got wrong response from chatGPT. Please resubmit you task!"
                );
              }
            }
          }
        }
      } catch (error) {
        setErrorMessage(
          "You got wrong response from chatGPT. Please resubmit you task!"
        );
      }
    } catch (error) {
      setErrorMessage("There is an error while sending response to chatGPT");
    }

    setLoading(false);
  };

  return (
    <>
      <ChatForm
        disabled={loading}
        form={form}
        onFinish={onFinish}
        initialValues={initValues}
      >
        <Form.Item>
          <a
            onClick={() => {
              form.setFieldsValue({ prompt: initValues.prompt });
            }}
          >
            Make default query example
          </a>
        </Form.Item>

        <Form.Item name="prompt">
          <Input.TextArea rows={4} />
        </Form.Item>

        {tags && Object.keys(tags).length > 0 && (
          <Form.Item>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px" }}>
                accessible tags for analytics:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {Object.keys(tags).map((item, i) => (
                  <div
                    key={`dd:${i}`}
                    style={{
                      padding: "1px 3px",
                      marginLeft: "2px",
                      background: "lightgrey",
                      fontSize: "12px",
                      borderRadius: "5px",
                      opacity: 0.8,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Form.Item>
        )}

        <Form.Item>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              style={{ height: "25px", display: "flex", alignItems: "center" }}
              onClick={(e) => {
                form.submit();
              }}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>

            {loading && (
              <div style={{ marginLeft: "24px" }}>
                <LoadingOutlined style={{ fontSize: 24 }} spin />
              </div>
            )}
          </div>
        </Form.Item>

        {errorMessage && (
          <Form.Item>
            <span style={{ color: "red" }}>{errorMessage}</span>
          </Form.Item>
        )}
      </ChatForm>
    </>
  );
};

export default Chat;
