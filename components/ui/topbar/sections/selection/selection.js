import { Popover, Space, Tooltip } from "antd";
import { useRef, useState } from "react";
import { LeftSide } from "../../../../../pages/scene/topbar";
import useClickedOutside from "../../../../../pages/scene/topbar/outside-hook";
import { Hotkey, Li } from "../__styles";

const Selection = () => {
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
            BBox объекта<Hotkey>B</Hotkey>
          </Li>
          <Li>
            Контур объекта<Hotkey>E</Hotkey>
          </Li>
        </Space>
      }
    >
      <LeftSide.Btn section="bbox" />
    </Popover>
  );
};

export default Selection;
