import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useStatusStore from "../../../store/status-store";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import { notification } from "antd";

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

        const foundKey = properties[key] === val;

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

      let objectData = { logId: uuidv4(), ...otherUserData };

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
                  const { properties = {} } = userData;
                  const foundKey = properties ? properties[key] : null;

                  if (foundKey) {
                    if (!values[foundKey]) values[foundKey] = 0;
                    values[foundKey] += 1;
                  }
                }
              });
            }

            let data = [];
            Object.keys(values).map((name) => {
              const count = values[name];

              data.push({ id: name, value: count });
            });

            /* добавить children в аттрибут */
            return { ...item, data };
          }

          return item;
        });

        objectData = { ...objectData, gui };
      }

      setGUIData(objectData);
    }
  }, [userData, scene]);

  useEffect(() => {
    if (keyFetch && scene) {
      const { data, post } = keyFetch;
      const { endpoint, mutation = {}, tags = [] } = post;

      if (endpoint) {
        fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            if (res) {
              /* что делаем */
              let wrappers = [];

              scene.traverse((obj) => {
                const { userData } = obj;
                if (userData) {
                  const { properties } = userData;
                  if (properties) {
                    let includes = false;
                    tags.map((tag) => {
                      if (Object.keys(properties).includes(tag))
                        includes = true;
                    });

                    if (includes) wrappers.push(obj);
                  }
                }
              });

              wrappers.map((wrapper) => {
                if (wrapper) {
                  wrapper.remove(...wrapper.children);

                  const loader = new THREE.ObjectLoader();
                  loader.parse(res, (e) => {
                    wrapper.add(e);
                    setNeedsRender(true);
                  });

                  const box3 = new THREE.Box3();
                  box3.setFromObject(wrapper);

                  setBoundingBox({ ...box3, logId: uuidv4() });
                }
              });

              setNeedsRender(true);
              setKeyFetch(null);

              notification.success({
                message: "Сцена обновлена!",
                placement: "bottomRight",
                duration: 2.5,
              });
            }
          })
          .catch(() => {
            notification.error({
              message: "Возникла ошибка при получении ответа с сервера",
              placement: "bottomRight",
              duration: 2.5,
            });
          });
      }
    }
  }, [keyFetch, scene]);

  return <></>;
};

export default GUIProvider;
