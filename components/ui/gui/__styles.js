import styled from "styled-components";
import { Button } from "antd";

export const Wrapper = styled.div`
  position: fixed;

  width: 310px;
  //height: calc(100vh - 100px + 50px);
  height: max-content;
  max-height: 800px;
  right: 10px;
  top: 20px;
  z-index: 200;
  background: white;
  border-radius: 3px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &&::-webkit-scrollbar {
    display: none;
  }

  overflow: scroll;

  padding: 10px;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;

  justify-content: space-between;

  && > *:first-child {
    width: 100%;
    max-width: 100%;
  }

  && > *:last-child {
    width: max-content;
  }

  && > * + * {
    margin-left: 16px;
  }
`;

export const Title = styled.div`
  font-size: 24px;
  white-space: initial;
  word-break: break-word;

  line-height: 1.2;
  display: block;
`;

export const HR = styled.div`
  width: 100%;
  height: 2px;
  border-bottom: 1px solid lightgrey;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const Overflow = styled.div`
  width: 100%:
  height: 100%:
  overflow: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &&::-webkit-scrollbar {
    display: none;
  }
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Tag = styled.div`
  padding: 2px;
  background: rgba(0, 0, 0, 0);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &&:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  opacity: 0.4;

  &&[data-active="active"] {
    opacity: 1;
    //background: rgba(0, 0, 0, 0.1);
  }
`;
