import JSONEditor from "../../controls/json-editor";
import { EditWrapper } from "../__styles";

const Editor = ({ value, onChange = () => {} }) => {
  return (
    <EditWrapper>
      <JSONEditor data={value} onChange={onChange} type={1} />
    </EditWrapper>
  );
};

export default Editor;
