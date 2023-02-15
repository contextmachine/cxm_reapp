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

export const Tag = styled.div`
  padding: 2px 20px;
  cursor: pointer;
  border-radius: 6px;
  color: black;
  display: flex;
  align-items: center;

  border: 1px solid rgba(0, 0, 0, 0.7);
  position: relative;

  ${({ active }) =>
    active
      ? `
  &&& {
    border: 3px solid black
  }
 
 `
      : ``}

  &&::before {
    content: "";
    border-radius: 6px;
    width: 100%;
    height: 100%;
    position: absolute;
    filter: brightness(1);
    background: ${({ color }) => (color ? color : "grey")};
    left: 0px;
    top: 0px;
    opacity: 0.3;
  }

  &,
  & * {
    font-weight: 400;
    font-size: 12px !important;
  }
`;
