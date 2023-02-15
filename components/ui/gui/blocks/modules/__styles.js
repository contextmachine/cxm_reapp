import styled from "styled-components";
import { Button, Form as AntForm } from "antd";

export const Form = styled(AntForm)`
  &&& > * + * {
    border-top: 1px solid #e3e8ee;
  }

  &&&&&& .ant-form-item input,
  .ant-select-selector {
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
