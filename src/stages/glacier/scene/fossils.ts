export const FOSSIL = { none: 0, body: 1, rim: 2, socket: 3 } as const;
export type FossilPart = (typeof FOSSIL)[keyof typeof FOSSIL];

export const BEAST_EYE = { x: 262, y: 82 } as const;

const spineY = (x: number): number => 100 + 14 * Math.sin((x - 10) / 30) - Math.max(0, x - 160) * 0.25;
const SKULL_Y = spineY(198) - 1;
const RIBS = Array.from({ length: 11 }, (_, i) => ({ x: 64 + i * 8.5, len: 16 - Math.abs(i - 5) * 1.2 }));

const inEllipse = (x: number, y: number, cx: number, cy: number, rx: number, ry: number): boolean =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;

function leviathan(x: number, y: number): FossilPart {
  if (inEllipse(x, y, 211, SKULL_Y - 1, 2.4, 2)) return FOSSIL.socket;
  if (
    inEllipse(x, y, 206, SKULL_Y, 13, 6) ||
    inEllipse(x, y, 222, SKULL_Y + 2, 8, 3.2) ||
    inEllipse(x, y, 213, SKULL_Y + 6, 11, 2.2)
  )
    return FOSSIL.body;
  if (x >= 6 && x <= 198) {
    const taper = Math.min(1, Math.max(0, (x - 6) / 54));
    const knob = Math.max(0, Math.cos(x * 0.9)) ** 4;
    if (Math.abs(y - spineY(x)) < (0.7 + 1.9 * taper) * (1 + 0.4 * knob)) return FOSSIL.body;
  }
  for (const rib of RIBS) {
    const top = spineY(rib.x);
    const u = (y - top) / rib.len;
    if (u >= 0 && u <= 1 && Math.abs(x - (rib.x - 5 * u * u)) < 0.85 * (1 - 0.45 * u)) return FOSSIL.body;
    const fin = (top - y) / 6;
    if (fin >= 0 && fin <= 1 && Math.abs(x - (rib.x + 2 * fin)) < 0.6 * (1 - fin * 0.5)) return FOSSIL.body;
  }
  return FOSSIL.none;
}

const HORN = { x: 290, y: 64 } as const;

function beast(x: number, y: number): FossilPart {
  if (inEllipse(x, y, BEAST_EYE.x, BEAST_EYE.y, 3, 2.4)) return FOSSIL.socket;
  if (inEllipse(x, y, 272, 84, 20, 15) || inEllipse(x, y, 248, 96, 15, 9) || inEllipse(x, y, 302, 124, 34, 30))
    return FOSSIL.body;
  const angle = Math.atan2(y - HORN.y, x - HORN.x);
  const p = (angle + Math.PI * 0.95) / (Math.PI * 0.95 + 0.7);
  if (p >= 0 && p <= 1) {
    const d = Math.hypot(x - HORN.x, y - HORN.y);
    if (Math.abs(d - (15 - p * 6)) < 4.2 - p * 3) return FOSSIL.body;
  }
  if (y >= 102 && y <= 128) {
    const u = (y - 102) / 26;
    if (Math.abs(x - (241 - 9 * u ** 1.5)) < 2.6 * (1 - u) + 0.4) return FOSSIL.body;
  }
  return FOSSIL.none;
}

const solid = (x: number, y: number): boolean => {
  const part = leviathan(x, y) || beast(x, y);
  return part === FOSSIL.body;
};

export function fossilAt(x: number, y: number): FossilPart {
  const part = leviathan(x, y) || beast(x, y);
  if (part !== FOSSIL.body) return part;
  return solid(x + 0.9, y - 0.9) ? FOSSIL.body : FOSSIL.rim;
}
