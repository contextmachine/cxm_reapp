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
      trigger={[]}
      open={open}
      placement="bottomLeft"
      content={
        <div ref={ref}>
          <Space direction="vertical" size={0}>
            <Li>
              Выделенный объект<Hotkey>Z</Hotkey>
            </Li>
            <Li>
              Вся сцена<Hotkey>G</Hotkey>
            </Li>
          </Space>
        </div>
      }
    >
      <Tooltip title="Зум" open={open ? false : undefined}>
        <LeftSide.Btn
          onClick={(e) => {
            if (!open) {
              e.stopPropagation();
            }

            setOpen((state) => !state);
          }}
          section="zoom"
        />
      </Tooltip>
    </Popover>
  );
};

export default Zoom;
