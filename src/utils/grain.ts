/** a fixed speckle value from 0 to 1 for this grid cell, so texture stays put from frame to frame */
export function grain(i: number, j: number): number {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
