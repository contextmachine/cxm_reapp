import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";
import useStatusStore from "../../../store/status-store";

const BufferModel = ({ path, way, index, layerName }) => {
  const [loaded, setLoaded] = useState(false);
  const [fetched, SetFetched] = useState(false);

  const loadingFileIndex = useStatusStore(
    ({ loadingFileIndex }) => loadingFileIndex
  );
  const setLoadingFileIndex = useStatusStore(
    ({ setLoadingFileIndex }) => setLoadingFileIndex
  );

  const layersData = useStatusStore(({ layersData }) => layersData);
  const setLayersData = useStatusStore(({ setLayersData }) => setLayersData);

  const setLayersUpdated = useStatusStore(
    ({ setLayersUpdated }) => setLayersUpdated
  );

  const filesTab = "По файлам";
  const materialsTab = "По цветам";

  const [dataGeometry, setDataGeometry] = useState(null);

  /*const { get, set } = useThree(({ get, set }) => ({ get, set }));*/
  const { scene } = useThree();

  useEffect(() => {
    if (!fetched && index === loadingFileIndex) {
      fetch(path)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          setDataGeometry(responseJSON);
          SetFetched(true);
        })
        .catch((error) => {
          setLoadingFileIndex(loadingFileIndex + 1);
          SetFetched(true);
        });
    }
  }, [path, way, index, loadingFileIndex, fetched]);

  const handleFilesLayers = () => {
    let layersData_copy = layersData;
    if (!layersData_copy[filesTab]) {
      layersData_copy[filesTab] = [];
    }

    layersData_copy[filesTab].push({ name: layerName, visible: true });

    setLayersData(layersData_copy);
    setLayersUpdated(true);
  };

  const handleColorsLayer = (colors = {}) => {
    let layersData_copy = layersData;

    if (!layersData_copy[materialsTab]) {
      layersData_copy[materialsTab] = [];
    }

    Object.keys(colors).map((color) => {
      const findColor = layersData_copy[materialsTab].find((item = {}) => {
        const { name } = item;

        if (name === color) {
          return true;
        }

        return false;
      });

      if (!findColor) {
        layersData_copy[materialsTab].push({ name: color, visible: true });
      }
    });

    setLayersData(layersData_copy);
    setLayersUpdated(true);
  };

  useEffect(() => {
    if (fetched) {
      handleFilesLayers();
    }
  }, [fetched]);

  useEffect(() => {
    if (!loaded) {
      if (dataGeometry && index === loadingFileIndex) {
        let materialsData = {};

        dataGeometry.map((element = {}) => {
          const geometry = new THREE.BufferGeometry();

          const { data = {}, metadata = {} } = element;
          const { attributes = {} } = data;

          const { material: matData } = metadata;

          Object.keys(attributes).map((item) => {
            const attribute = attributes[item];

            const { array = [], type, itemSize = 3 } = attribute;
            const length = array.length / itemSize;

            geometry.setAttribute(
              item,
              new THREE.BufferAttribute(new Float32Array(array), itemSize)
            );
          });

          let material;
          let colorString;

          if (matData && Array.isArray(matData) && matData.length > 0) {
            let rgba = matData[0];

            if (!(Array.isArray(rgba) && rgba.length === 4)) {
              rgba = [1, 1, 1, 1];
            }

            colorString = `${rgba[0]}^${rgba[1]}^${rgba[2]}^${rgba[3]}`;
            if (!materialsData[colorString])
              materialsData[colorString] = new THREE.MeshStandardMaterial({
                color: new THREE.Color(
                  `rgb(${Math.round(rgba[0] * 255)}, ${Math.round(
                    rgba[1] * 255
                  )}, ${Math.round(rgba[2] * 255)})`
                ),
                side: THREE.DoubleSide,
              });

            material = materialsData[colorString];
          } else {
            material = new THREE.MeshNormalMaterial();
          }
          const mesh = new THREE.Mesh(geometry, material);
          mesh.x_file = layerName;
          mesh.x_material = colorString;

          scene.add(mesh);
        });

        handleColorsLayer(materialsData);

        setLoaded(true);
        setLoadingFileIndex(loadingFileIndex + 1);
      }
    }
  }, [loaded, dataGeometry, index, loadingFileIndex, layerName]);

  return <></>;
};

export default BufferModel;

//THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
//THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
//THREE.Mesh.prototype.raycast = acceleratedRaycast;

//geometry.computeBoundsTree();
