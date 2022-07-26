import React, { useRef } from "react";
import styled from "styled-components";
import useClickedOutside from "../topbar/outside-hook";

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.4);

  z-index: 40;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);

  && > * + * {
    margin-top: 9px;
  }

  width: 100%;
  padding: 10px;

  position: absolute;
  bottom: 32px;
`;

const Paper = styled.div`
  background: white;
  border-radius: 14px;

  width: 100%;
  min-height: 57px;

  && > * + * {
    border-top: 0.33px solid rgba(60, 60, 67, 0.29);
  }
`;

const Btn = styled.div`
  width: 100%;
  height: 57px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #037ee5;
  text-align: center;
  letter-spacing: -0.035em;
  font-size: 20px;
  line-height: 24px;
`;

const Export = ({
  enabled = false,
  setExportScreen = () => {},
  setNeedsData = () => {},
}) => {
  const ref = useRef();

  useClickedOutside(ref, setExportScreen);

  if (!enabled) return <></>;

  return (
    <Wrapper>
      <Panel>
        <Paper ref={ref}>
          <Btn>Экспорт в DWG</Btn>
          <Btn
            onClick={() => {
              setNeedsData(true);
            }}
          >
            Экспорт в 3DM
          </Btn>
        </Paper>
        <Paper>
          <Btn>Отмена</Btn>
        </Paper>
      </Panel>
    </Wrapper>
  );
};

export default Export;
