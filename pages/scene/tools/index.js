import React, { useRef, useMemo } from "react";
import styled from "styled-components";
import useToolsStore from "../../../store/tools-store";
import useClickedOutside from "../topbar/outside-hook";
import { useRouter } from "next/router";

const Panel = styled.div`
  width: 100%;
  max-width: 500px;
  height: auto;
  background: white;
  /* border-radius: 10px 10px 0 0; */
  border-radius: 10px;
  z-index: 20;
  /*background: #262628;*/
  background: white;
  box-shadow: 0 4px 20px -5px rgb(26 86 245 / 40%);

  &&&&[data-mode="mini"] {
    top: auto;
    bottom: 0px;
    border-radius: 10px 10px 0 0;
  }

  &&,
  && * {
    color: black;
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

  padding: 5px;

  cursor: pointer;
  border-radius: 10px;

  &&:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &&[data-active="active"] {
    background: rgba(0, 0, 0, 0.12);
  }
`;

const Label = styled.div`
  font-size: 11px;
  line-height: 1.63;
  text-align: center;
  letter-spacing: -0.4px;

  color: white;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const Icon = styled.div`
  width: 27px;
  height: 27px;
  background: lightgrey;

  @media (max-width: 480px) {
    & {
      width: 22px;
      height: 22px;
    }
  }

  background: url("/icons/panel-${({ int }) => int}.svg");
  background-size: cover;
`;

const ToolsPanel = ({
  enabled = false,
  setTools = () => {},
  setExportScreen,
}) => {
  const router = useRouter();
  const { query = {} } = router ? router : {};
  const { full } = query;

  const fullsize = useMemo(() => {
    if (full) return true;
  });

  const toolsRef = useRef();

  useClickedOutside(toolsRef, setTools);

  const mouse = useToolsStore(({ mouse }) => mouse);
  const setMouse = useToolsStore(({ setMouse }) => setMouse);

  return (
    <Panel
      data-mode={fullsize ? "full" : "mini"}
      ref={toolsRef}
      data-type={enabled ? "opened" : "closed"}
    >
      <Grid>
        <Item
          data-active={mouse ? "active" : "default"}
          onClick={() => setMouse(!mouse)}
        >
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
