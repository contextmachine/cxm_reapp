import React from "react";
import styled from "styled-components";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useStatusStore from "../../../store/status-store";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 36,
    }}
    spin
  />
);

const Wrapper = styled.div`
  max-width: 150px;
  max-height: 150px;
  min-width: 150px;
  min-height: 150px;
  padding: 10px;
  background: white;
  border-radius: 24px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 30;

  && > * + * {
    margin-top: 24px;
  }
`;

const Status = styled.div`
  font-size: 11px;
  text-align: center;
`;

const LoadingBar = () => {
  const loadingMessage = useStatusStore(({ loadingMessage }) => loadingMessage);

  if (!loadingMessage) return <></>;

  return (
    <Wrapper>
      <Spin indicator={antIcon} />
      <Status>{loadingMessage}</Status>
    </Wrapper>
  );
};

export default LoadingBar;
