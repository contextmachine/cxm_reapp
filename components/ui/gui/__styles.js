import styled from "styled-components";
import { Button } from "antd";
import { Typography } from "antd";

const { Text } = Typography;

export const Wrapper = styled.div`
  position: fixed;

  width: 310px;
  //height: calc(100vh - 100px + 50px);
  height: max-content;
  max-height: calc(100vh - 100px + 50px);
  right: 10px;
  top: 20px;
  z-index: 200;
  background: white;
  border-radius: 3px;

  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
`;

Wrapper.Body = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
`;

export const Line = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &&::-webkit-scrollbar {
    display: none;
  }

  overflow: scroll;
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

export const Title = styled(Text)`
  font-size: 24px;
  white-space: initial;
  word-break: break-word;

  line-height: 1.2;
  display: block;

  cursor: pointer;
  font-size: 20px;
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

export const Plus = styled.div`
  position: absolute;
  width: 32px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px 0 0 10px;

  left: -32px;
  top: 56px;
  border-right: 1px solid #e5e5e5;

  font-size: 20px;
  color: #5649f9;
  cursor: pointer;
`;

export const Modules = styled.div`
  position: absolute;
  width: max-content;
  height: max-content;

  display: flex;
  flex-direction: column;

  && > * + * {
    margin-top: 10px;
  }

  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px 0 0 10px;

  left: 0;
  top: 50px;
  transform: translate(-100%, 0);

  padding: 10px;

  border-right: 1px solid #e5e5e5;
`;

Modules.Card = styled.div`
  width: 64px;
  height: 67px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e3e8ee;

  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ disabled }) =>
    disabled
      ? `
    && {
      opacity: .5;
      cursor: not-allowed
    }
  `
      : `
  &:hover {
    border: 1px solid #5649f9;
  }
  
  `}

  &&::before {
    content: "";
    width: 28px;
    height: 30px;
    background: url("/icons/gui/${({ index }) => (index ? index : "1")}.svg");
  }

  &&,
  && * {
    font-size: 10px;
    text-align: center;
  }
`;
