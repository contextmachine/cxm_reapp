import { Popover, Space, Tooltip } from "antd";
import { useRef, useState } from "react";
import { LeftSide } from "../../../../../pages/scene/topbar";
import useClickedOutside from "../../../../../pages/scene/topbar/outside-hook";
import { Hotkey, Li } from "../__styles";

const Zoom = () => {
  const [open, setOpen] = useState();
  const ref = useRef();

  useClickedOutside(ref, setOpen);

  return (
    <Popover
      className="topbar"
      open={open}
      placement="bottomLeft"
      content={
        <Space ref={ref} direction="vertical" size={0}>
          <Li>
            Выделенный объект<Hotkey>Z</Hotkey>
          </Li>
          <Li>
            Вся сцена<Hotkey>G</Hotkey>
          </Li>
        </Space>
      }
    >
      <LeftSide.Btn section="zoom" />
    </Popover>
  );
};

export default Zoom;
