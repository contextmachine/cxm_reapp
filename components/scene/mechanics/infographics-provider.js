import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import { v4 as uuidv4 } from "uuid";

const InfographicsProvider = () => {
  const { scene } = useThree();

  const userData = useStatusStore(({ userData }) => userData);
  const setInfographicsData = useStatusStore(
    ({ setInfographicsData }) => setInfographicsData
  );

  const keyFilter = useStatusStore(({ keyFilter }) => keyFilter);
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  useEffect(() => {
    if (keyFilter) {
      const { key, value: val } = keyFilter;

      scene.traverse((obj = {}) => {
        const { userData = {} } = obj ? obj : {};
        const { properties = [] } = userData ? userData : {};

        const foundKey = properties.find(
          ({ id, value }) => id === key && value === val
        );

        if (
          !foundKey &&
          obj.name !== "bounding-box" &&
          obj.name !== "hover-box"
        ) {
          if (obj.material) {
            obj.visible = false;

            obj.material.opacity = 0.3;
            obj.material.transparent = true;

            console.log("obj name", obj.name);
            console.log("obj.material.opacity", obj.material.opacity);
          }
        } else {
          obj.visible = true;
        }
      });

      console.log("scene enter", scene);
    } else {
      scene.traverse((obj = {}) => {
        if (obj.material) {
          obj.visible = true;

          obj.material.opacity = 1;
          obj.material.transparent = true;
        }
      });
    }

    setNeedsRender(true);
  }, [keyFilter, scene]);

  useEffect(() => {
    if (userData) {
      let { name, id } = userData;
      let { infographics, logId, ...otherUserData } = userData;

      if (infographics) {
        /* Найти родительский объект-группу по id */
        const object = scene.getObjectById(id);

        infographics = infographics.map((item = {}) => {
          const { key } = item;

          let values = {};

          /* Поиск, используя аттрибут "key" */
          object.traverseVisible((obj = {}) => {
            const { userData } = obj;
            if (userData) {
              const { properties = [] } = userData;
              const foundKey = properties.find(({ id }) => id === key);

              if (foundKey) {
                const { value } = foundKey;

                if (!values[value]) values[value] = 0;
                values[value] += 1;
              }
            }
          });

          let data = [];
          Object.keys(values).map((name) => {
            const count = values[name];

            data.push({ id: name, value: count });
          });

          /* добавить children в аттрибут */
          return { ...item, data };
        });

        setInfographicsData({
          logId: uuidv4(),
          infographics,
          ...otherUserData,
        });
      } else {
        setInfographicsData(null);
      }
    }
  }, [userData, scene]);

  return <></>;
};

export default InfographicsProvider;
