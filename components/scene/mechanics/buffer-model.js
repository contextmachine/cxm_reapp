import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

const BufferModel = ({ path, way }) => {
  const [loaded, setLoaded] = useState(false);

  const [dataGeometry, setDataGeometry] = useState(null);

  /*const { get, set } = useThree(({ get, set }) => ({ get, set }));*/
  const { scene } = useThree();

  useEffect(() => {
    console.log("path", path);

    fetch(path)
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        console.log("responseJSON", responseJSON);

        let prepairedJSON = [];

        if (way === "s" || way === "l" || way === "s2") {
          prepairedJSON = responseJSON;
        } else {
          if (responseJSON) {
            Object.keys(responseJSON).map((name) => {
              prepairedJSON = [...prepairedJSON, ...responseJSON[name]];
            });
          }
        }

        setDataGeometry(prepairedJSON);
      });
  }, [path, way]);

  useEffect(() => {
    if (!loaded) {
      if (dataGeometry) {
        dataGeometry.map((element = {}) => {
          THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
          THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
          THREE.Mesh.prototype.raycast = acceleratedRaycast;

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

          //geometry.computeBoundsTree();

          let material;

          if (matData && Array.isArray(matData) && matData.length > 0) {
            let rgba = matData[0];

            if (!(Array.isArray(rgba) && rgba.length === 4)) {
              console.log("rgba", rgba);

              rgba = [1, 1, 1, 1];
            }

            material = new THREE.MeshLambertMaterial({
              color: new THREE.Color(
                `rgb(${Math.round(rgba[0] * 255)}, ${Math.round(
                  rgba[1] * 255
                )}, ${Math.round(rgba[2] * 255)})`
              ),
              transparent: true,
              side: THREE.DoubleSide,
              opacity: rgba[3],
            });
          } else {
            material = new THREE.MeshNormalMaterial({
              transparent: true,
              opacity: /*0.8*/ 1,
            });
          }
          const mesh = new THREE.Mesh(geometry, material);

          scene.add(mesh);
        });

        setLoaded(true);
      }
    }
  }, [loaded, dataGeometry]);

  return <></>;
};

export default BufferModel;
