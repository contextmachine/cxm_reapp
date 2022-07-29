import React from "react";
import styled from "styled-components";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useStatusStore from "../../../store/status-store";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 36,
      color: "white",
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
  background: #0080ff;
  border-radius: 24px;
  pointer-events: none;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 30;
  transition: opacity 1s ease-in-out;

  && > * + * {
    margin-top: 24px;
  }

  &&[data-type="mini"] {
    & {
      left: calc(100% - 10px);
      right: 15px;
      transform: translate(-100%, 0);
      flex-direction: row;
      bottom: 80px;
      height: 26px;
      min-height: 26px;
      max-height: 26px;
      top: auto;
      min-width: max-content;
      max-width: max-content;

      & > * + * {
        margin-top: 0;
        margin-left: 8px;
      }

      & .ant-spin span {
        font-size: 14px !important;
      }
    }
  }

  ${({ visible }) =>
    visible
      ? `
    opacity: 1
  `
      : `
    opacity: 0
  `}
`;

const Status = styled.div`
  font-size: 11px;
  text-align: center;
  color: white;

  @media (max-width: 480px) {
    & {
      font-size: 9px;
    }
  }
`;

const LoadingBar = () => {
  const loadingMessage = useStatusStore(({ loadingMessage }) => loadingMessage);

  const { message = "", type = "full" } = loadingMessage ? loadingMessage : {};

  if (!loadingMessage) return <></>;

  return (
    <>
      <Wrapper visible={type === "full"}>
        <Spin indicator={antIcon} />
        <Status>{message}</Status>
      </Wrapper>

      <Wrapper data-type="mini" visible={type === "mini"}>
        <Spin indicator={antIcon} />
        <Status>{message}</Status>
      </Wrapper>
    </>
  );
};

export default LoadingBar;
