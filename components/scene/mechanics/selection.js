import { Sphere } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import useStatusStore from "../../../store/status-store";

import { v4 as uuidv4 } from "uuid";
import useModeStore from "../../../store/mode-store";

const Selection = ({ viewType }) => {
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const userData = useStatusStore(({ userData }) => userData);
  const setUserData = useStatusStore(({ setUserData }) => setUserData);

  const setGUIData = useStatusStore(({ setGUIData }) => setGUIData);
  const setCameraData = useStatusStore(({ setCameraData }) => setCameraData);
  const setControlsData = useStatusStore(
    ({ setControlsData }) => setControlsData
  );

  const selection = useModeStore(({ selection }) => selection);

  /* Уровень погружения в подгруппы */
  /* 0 — вся сцена 
     1 — Группа
     2 — Подгруппа
     3 — Подгруппа подгруппы и тд
     ....
  */
  const [deepObjectId, setDeepObjectId] = useState(null);
  const [deepLevel, setDeepLevel] = useState(1);

  const { camera, scene, size: canvasSize, controls, get } = useThree();

  /* список всех объекты, которые попали в область курсора */
  const [caughtMeshes, setCaughtMeshes] = useState([]);

  /* Id группы или объекта, который был определен при ховере на определенном уровне погружения */
  const [caughtLevel, setCaughtLevel] = useState();

  const setBoundingBox = useStatusStore(({ setBoundingBox }) => setBoundingBox);
  const setHoverBox = useStatusStore(({ setHoverBox }) => setHoverBox);

  /* Шаг 1: На этом этапе мы находим какой объект на самом глубоком уровне попадает в область курсора  */
  useEffect(() => {
    const handleRaycasting = (e) => {
      const pointer = new THREE.Vector2();

      let { camera } = get();

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.firstHitOnly = true;

      raycaster.setFromCamera(pointer, camera);

      try {
        let intersects = raycaster.intersectObjects(scene.children, true);

        if (Array.isArray(intersects)) {
          let points = [];

          const handleUUID = (intersect = {}) => {
            const { object = {} } = intersect;
            const { uuid, id } = object;

            return id;
          };

          const intersect = intersects
            .filter((intersect = {}) => {
              /* пойманный в область курсора объект не может быть типа bounding-box */
              const { object = {} } = intersect;
              const { name, isTransformControls } = object;

              let foundTransformChildren = false;
              object.traverseAncestors((obj = {}, i) => {
                const { isTransformControls } = obj;
                if (isTransformControls) foundTransformChildren = true;
              });

              return !(
                name === "bounding-box" ||
                name === "hover-box" ||
                isTransformControls ||
                foundTransformChildren
              );
            })
            .filter(handleUUID)
            .filter((_, i) => {
              return i === 0;
            });

          setCaughtMeshes(intersect.map(handleUUID));
        }
      } catch (err) {
        console.log("errpr", err);
      }
    };

    window.addEventListener("mousemove", handleRaycasting);

    return () => {
      window.removeEventListener("mousemove", handleRaycasting);
    };
  }, [scene, camera, viewType, get]);

  /* Шаг 2: При клике выбрать deepObject */
  useEffect(() => {
    if (caughtMeshes && caughtMeshes.length > 0 && scene) {
      const handleClick = () => {
        const caughtItem = scene.getObjectById(caughtMeshes[0]);

        if (caughtItem) {
          setDeepObjectId(caughtItem.id);
        }
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    } else if (caughtMeshes && caughtMeshes.length === 0 && scene) {
      const handleClick = (e) => {
        const rightPanel = document.getElementById("right-panel");
        const isClickOnRightPanel = rightPanel && rightPanel.contains(e.target);

        if (isClickOnRightPanel) return;

        setDeepObjectId(null);
        setCaughtLevel(null);
        setDeepLevel(1);
        setBoundingBox(null);

        setGUIData(null);
        setUserData(null);
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, [caughtMeshes, scene, camera, viewType]);

  useEffect(() => {
    if (
      caughtMeshes &&
      caughtMeshes.length > 0 &&
      scene &&
      selection === "bbox"
    ) {
      /* Шаг 1: Берем деталь, на которую наведен курсор */
      const caughtItem = scene.getObjectById(caughtMeshes[0]);

      /* Шаг 2: Смотрим предков у объекта */
      if (caughtItem) {
        /* Шаг 2.1: составляем список всех предков. 
           Порядок ближайший предок -> дальний предок -> еще более дальний */
        let indexList = [];

        caughtItem.traverseAncestors((obj = {}, i) => {
          indexList.push(obj.id);
        });

        /* Шаг 2.2: Инверсия списка предков. В итоге
           0 - сцена
           1 - группа
           2 - подгруппа
        */
        indexList = [...indexList].reverse();

        let caughtLevelId;

        if (caughtItem.id === deepObjectId) {
          /* Шаг 2.3: Определяем id выбранного объекта на определенном этапе погружения */
          if (deepLevel < indexList.length) {
            /* Шаг 2.3.1: Если актуальный уровень погружения меньше списка предков */
            caughtLevelId = indexList[deepLevel];
          } else {
            /* Шаг 2.3.2: Если список предков меньше уровня погружения, значит мы дошли до самого элемента */
            caughtLevelId = caughtItem.id;
          }
        } else {
          /* Если спустились на определенный уровень у другого объекта, а актуального объекта другая структура вложения парент групп */
          if (deepObjectId) {
            const alterItem = scene.getObjectById(deepObjectId);
            let alterList = [];

            if (alterItem) {
              alterItem.traverseAncestors((obj = {}, i) => {
                alterList.push(obj.id);
              });
            }

            alterList = [...alterList].reverse();

            /* Находим разницу между структурой родительских групп актуального объекта и структуру предыдуще выбранного объекта  */
            /* Чтобы понять в какой момент родительские группы расходятся по id */
            const diff = indexList.filter((x) => !alterList.includes(x));

            if (diff.length > 0) {
              caughtLevelId = diff[0];
            } else {
              /* значит, соседний братан в подгруппе по сравнению с предыдуще выбранным оъектом */
              if (deepLevel < indexList.length) {
                /* Шаг 2.3.1: Если актуальный уровень погружения меньше списка предков */
                caughtLevelId = indexList[deepLevel];
              } else {
                /* Шаг 2.3.2: Если список предков меньше уровня погружения, значит мы дошли до самого элемента */
                caughtLevelId = caughtItem.id;
              }
            }
          } else {
            caughtLevelId = indexList.length > 1 ? indexList[1] : caughtItem.id;
          }
        }

        setCaughtLevel(caughtLevelId);
      }
    } else {
      setCaughtLevel(null);
    }

    if (selection === "object") {
      if (caughtMeshes && caughtMeshes.length > 0 && scene) {
        /* Шаг 1: Берем деталь, на которую наведен курсор */
        const caughtItem = scene.getObjectById(caughtMeshes[0]);

        if (caughtItem) {
          const box3 = new THREE.Box3();
          box3.setFromObject(caughtItem);

          setHoverBox({
            ...box3,
            logId: uuidv4(),
            object: caughtItem,
          });
        }
      } else {
        setHoverBox(null);
      }

      setNeedsRender(true);
    }
  }, [
    caughtMeshes,
    scene,
    deepLevel,
    camera,
    deepObjectId,
    viewType,
    selection,
  ]);

  useEffect(() => {
    if (selection === "object") {
      const handleClick = (e) => {
        if (caughtMeshes && caughtMeshes.length > 0 && scene) {
          /* Шаг 1: Берем деталь, на которую наведен курсор */
          const caughtItem = scene.getObjectById(caughtMeshes[0]);

          if (caughtItem) {
            let { userData, name, id, uuid, type, children = [] } = caughtItem;

            /* Фича с привязкой данных другого объекта при необходимости */
            if (userData.link) {
              const linkedObject = scene.getObjectByProperty(
                "name",
                userData.link
              );
              if (linkedObject) {
                userData = linkedObject.userData;
                name = linkedObject.name;
                id = linkedObject.id;
                uuid = linkedObject.uuid;
                type = linkedObject.type;
                children = linkedObject.children;
              }
            }

            const box3 = new THREE.Box3();
            box3.setFromObject(caughtItem);

            const center = box3.getCenter(new THREE.Vector3());
            const size = box3.getSize(new THREE.Vector3());

            setUserData({
              ...userData,
              logId: uuidv4(),
              name,
              id,
              uuid,
              type,
              children: { length: children.length },
            });

            setBoundingBox({
              ...box3,
              center,
              size,
              logId: uuidv4(),
              e: { x: e.clientX, y: e.clientY },
              canvasSize,
            });
            setCameraData(camera);
            setControlsData(controls);
          }
        }

        setNeedsRender(true);
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, [caughtMeshes, scene, selection, camera, canvasSize, controls, viewType]);

  useEffect(() => {
    if (selection === "bbox") {
      if (typeof caughtLevel === "number") {
        const caughtLevelObject = scene.getObjectById(caughtLevel);

        if (caughtLevelObject) {
          const box3 = new THREE.Box3();
          box3.setFromObject(caughtLevelObject);

          setHoverBox({ ...box3, logId: uuidv4() });
        }
      } else {
        setHoverBox(null);
      }

      setNeedsRender(true);
    }
  }, [caughtLevel, scene, camera, viewType, selection]);

  useEffect(() => {
    if (selection === "bbox") {
      if (typeof caughtLevel === "number") {
        const handleClick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const object = scene.getObjectById(caughtLevel);
          if (object) {
            let { userData, name, id, uuid, type, children = [] } = object;

            /* Фича с привязкой данных другого объекта при необходимости */
            if (userData.link) {
              const linkedObject = scene.getObjectByProperty(
                "name",
                userData.link
              );
              if (linkedObject) {
                userData = linkedObject.userData;
                name = linkedObject.name;
                id = linkedObject.id;
                uuid = linkedObject.uuid;
                type = linkedObject.type;
                children = linkedObject.children;
              }
            }

            setUserData({
              ...userData,
              logId: uuidv4(),
              name,
              id,
              uuid,
              type,
              children: { length: children.length },
            });

            const box3 = new THREE.Box3();
            box3.setFromObject(object);

            const center = box3.getCenter(new THREE.Vector3());
            const size = box3.getSize(new THREE.Vector3());

            setBoundingBox({
              ...box3,
              center,
              size,
              logId: uuidv4(),
              e: { x: e.clientX, y: e.clientY },
              canvasSize,
            });
            setCameraData(camera);
            setControlsData(controls);
          }

          /* */
          let indexList = [];

          object.traverseAncestors((obj = {}, i) => {
            indexList.push(obj.id);
          });

          indexList = [...indexList].reverse();
          /* */

          setDeepLevel((state) => indexList.length + 1);
        };

        window.addEventListener("click", handleClick);

        return () => {
          window.removeEventListener("click", handleClick);
        };
      }
    }
  }, [caughtLevel, selection, camera, canvasSize, controls, viewType]);

  return <></>;
};

export default Selection;
