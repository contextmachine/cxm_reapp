import * as THREE from "three";

function roundedCornerLine(points, radius, smoothness, closed, radiuses) {
  radius = radius !== undefined ? radius : 0.1;
  smoothness = smoothness !== undefined ? Math.floor(smoothness) : 3;
  closed = closed !== undefined ? closed : false;

  let newGeometry = new THREE.BufferGeometry();

  if (points === undefined) {
    console.log("RoundedCornerLine: 'points' is undefined");
    return newGeometry;
  }
  if (points.length < 3) {
    console.log(
      "RoundedCornerLine: 'points' has insufficient length (should be equal or greater than 3)"
    );
    return newGeometry.setFromPoints(points);
  }

  // minimal segment
  let minVector = new THREE.Vector3();
  let minLength = minVector.subVectors(points[0], points[1]).length();
  for (let i = 1; i < points.length - 1; i++) {
    minLength = Math.min(
      minLength,
      minVector.subVectors(points[i], points[i + 1]).length()
    );
  }
  if (closed) {
    minLength = Math.min(
      minLength,
      minVector.subVectors(points[points.length - 1], points[0]).length()
    );
  }

  radius = radius > minLength * 0.5 ? minLength * 0.5 : radius; // radius can't be greater than a half of a minimal segment

  let startIndex = 1;
  let endIndex = points.length - 2;
  if (closed) {
    startIndex = 0;
    endIndex = points.length - 1;
  }

  let positions = [];
  if (!closed) {
    positions.push(points[0].clone());
  }

  for (let i = startIndex; i <= endIndex; i++) {
    let iStart = i - 1 < 0 ? points.length - 1 : i - 1;
    let iMid = i;
    let iEnd = i + 1 > points.length - 1 ? 0 : i + 1;
    let pStart = points[iStart];
    let pMid = points[iMid];
    let pEnd = points[iEnd];

    // key points
    let vStartMid = new THREE.Vector3().subVectors(pStart, pMid).normalize();
    let vEndMid = new THREE.Vector3().subVectors(pEnd, pMid).normalize();
    let vCenter = new THREE.Vector3()
      .subVectors(vEndMid, vStartMid)
      .divideScalar(2)
      .add(vStartMid)
      .normalize();
    let angle = vStartMid.angleTo(vEndMid);
    let halfAngle = angle * 0.5;

    radius = radiuses[i];

    let sideLength = radius / Math.tan(halfAngle);
    let centerLength = Math.sqrt(sideLength * sideLength + radius * radius);

    let startKeyPoint = vStartMid.multiplyScalar(sideLength);
    let centerKeyPoint = vCenter.multiplyScalar(centerLength);
    let endKeyPoint = vEndMid.multiplyScalar(sideLength);

    let cb = new THREE.Vector3(),
      ab = new THREE.Vector3(),
      normal = new THREE.Vector3();
    cb.subVectors(centerKeyPoint, endKeyPoint);
    ab.subVectors(startKeyPoint, endKeyPoint);
    cb.cross(ab);
    normal.copy(cb).normalize();

    let rotatingPointStart = new THREE.Vector3().subVectors(
      startKeyPoint,
      centerKeyPoint
    );
    let rotatingPointEnd = new THREE.Vector3().subVectors(
      endKeyPoint,
      centerKeyPoint
    );
    let rotatingAngle = rotatingPointStart.angleTo(rotatingPointEnd);
    let angleDelta = rotatingAngle / smoothness;
    let tempPoint = new THREE.Vector3();
    for (let a = 0; a < smoothness + 1; a++) {
      tempPoint
        .copy(rotatingPointStart)
        .applyAxisAngle(normal, angleDelta * a)
        .add(pMid)
        .add(centerKeyPoint);
      positions.push(tempPoint.clone());
    }
  }

  if (!closed) {
    positions.push(points[points.length - 1].clone());
  } else {
    positions.push(positions[0].clone());
  }

  return newGeometry.setFromPoints(positions);
}

export default function handler(req, res) {
  let props = {};

  if (req.method === "POST") {
    const { body } = req;

    if (body) props = typeof body === "string" ? JSON.parse(body) : body;
  }

  const groupObject = new THREE.Group();

  const { segments = [] } = props;

  let startPoint = [0, 0];

  /* */
  let path = new THREE.Shape();

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
  });

  const curvePath = path;

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

  //groupObject.add(mesh);

  /* */
  var points = [new THREE.Vector3(0, 0, 0)];
  let radiuses = [0];

  segments.map((item = {}, i) => {
    const { length, angle, radius } = item;

    const dx = length * Math.cos((angle * Math.PI) / 180);
    const dy = length * Math.sin((angle * Math.PI) / 180);

    points.push(new THREE.Vector3(dx, dy, 0));
    radiuses.push(radius);
  });

  var radius = 1;
  var smoothness = 12;

  var geom = roundedCornerLine(points, radius, smoothness, false, radiuses);
  var line = new THREE.Line(
    geom,
    new THREE.LineBasicMaterial({
      color: "yellow",
    })
  );
  groupObject.add(line);

  var baseLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: "aqua",
      transparent: true,
      opacity: 0.4,
    })
  );
  groupObject.add(baseLine);

  res.status(200).json(groupObject);
}
