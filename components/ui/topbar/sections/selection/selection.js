import { Popover, Space, Tooltip } from "antd";
import { useRef, useState } from "react";
import { LeftSide } from "../../../../../pages/scene/topbar";
import useClickedOutside from "../../../../../pages/scene/topbar/outside-hook";
import useModeStore from "../../../../../store/mode-store";
import { Hotkey, Li } from "../__styles";

const Selection = () => {
  const [open, setOpen] = useState();
  const ref = useRef();

  useClickedOutside(ref, setOpen);

  const setSelection = useModeStore(({ setSelection }) => setSelection);

  return (
    <Popover
      className="topbar"
      trigger={[]}
      open={open}
      placement="bottomLeft"
      content={
        <div ref={ref}>
          <Space ref={ref} direction="vertical" size={0}>
            <Li onClick={() => setSelection("bbox")}>
              BBox объекта<Hotkey>Alt</Hotkey>
            </Li>
            <Li onClick={() => setSelection("object")}>
              Контур объекта<Hotkey>Alt</Hotkey>
            </Li>
          </Space>
        </div>
      }
    >
      <Tooltip title="Тип выделения объекта" open={open ? false : undefined}>
        <LeftSide.Btn
          onClick={(e) => {
            if (!open) {
              e.stopPropagation();
            }

            setOpen((state) => !state);
          }}
          section="bbox"
        />
      </Tooltip>
    </Popover>
  );
};

export default Selection;
