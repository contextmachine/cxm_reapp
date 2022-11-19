import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";

const GUIProvider = () => {
  const { scene } = useThree();

  const userData = useStatusStore(({ userData }) => userData);
  const setGUIData = useStatusStore(({ setGUIData }) => setGUIData);

  const keyFilter = useStatusStore(({ keyFilter }) => keyFilter);
  const keyFetch = useStatusStore(({ keyFetch }) => keyFetch);
  const setKeyFetch = useStatusStore(({ setKeyFetch }) => setKeyFetch);

  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);

  /* Отфильтровать отображение объектов на сцене с помощью keyFilter */
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
          }
        } else {
          obj.visible = true;
        }
      });
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
      let { gui, logId, ...otherUserData } = userData;

      if (gui) {
        /* Найти родительский объект-группу по id */
        const object = scene.getObjectById(id);

        gui = gui.map((item = {}) => {
          const { type } = item;

          if (!(type === "controls")) {
            const { key } = item;

            let values = {};

            if (object) {
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
            }

            let data = [];
            Object.keys(values).map((name) => {
              const count = values[name];

              data.push({ id: name, value: count });
            });

            console.log("gui", gui);

            /* добавить children в аттрибут */
            return { ...item, data };
          }

          return item;
        });

        setGUIData({
          logId: uuidv4(),
          gui,
          ...otherUserData,
        });
      } else {
        setGUIData(null);
      }
    }
  }, [userData, scene]);

  useEffect(() => {
    if (keyFetch && scene) {
      const { fetch: fetchOptions = {} } = keyFetch;
      const { endpoint, response = [], body } = fetchOptions;

      const [method, filter = []] = response;
      const [filterType, filterValue] = filter;

      if (endpoint) {
        console.log("fetch", fetch);

        fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(body),
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            if (res) {
              /* что делаем */

              let foundWrapper;

              scene.traverse((obj) => {
                const { userData = {} } = obj;
                const { properties = [] } = userData;

                const property = properties.find(
                  ({ id }) => id === "metal_planes"
                );
                if (property) {
                  const { value } = property;

                  if (value === "original") foundWrapper = obj;
                }
              });

              if (foundWrapper) {
                foundWrapper.remove(...foundWrapper.children);

                const loader = new THREE.ObjectLoader();
                loader.parse(res, (e) => {
                  console.log("e", e);

                  foundWrapper.add(e);
                  setNeedsRender(true);
                });

                const box3 = new THREE.Box3();
                box3.setFromObject(foundWrapper);

                setBoundingBox({ ...box3, logId: uuidv4() });
              }
              /* */

              setNeedsRender(true);
              setKeyFetch(null);
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
    }
  }, [keyFetch, scene]);

  return <></>;
};

export default GUIProvider;
