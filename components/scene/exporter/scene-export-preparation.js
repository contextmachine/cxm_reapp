import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Geometry } from "three/examples/jsm/deprecated/Geometry.js";

const isMesh = (obj) => {
  return obj.isMesh;
};

const isLine = (obj) => {
  return obj.isLine;
};

/* Секция, которая отвечает за получение всех элементов сцены и обработки их по типам
 * для дальнейшего экспорта
 */

/* Сортировка по типам элементов */
const handleSorting = (scene) => {
  let childrenList = [];

  const cloneScene = scene.clone();

  const checkGeometry = (mesh) => {
    if (mesh && mesh.geometry && mesh.geometry.getAttribute("position"))
      return true;
    return false;
  };

  cloneScene.traverse((mesh) => {
    /* IS MESH */
    if (isMesh(mesh)) {
      if (checkGeometry(mesh)) {
        /* создать новую Geometry болванку */
        let tmpGeometry = new Geometry();

        /* применить position, scale... от родительского элемента */
        if (mesh.parent) {
          mesh.parent.updateMatrixWorld();
          mesh.applyMatrix(mesh.parent.matrixWorld);
        }

        mesh.geometry = new Geometry().fromBufferGeometry(mesh.geometry);
        tmpGeometry.mergeMesh(mesh);

        const bufferGeometry = tmpGeometry.toBufferGeometry();

        return childrenList.push({
          type: "mesh",
          geometry: bufferGeometry,
        });
      }
    }

    /* IS LINE */
    if (isLine(mesh)) {
      if (checkGeometry(mesh)) {
        if (mesh.parent) {
          mesh.parent.updateMatrixWorld();
          mesh.applyMatrix(mesh.parent.matrixWorld);
        }

        mesh.geometry.applyMatrix(mesh.matrix);

        const geom_position = mesh.geometry.getAttribute("position");
        const { array = [] } = geom_position;

        let points = [];

        array.map((coordinate, i) => {
          let index = Math.floor(i / 3);
          let subIndex = i % 3;

          if (!points[index]) points[index] = [];

          points[index][subIndex] = coordinate;
        });

        return childrenList.push({ type: "polyline", points });
      }
    }

    return;
  });

  return childrenList;
};

/* Сохранить файл */
const saveByteArray = (filename, byte, setNeedsData) => {
  let blob = new Blob([byte], { type: "application/octect-stream" });

  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);

  link.download = filename;
  link.click();

  setNeedsData(false);
};

const SceneExportPreparation = ({ needsData, setNeedsData }) => {
  const { scene } = useThree();

  useEffect(() => {
    if (scene && needsData) {
      const copyScene = handleSorting(scene);

      /* Перевести все элементы в Райно формат и выгрузить */
      window.rhino3dm().then((rh) => {
        /* Шаг 1: Создавать 3dm файл как класс */
        let doc = new rh.File3dm();

        if (copyScene) {
          /* Шаг 2: Добавляем в doc.objects() все типовые элементы */
          copyScene.map((item) => {
            const { type } = item;

            const layer = new rh.Layer();
            layer.name = "Something" + Math.random();

            console.log("layer", layer);

            doc.layers().add(layer);

            if (type === "polyline") {
              /* Шаг 2.1: Если элемент - полилиния */
              const { points = [] } = item;

              const polyline = new rh.Polyline();

              console.log("polyline", polyline);

              points.map((point) => {
                polyline.add(point[0], point[2], point[1]);
              });

              doc.objects().add(polyline.toNurbsCurve(), null);
            } else if (type === "mesh") {
              /* Шаг 2.1: Если элемент - мэш */
              const { geometry = {} } = item;

              const mesh = rh.Mesh.createFromThreejsJSON({
                data: geometry,
              });

              console.log("mesh", mesh);

              doc.objects().add(mesh, null);
            }
          });
        }

        /* Шаг 3: Дополнительные сведения для  3dm файла */
        let options = new rh.File3dmWriteOptions();
        options.version = 7;

        /* Делаем файл битным */
        let buffer = doc.toByteArray(options);
        saveByteArray("online-scene.3dm", buffer, setNeedsData);

        /* Стираем 3dm класс */
        doc.delete();
      });
    }
  }, [scene, needsData]);

  return <mesh></mesh>;
};

export default SceneExportPreparation;
