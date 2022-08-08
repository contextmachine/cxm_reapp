import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

//import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js";

const Buffer3dm = ({
  path = "https://mmodel.contextmachine.online:8181/rh/get_part/Arc_main_panels",
  group,
}) => {
  const { scene } = useThree();

  useEffect(() => {
    fetch(path)
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        const { rhino: am = {} } = responseJSON[0];

        //const stroke = window.atob(data);

        const rhino3dm = window.rhino3dm;
        rhino3dm().then(async (rh) => {
          const doc = new rh.File3dm();

          doc.objects().add(rh.CommonObject.decode(am), null);

          const geom1 = doc.objects().get(0);

          const local_faces = geom1.geometry().faces();

          let faces = local_faces;
          for (let faceIndex = 0; faceIndex < faces.count; faceIndex++) {
            let face = faces.get(faceIndex);
            let mesh = face.getMesh(rh.MeshType.Any);
            if (mesh) {
              const formattedMesh = mesh.toThreejsJSON();
              const { data = {} } = formattedMesh;
              const { attributes = {} } = data;

              const geometry = new THREE.BufferGeometry();
              const material = new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide,
              });

              if (Object.keys(attributes).length > 0) {
                Object.keys(attributes).map((item) => {
                  const attribute = attributes[item];

                  const { array = [], type, itemSize = 3 } = attribute;

                  geometry.setAttribute(
                    item,
                    new THREE.BufferAttribute(new Float32Array(array), itemSize)
                  );
                });
              }

              const mesh_ = new THREE.Mesh(geometry, material);
              console.log("mesh_", mesh_);
              group.add(mesh_);

              if (mesh) mesh.delete();
            }
            face.delete();
          }
          faces.delete();
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [path]);

  return <></>;
};

export default Buffer3dm;
