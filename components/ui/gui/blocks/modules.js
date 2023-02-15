import { useRef, useState } from "react";
import useClickedOutside from "../../../../pages/scene/topbar/outside-hook";
import useStatusStore from "../../../../store/status-store";
import { Plus, Modules as Mods } from "../__styles";
import AddQuery from "./modules/add-query";
import { v4 as uuidv4 } from "uuid";

const Modules = () => {
  const [show, setShow] = useState(false);

  const queryModal = useStatusStore(({ queryModal }) => queryModal);
  const setQueryModal = useStatusStore(({ setQueryModal }) => setQueryModal);

  const ref = useRef();

  useClickedOutside(ref, setShow);

  return (
    <>
      {queryModal && (
        <AddQuery
          key={`m:${queryModal}`}
          open={queryModal}
          onClose={(e) => {
            setQueryModal(null);
          }}
        />
      )}
      {!show && (
        <Plus
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShow(true);
          }}
        >
          +
        </Plus>
      )}{" "}
      {show && (
        <Mods ref={ref}>
          <div>Add new:</div>
          <Mods.Card index={2} disabled>
            Analytics
          </Mods.Card>
          <Mods.Card index={1} onClick={() => setQueryModal(uuidv4())}>
            Form
          </Mods.Card>
        </Mods>
      )}
    </>
  );
};

export default Modules;
