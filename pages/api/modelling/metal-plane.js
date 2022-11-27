import * as THREE from "three";
import { getParallelPolyline } from "./utils/handle-offset-poly";

const { roundedCornerLine } = require("./utils/rounded-corner-line");

export default function handler(req, res) {
  /* Шаг 1: props */
  let props = {};

  if (req.method === "POST") {
    const { body } = req;

    if (body) props = typeof body === "string" ? JSON.parse(body) : body;
  }

  const { segments = [], offsets, depth } = props;

  /* Шаг 2 */
  const groupObject = new THREE.Group();

  /* */
  /* let path = new THREE.Shape();

  segments.map((item = {}, i) => {
    const { length, angle, radius } = item;

    if (i === 0) {
      path.moveTo(startPoint[0], startPoint[1]);
    } else {
      path.lineTo(startPoint[0], startPoint[1]);
    }

    const dx = length * Math.cos((angle * Math.PI) / 180);
    const dy = length * Math.sin((angle * Math.PI) / 180);

    path.lineTo(dx, dy);

    startPoint = [dx, dy];
  }); */

  /* */
  var points = [new THREE.Vector3(0, 0, 0)];
  let radiuses = [0];

  let startPoint = [0, 0];

  segments.map((item = {}, i) => {
    const { length, angle, radius } = item;

    const dx = startPoint[0] + length * Math.cos((angle * Math.PI) / 180);
    const dy = startPoint[1] + length * Math.sin((angle * Math.PI) / 180);

    points.push(new THREE.Vector3(dx, dy, 0));
    radiuses.push(radius);

    startPoint = [dx, dy];
  });

  var radius = 1;
  var smoothness = 12;

  var geom = roundedCornerLine([...points], radius, smoothness, false, [
    ...radiuses,
  ]);

  var line = new THREE.Line(
    geom,
    new THREE.LineBasicMaterial({
      color: "yellow",
      transparent: true,
      oapcity: 0,
    })
  );
  groupObject.add(line);

  /* */
  let gp = line.geometry.attributes.position;
  let wPos = [];
  for (let i = 0; i < gp.count; i++) {
    let p = new THREE.Vector3().fromBufferAttribute(gp, i);
    line.localToWorld(p);
    wPos.push(p);
  }

  let innerPos = getParallelPolyline(wPos, -offsets, 1)
    .filter(({ x, y }) => typeof x === "number" && typeof y === "number")
    .map((v) => ({ ...v, z: 0 }));

  let contour = [...wPos, ...innerPos.reverse()];
  let path = new THREE.Shape();
  contour.map((v = {}, i) => {
    if (i === 0) {
      path.moveTo(v.x, v.y);
    } else {
      path.lineTo(v.x, v.y);
    }
  });

  const extrudeSettings = {
    steps: 1,
    depth: depth,
  };

  const geometry = new THREE.ExtrudeGeometry(path, extrudeSettings);
  const material = new THREE.MeshNormalMaterial({
    color: 0x00ff00,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  groupObject.add(mesh);

  var baseLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(innerPos),
    new THREE.LineBasicMaterial({
      color: "aqua",
      transparent: true,
      opacity: 0.4,
    })
  );
  groupObject.add(baseLine);

  res.status(200).json(groupObject);
}

/* 
const extrudeSettings = {
    steps: 1,
    depth: 16,
  };

  const geometry = new THREE.ExtrudeGeometry(path, extrudeSettings);
  const material = new THREE.MeshNormalMaterial({
    color: 0x00ff00,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  */
