import { HotKeys as HotkeysWrapper, configure } from "react-hotkeys";
import useModeStore from "../../../store/mode-store";
import { v4 as uuidv4 } from "uuid";

const keyMap = {
  SELECTION: ["alt"],
};

const Hotkeys = ({ children }) => {
  const setAutoSelection = useModeStore(
    ({ setAutoSelection }) => setAutoSelection
  );

  const handlers = {
    SELECTION: () => {
      setAutoSelection();
    },
  };

  return (
    <HotkeysWrapper keyMap={keyMap} handlers={handlers}>
      {children}
    </HotkeysWrapper>
  );
};

export default Hotkeys;
