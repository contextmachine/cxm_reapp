import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;

  &&&,
  &&& * {
    font-size: 12px;
    line-height: 1.3;
  }

  &&&& .ant-tree-treenode {
    margin-bottom: 8px;
  }

  && .ant-typography {
    max-width: 100%;
  }

  && .MuiTreeItem-label {
    padding-top: 7.5px;
    padding-bottom: 7.5px;
  }

  && .MuiTreeItem-content,
  && .MuiTreeItem-content {
    border-radius: 10px;
  }

  /* MuiTreeItem-group */

  && .MuiTreeItem-iconContainer > svg {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  && .MuiCollapse-vertical.MuiTreeItem-group {
    border-left: 0.1px solid rgba(0, 0, 0, 0.1);
  }

  &&&&& .Mui-selected {
    background-color: rgb(60 60 60);
    &,
    & * {
      color: white;
    }
  }
`;

export const FlexLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  /* && > * + * {
    margin-left: 8px;
  } */

  &&::before {
    content: "";
    background: url("${({ fill }) => (fill ? fill : "")}");
    background-size: cover;
    margin-right: 8px;
    mix-blend-mode: difference;

    min-width: 13px;
    height: 13px;
  }
`;

export const FlexItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  & *[data-type="actions"] {
    opacity: 0;
  }

  &&:hover {
    & *[data-type="actions"] {
      opacity: 1;
    }
  }
`;
