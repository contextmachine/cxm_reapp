import * as THREE from "three";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const handleAddingScene = ({
  dataGeometry,
  handleMetaData = () => {},
  handleColorsLayer = () => {},
  handleBoundingBox = () => {},
  setLinksStructure = () => {},
  scene,
  layerName,
}) => {
  let materialsData = {};
  let bbox = {
    min: null,
    max: null,
  };

  /* Шаг 1: Если геометрия — это целостная группа из подготовленных three.js элементов */
  const isGroup = dataGeometry?.isGroup;
  const isObject3D = dataGeometry?.isObject3D;

  /*  */
  if (!(isGroup || isObject3D)) {
    /* Шаг 1.2 Если массив с необработанной датой */
    const fileGroup = new THREE.Group();
    fileGroup.name = layerName;

    console.log("dataGeometry", dataGeometry);

    dataGeometry.map((element = {}) => {
      /* Шаг 1.2.1: Содаем buffer геометрию */
      const geometry = new THREE.BufferGeometry();

      const { data = {}, metadata = {} } = element;
      const { attributes = {} } = data;

      Object.keys(attributes).map((item) => {
        const attribute = attributes[item];

        const { array = [], itemSize = 3 } = attribute;

        geometry.setAttribute(
          item,
          new THREE.BufferAttribute(new Float32Array(array), itemSize)
        );
      });

      /*  Шаг 1.2.2: добавляем материал */
      const { material: matData } = metadata;

      let material;
      let colorString;

      if (matData && Array.isArray(matData) && matData.length > 0) {
        let rgba = matData[0];

        if (!(Array.isArray(rgba) && rgba.length === 4)) {
          rgba = [1, 1, 1, 1];
        }

        colorString = `${rgba[0]}^${rgba[1]}^${rgba[2]}^${rgba[3]}`;

        /* Шаг 1.2.3: Добавляем цвет в общую базу цветов цветов сцены */
        if (!materialsData[colorString])
          materialsData[colorString] = new THREE.MeshStandardMaterial({
            color: new THREE.Color(
              `rgb(${Math.round(rgba[0] * 255)}, ${Math.round(
                rgba[1] * 255
              )}, ${Math.round(rgba[2] * 255)})`
            ),
            side: THREE.DoubleSide,
          });

        /* Шаг 1.2.4: Берем этот материал из базы */
        material = materialsData[colorString];
      } else {
        material = new THREE.MeshNormalMaterial();
      }

      /* bounding BVH */
      geometry.computeBoundsTree();
      const { boundingBox = {} } = geometry ? geometry : {};
      const { min = {}, max = {}, isBox3 } = boundingBox;
      if (isBox3) {
        if (!bbox.min) bbox.min = { x: min.x, y: min.y, z: min.z };
        if (!bbox.max) bbox.max = { x: max.x, y: max.y, z: max.z };

        /* Шаг 1.2.5: min */
        if (min.x < bbox.min.x) bbox.min.x = min.x;
        if (min.y < bbox.min.y) bbox.min.y = min.y;
        if (min.z < bbox.min.z) bbox.min.z = min.z;

        /* Шаг 1.2.5: max */
        if (max.x > bbox.max.x) bbox.max.x = max.x;
        if (max.y > bbox.max.y) bbox.max.y = max.y;
        if (max.z > bbox.max.z) bbox.max.z = max.z;
      }

      /* Шаг 1.3: Собираем общий mesh */
      const mesh = new THREE.Mesh(geometry, material);

      /* Шаг 1.3.1: Назначаем ему аттрибуты */
      mesh.x_file = layerName;
      mesh.x_material = colorString;

      fileGroup.add(mesh);

      handleMetaData(metadata);
    });

    handleColorsLayer(materialsData);

    scene.add(fileGroup);

    /*const box3 = new THREE.Box3();
    box3.setFromObject(group);*/

    //console.log("box3 nonGroup", box3);
  } else if (isGroup || isObject3D) {
    /* const box3 = new THREE.Box3();
    box3.setFromObject(dataGeometry);

    const { min = {}, max = {}, isBox3 } = box3;
    if (isBox3) {
      if (!bbox.min) bbox.min = { x: min.x, y: min.y, z: min.z };
      if (!bbox.max) bbox.max = { x: max.x, y: max.y, z: max.z };

      
      if (min.x < bbox.min.x) bbox.min.x = min.x;
      if (min.y < bbox.min.y) bbox.min.y = min.y;
      if (min.z < bbox.min.z) bbox.min.z = min.z;

      
      if (max.x > bbox.max.x) bbox.max.x = max.x;
      if (max.y > bbox.max.y) bbox.max.y = max.y;
      if (max.z > bbox.max.z) bbox.max.z = max.z;
    }*/

    dataGeometry.x_file = layerName;

    /* составить Dom структуру */
    /* let nodes = [];
    let links = []; */

    //console.log("dataGeometry", dataGeometry);

    /* nodes.push({
      id: dataGeometry.uuid,
      type: dataGeometry.type,
      type: dataGeometry.name,
    }); */

    /* dataGeometry.traverse((item = {}) => {
      const { uuid, parent, type, name } = item;
      if (uuid) nodes.push({ id: uuid, type, name });

      if (parent) {
        const { uuid: parent_uuid } = parent;

        if (parent_uuid === "d048874d-e397-44f1-a08c-ed4c3310fc48") {
          console.log("item");
        }

        if (uuid && parent_uuid)
          links.push({ target: uuid, source: parent_uuid, value: 10 });
      }

      if (!parent) {
        console.log("item with no parets", item);
      }
    });

    const fileSankey = { nodes, links, startId: dataGeometry.uuid };

    if (fileSankey) {
      setLinksStructure(fileSankey);
    }*/

    if (dataGeometry.isPoints) {
      dataGeometry.material.size = 1.4;
    }

    scene.add(dataGeometry);
  }
};

export default handleAddingScene;
