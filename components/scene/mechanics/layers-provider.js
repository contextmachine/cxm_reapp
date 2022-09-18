import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import { v4 as uuidv4 } from "uuid";

const LayersProvider = () => {
  const { scene } = useThree();

  const setLinksStructure = useStatusStore(
    ({ setLinksStructure }) => setLinksStructure
  );
  const setLinksLogId = useStatusStore(({ setLinksLogId }) => setLinksLogId);

  useEffect(() => {
    setLinksStructure(scene);
    setLinksLogId(uuidv4());

    console.log("updated scene", uuidv4());
  }, [scene]);

  return <></>;
};

export default LayersProvider;
