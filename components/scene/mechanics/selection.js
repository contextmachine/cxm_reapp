import { Sphere } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import useStatusStore from "../../../store/status-store";

import { v4 as uuidv4 } from "uuid";

const Selection = () => {
  const setNeedsRender = useStatusStore(({ setNeedsRender }) => setNeedsRender);

  const userData = useStatusStore(({ userData }) => userData);
  const setUserData = useStatusStore(({ setUserData }) => setUserData);

  const setInfographicsData = useStatusStore(
    ({ setInfographicsData }) => setInfographicsData
  );

  /* Уровень погружения в подгруппы */
  /* 0 — вся сцена 
     1 — Группа
     2 — Подгруппа
     3 — Подгруппа подгруппы и тд
     ....
  */
  const [deepObjectId, setDeepObjectId] = useState(null);
  const [deepLevel, setDeepLevel] = useState(1);

  const { camera, scene } = useThree();

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
              const { name } = object;

              return !(name === "bounding-box" || name === "hover-box");
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
  }, [scene, camera]);

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

        setInfographicsData(null);
        setUserData(null);
      };

      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("click", handleClick);
      };
    }
  }, [caughtMeshes, scene]);

  useEffect(() => {
    if (caughtMeshes && caughtMeshes.length > 0 && scene) {
      /* Шаг 1: Берем деталь, на которую наведен курсор */
      const caughtItem = scene.getObjectById(caughtMeshes[0]);

      /* Шаг 2: Смотрим предков у объекта */
      if (caughtItem) {
        /* Шаг 2.1: составляем список всех предков. 
           Порядок ближайший предок -> дальний предок -> еще более дальний */
        const indexList = [];

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
            const alterList = [];

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
  }, [caughtMeshes, scene, deepLevel, deepObjectId]);

  useEffect(() => {
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
  }, [caughtLevel, scene]);

  useEffect(() => {
    if (typeof caughtLevel === "number") {
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const object = scene.getObjectById(caughtLevel);
        if (object) {
          const { userData, name, id } = object;
          setUserData({ ...userData, logId: uuidv4(), name, id });

          const box3 = new THREE.Box3();
          box3.setFromObject(object);

          setBoundingBox({ ...box3, logId: uuidv4() });
        }

        /* */
        const indexList = [];

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
  }, [caughtLevel]);

  return <></>;
};

export default Selection;
