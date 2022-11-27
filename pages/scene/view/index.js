import React, { useMemo } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  bottom: 26px;
  height: 26px;
  z-index: 10;

  &&&[data-mode="mini"] {
    bottom: 90px;

    @media (max-width: 480px) {
      & {
        bottom: 80px;
      }
    }
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
  border-radius: 3px;
  background: #a3a3a3;
  padding: 2px;

  cursor: pointer;
`;

const Btn = styled.div`
  width: max-content;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.4px;

  @media (max-width: 480px) {
    & {
      font-size: 9px;
    }
  }

  color: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  padding-left: 10px;
  padding-right: 10px;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ type }) =>
    type === "active"
      ? `
    background: white;
    color: black;
`
      : ``}
`;

const View = ({ viewType, setViewType }) => {
  const router = useRouter();
  const { query = {} } = router ? router : {};
  const { full } = query;

  const fullsize = useMemo(() => {
    if (full) return true;
  }, [full]);

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
