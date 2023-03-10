import styled, { createGlobalStyle } from "styled-components";
import { Button, Form as AntForm } from "antd";

export const GlobalStyles = createGlobalStyle`
    &&& {
        & .query-modal .ant-modal {
            width: 1200px !important;
            max-width: calc(100vw - 40px) !important;
            border-radius: 10px;

            & .ant-modal-body {
              padding: 0px;
            }
        }
    }
`;

export const Form = styled(AntForm)`
  &&& > * + * {
    border-top: 1px solid #e3e8ee;
  }

  &&&&&& .ant-form-item input,
  .ant-select-selector,
  .ant-input {
    border: 1px solid #c4c4c4 !important;
    border-radius: 10px !important;
  }

  &&& .ant-form-item:not(.no-style) {
    margin-bottom: 0;
    padding: 16px 24px;
  }

  && .ant-form-item-label {
    font-size: 16px;
    font-weight: 500;
  }
`;

export const ChatForm = styled(AntForm)`
  &&&&&&&&&&& {
    & .ant-form-item {
      padding: 0px;
    }

    & .ant-btn {
      border-radius: 10px;
      height: 30px
    }

    margin-bottom: 24px;
  }
`;

export const Flex = styled.div`
  width: 100%;

  display: flex;

  & > * {
    width: 100%;
  }

  & > * + * {
    border-left: 1px solid #e3e8ee;
  }
`;

export const Label = styled.div`
  font-size: 16px;
  font-weight: 400;
`;

export const EditWrapper = styled.div`
  width: 100%;
  min-height: 250px;

  & > * {
    height: 250px;
  }
`;

export const Btn = styled(Button)`
  &&&&&&&& {
    background: #5649f9;
    border-radius: 8px;
    height: 40px;

    padding: 0px 36px;

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    border: 0px;
  }
`;
