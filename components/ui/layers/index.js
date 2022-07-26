import { React } from "react";
import styled from "styled-components";

import { Checkbox } from "antd";
import { useEffect } from "react";
import { EyeInvisibleOutlined } from "@ant-design/icons";

const Wrapper = styled.div`
  width: 100%;
  max-width: 250px;

  padding: 24px;
  background: white;
  border-radius: 30px;

  font-size: 0.75rem;

  display: flex;
  flex-direction: column;

  z-index: 10;
`;

const ScrollWrapper = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: scroll;
`;

const FixedWrapper = styled.div`
  width: 100%;
  border-top: 2px solid lightgrey;
`;

export const OverlayWrapper = Wrapper;

const LayerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 58px;

  justify-content: space-between;

  &&[data-visible="hidden"] {
    opacity: 0.4;
  }
`;

const Label = styled.div`
  display: flex;
  align-items: center;

  font-size: 12px;
  line-height: 1.2;

  &&::before {
    content: "";
    min-width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: ${({ color }) => (color ? color : "red")};
    margin-right: 12px;
  }
`;

const ActionLayer = styled.div`
  font-size: 14px;
  cursor: pointer;

  transition: opacity 0.3s ease-in-out;
  opacity: 0.5;
`;

const Layer = ({ name, color, visible = false, setVisible = () => {} }) => {
  const { r = 255, g = 0, b = 0 } = color ? color : {};
  /*const hexColor = `rgb(${r}, ${g}, ${b})`;*/
  const hexColor = "lightgrey";

  const handleCheck = (e) => {
    setVisible(!visible);
  };

  return (
    <LayerWrapper data-visible={visible ? "visible" : "hidden"}>
      <Label color={hexColor}>{name}</Label>

      <ActionLayer
        data-visible={visible ? "visible" : "hidden"}
        onClick={handleCheck}
      >
        <EyeInvisibleOutlined />
      </ActionLayer>
      {/*<Checkbox checked={visible} onChange={handleCheck} />*/}
    </LayerWrapper>
  );
};

const Layers = ({ data = [], fixedData = [] }) => {
  return (
    <Wrapper>
      <ScrollWrapper>
        {data.map(({ ...props }, i) => {
          return <Layer {...props} index={i} key={`layer::${i}`} />;
        })}
      </ScrollWrapper>

      <FixedWrapper>
        {fixedData.map(({ ...props }, i) => {
          return <Layer {...props} index={i} key={`layer::${i}`} />;
        })}
      </FixedWrapper>
    </Wrapper>
  );
};

export default Layers;
