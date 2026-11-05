type Pt = readonly [number, number];

/** the part of a polygon on one side of a vertical (axis 0) or horizontal (axis 1) line: below the value, or above it */
export function clipPoly(poly: readonly Pt[], axis: 0 | 1, value: number, keepBelow: boolean): Pt[] {
  const inside = (p: Pt): boolean => (keepBelow ? p[axis] <= value : p[axis] >= value);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    if (inside(a)) out.push(a);
    if (inside(a) === inside(b)) continue;
    const u = (value - a[axis]) / (b[axis] - a[axis]);
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
}
