import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  bottom: 26px;
  height: 26px;
  z-index: 10;

  &&&[data-mode="mini"] {
    bottom: 90px;
  }

  width: 100%;
  display: flex;
  justify-content: center;

  pointer-events: none;

  && > * {
    pointer-events: visible;
  }
`;

const Panel = styled.div`
  width: max-content;
  display: flex;
  height: 100%;
  border-radius: 100px;
  background: #4b4c4e;
  padding: 2px;

  cursor: pointer;
`;

const Btn = styled.div`
  width: max-content;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.4px;

  color: #929394;
  border-radius: 100px;
  padding-left: 10px;
  padding-right: 10px;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ type }) =>
    type === "active"
      ? `
    background: #717274;
    color: #D9D9DA;
`
      : ``}
`;

const View = ({ fullsize, viewType, setViewType }) => {
  return (
    <Wrapper data-mode={fullsize ? "full" : "mini"}>
      <Panel>
        <Btn
          type={viewType === "perspective" ? "active" : null}
          onClick={() => setViewType("perspective")}
        >
          Перспектива
        </Btn>
        <Btn
          type={viewType === "ortho" ? "active" : null}
          onClick={() => setViewType("ortho")}
        >
          Орто
        </Btn>
        <Btn
          type={viewType === "top" ? "active" : null}
          onClick={() => setViewType("top")}
        >
          План
        </Btn>
      </Panel>
    </Wrapper>
  );
};

export default View;
