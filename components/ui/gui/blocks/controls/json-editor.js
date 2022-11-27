import { useEffect, useState, useRef } from "react";

import Editor from "@monaco-editor/react";
import { Wrapper } from "./__styles";
import { v4 as uuidv4 } from "uuid";

const JSONEditor = ({ data, onChange = () => {} }) => {
  data = JSON.stringify(data, false, "\t");

  return (
    <>
      <Wrapper>
        <Editor
          defaultLanguage={"json"}
          value={data}
          onChange={(e) => {
            let data = e;
            let parsedData = JSON.parse(data);

            if (parsedData) {
              onChange(parsedData);
            }
          }}
        />
      </Wrapper>
    </>
  );
};

export default JSONEditor;
