import React, { useRef } from "react";
import styled from "styled-components";
import useClickedOutside from "../topbar/outside-hook";

const Panel = styled.div`
  width: 100%;
  max-width: 500px;
  height: auto;
  background: white;
  /* border-radius: 10px 10px 0 0; */
  border-radius: 10px;
  z-index: 20;
  background: #262628;

  &&&&[data-mode="mini"] {
    top: auto;
    bottom: 0px;
    border-radius: 10px 10px 0 0;
  }

  &&,
  && * {
    color: white;
  }

  position: absolute;
  top: 10px;
  left: 50%;
  transition: 0.3s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.1);

  box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px,
    rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px;

  padding: 10px;

  &[data-type="opened"] {
    transform: translateY(0%) translateX(-50%);
  }

  &[data-type="closed"] {
    transform: translateX(-50%);
  }
`;

const Grid = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  /*grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;*/
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  cursor: pointer;
`;

const Label = styled.div`
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  letter-spacing: -0.4px;

  color: white;
`;

const Icon = styled.div`
  width: 30px;
  height: 30px;
  background: lightgrey;

  background: url("/icons/panel-${({ int }) => int}.svg");
  background-size: cover;
`;

const ToolsPanel = ({
  enabled = false,
  setTools = () => {},
  setExportScreen,
  fullsize,
}) => {
  const toolsRef = useRef();

  useClickedOutside(toolsRef, setTools);

  return (
    <Panel
      data-mode={fullsize ? "full" : "mini"}
      ref={toolsRef}
      data-type={enabled ? "opened" : "closed"}
    >
      <Grid>
        <Item>
          <Icon int={1}></Icon>
          <Label>Точки</Label>
        </Item>

        <Item>
          <Icon int={2}></Icon>
          <Label>Измерения</Label>
        </Item>

        <Item>
          <Icon int={3}></Icon>
          <Label>Комменты</Label>
        </Item>

        <Item
          onClick={(e) => {
            e.stopPropagation();
            return setExportScreen(true);
          }}
        >
          <Icon int={4}></Icon>
          <Label>Экспорт</Label>
        </Item>
      </Grid>
    </Panel>
  );
};

export default ToolsPanel;
