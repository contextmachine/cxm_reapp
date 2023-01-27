import { Popover, Space, Tooltip } from "antd";
import { useRef, useState } from "react";
import { LeftSide } from "../../../../../pages/scene/topbar";
import useClickedOutside from "../../../../../pages/scene/topbar/outside-hook";
import { Hotkey, Li } from "../__styles";

const Logs = () => {
  const [open, setOpen] = useState();
  const ref = useRef();

  useClickedOutside(ref, setOpen);

  return (
    <Popover
      className="topbar"
      open={open}
      placement="bottomLeft"
      trigger={["click", "hover"]}
      content={
        <Space ref={ref} direction="vertical" size={0}>
          (Логи здесь....)
        </Space>
      }
    >
      <LeftSide.Btn section="note" />
    </Popover>
  );
};

export default Logs;
