export const P = (x, y) => {
  return { x: x, y: y };
};

export function getParallelSegment(A, B, d, side) {
  // --- Return a line segment parallel to AB, d pixels away
  var dx = A.x - B.x,
    dy = A.y - B.y,
    dist = Math.sqrt(dx * dx + dy * dy) / 2;
  side = side || 1;
  dx *= (side * d) / dist;
  dy *= (side * d) / dist;
  return [P(A.x + dy, A.y - dx), P(B.x + dy, B.y - dx)];
}

export function getIntersection(A, B, C, D) {
  // --- Get intersection between lines AB and CD
  // See https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  var ABdx = A.x - B.x,
    ABdy = A.y - B.y,
    CDdx = C.x - D.x,
    CDdy = C.y - D.y,
    ABd = A.x * B.y - A.y * B.x,
    CDd = C.x * D.y - C.y * D.x,
    den = ABdx * CDdy - ABdy * CDdx;
  return P((ABd * CDdx - ABdx * CDd) / den, (ABd * CDdy - ABdy * CDd) / den);
}

export function getParallelPolyline(poly, distance, side) {
  // For a path [{x: x1, y: y2}, {x: x2, y: y2}, etc.] returns a parallel path
  var i,
    nextSegment,
    segment = getParallelSegment(poly[0], poly[1], distance, side),
    r = [segment[0]];
  for (i = 1; i < poly.length - 1; i++) {
    nextSegment = getParallelSegment(poly[i], poly[i + 1], distance, side);
    r.push(
      getIntersection(segment[0], segment[1], nextSegment[0], nextSegment[1])
    );
    segment = nextSegment;
  }
  r.push(segment[1]);
  return r;
}
