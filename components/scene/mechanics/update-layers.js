import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import useStatusStore from "../../../store/status-store";

const UpdateLayers = () => {
  const { scene } = useThree();

  const layerCurrentChange = useStatusStore(
    ({ layerCurrentChange }) => layerCurrentChange
  );
  const setLayerCurrentChange = useStatusStore(
    ({ setLayerCurrentChange }) => setLayerCurrentChange
  );

  useEffect(() => {
    if (layerCurrentChange) {
      const { section, layerName, visible } = layerCurrentChange;

      if (section === "По файлам") {
        const foundObjects = scene.children.filter((item = {}) => {
          const { x_file } = item;

          if (x_file === layerName) return true;
          return false;
        });

        if (foundObjects.length > 0) {
          foundObjects.map((item = {}) => {
            item.visible = visible;
          });
        }

        console.log("foundObject", foundObjects);
      } else {
        const foundObjects = scene.children.filter((item = {}) => {
          const { x_material } = item;

          if (x_material === layerName) return true;
          return false;
        });

        console.log("foundObject", foundObjects);

        if (foundObjects.length > 0) {
          foundObjects.map((item = {}) => {
            item.visible = visible;
          });
        }
      }

      setLayerCurrentChange(null);
    }
  }, [layerCurrentChange, scene]);

  console.log("scene", scene);

  return <></>;
};

export default UpdateLayers;
