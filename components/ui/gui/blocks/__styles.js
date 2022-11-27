import styled from "styled-components";
import { Button, Tabs as AntTabs } from "antd";

export const Btn = styled(Button)`
  &&& {
    border-radius: 10px;
    box-shadow: none;
    filter: none;
  }
`;

export const Tabs = styled(AntTabs)`
  &&&& {
    width: 100%;

    & .ant-tabs-nav-wrap {
      border-bottom: 4px solid black;
    }

    & .ant-tabs-tab {
    }

    & .ant-tabs-tab-active * {
      color: black !important;
    }

    & .ant-tabs-tab:hover {
      color: black !important;
    }

    & .ant-tabs-ink-bar {
      background: black;
      height: 4px;
    }
  }
`;
