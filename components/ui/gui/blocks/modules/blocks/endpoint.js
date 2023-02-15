import { Input, Row, Select } from "antd";
const { Option } = Select;

const Endpoint = ({ value, onChange = () => {} }) => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Select defaultValue={"post"} style={{ width: "80px" }}>
          <Option value="post">POST</Option>
        </Select>

        <Input
          style={{ marginLeft: "8px" }}
          placeholder="Endpoint, e.g.: http://14.874.140.137:8080/api/metall_planes"
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Endpoint;
