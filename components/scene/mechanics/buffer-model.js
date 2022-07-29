import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";
import useStatusStore from "../../../store/status-store";

const BufferModel = ({ path, way, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [fetched, SetFetched] = useState(false);

  const loadingFileIndex = useStatusStore(
    ({ loadingFileIndex }) => loadingFileIndex
  );
  const setLoadingFileIndex = useStatusStore(
    ({ setLoadingFileIndex }) => setLoadingFileIndex
  );

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
          console.log("error", error);
          setLoadingFileIndex(loadingFileIndex + 1);
          SetFetched(true);
        });
    }
  }, [path, way, index, loadingFileIndex, fetched]);

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

          if (matData && Array.isArray(matData) && matData.length > 0) {
            let rgba = matData[0];

            if (!(Array.isArray(rgba) && rgba.length === 4)) {
              rgba = [1, 1, 1, 1];
            }

            let colorString = `${rgba[0]}${rgba[1]}${rgba[2]}${rgba[3]}`;
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

          scene.add(mesh);
        });

        setLoaded(true);
        setLoadingFileIndex(loadingFileIndex + 1);
      }
    }
  }, [loaded, dataGeometry, index, loadingFileIndex]);

  return <></>;
};

export default BufferModel;

//THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
//THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
//THREE.Mesh.prototype.raycast = acceleratedRaycast;

//geometry.computeBoundsTree();
