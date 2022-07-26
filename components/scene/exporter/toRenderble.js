import {
  Mesh,
  Line,
  MeshBasicMaterial,
  Scene,
  BufferGeometry,
  Object3D,
} from "three";
import { Geometry } from "three/examples/jsm/deprecated/Geometry.js";

import * as THREE from "three";

const isMesh = (obj) => {
  return obj.isMesh;
};

const isLine = (obj) => {
  return obj.isLine;
};

// const isBufferGeometry = (obj: any): obj is BufferGeometry => {
//   return obj.isBufferGeometry
// }
const isGeometry = (obj) => {
  return obj.isGeometry;
};

const toRenderableGeometry = (geom) => {
  if (isGeometry(geom)) {
    return geom;
  }
  // Try to convert BufferGeometry (not stable...)
  if (geom.index === null && !geom.getAttribute("position")) {
    return null;
  }
  try {
    const buf = new Geometry().fromBufferGeometry(geom);
    return buf;
  } catch (e) {
    console.warn(`skip: ${geom}`);
    return null;
  }
};

export const toRenderble = (scene) => {
  let childrenList = [];

  const cloneScene = scene.clone();
  cloneScene.traverse((mesh) => {
    if (/*!isMesh(mesh) || */ !isLine(mesh)) return;
    if (!mesh.geometry) {
      return;
    }

    console.log("mesh geometry", mesh.geometry);

    let tmpGeometry = new Geometry();

    // Convert geometry
    const appendGeom = toRenderableGeometry(mesh.geometry);
    if (!appendGeom) {
      return null;
    }

    if (mesh.parent) {
      mesh.parent.updateMatrixWorld();
      mesh.applyMatrix(mesh.parent.matrixWorld);
    }

    mesh.geometry = appendGeom;
    if (isMesh(mesh)) tmpGeometry.mergeMesh(mesh);
    /*if (isLine(mesh)) tmpGeometry.mergeVertices(mesh);*/

    const buf = tmpGeometry.toBufferGeometry();

    if (isMesh(mesh)) childrenList.push(new Mesh(buf, new MeshBasicMaterial()));
    if (isLine(mesh)) {
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
      });

      const points = [];
      points.push(new THREE.Vector3(-10, 0, 0));
      points.push(new THREE.Vector3(0, 10, 0));
      points.push(new THREE.Vector3(10, 0, 0));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line(geometry, material);

      childrenList.push(line);

      /*childrenList.push(new Line(mesh.geometry, new MeshBasicMaterial()));*/
    }
  });

  // generate output scene
  const outputScene = new Scene();

  /*const buf = tmpGeometry.toBufferGeometry();*/

  /*const mesh = new Mesh(buf, new MeshBasicMaterial());*/

  childrenList.map((item, i) => {
    outputScene.add(item);
  });

  return outputScene;
};
