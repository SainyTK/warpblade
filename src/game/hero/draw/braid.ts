import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** how many links of the rope the braid takes: a short, heavy plait that ends between the shoulder blades */
const LINKS = 4;
/** how far each link sinks from the rope toward hanging straight down: the braid is heavier than a scarf */
const SAG = 0.65;
/** the length of one link, as the scarf's rope is built */
const LINK = 2.2;
/** the braid's radius at its root, and how much each link narrows it toward the tie */
const ROOT = 1.8;
const NARROW = 0.25;

/** the rope pulled toward hanging straight down from its first point */
function hang(rope: readonly Vec[]): Vec[] {
  const [x0, y0] = rope[0];
  return rope.slice(0, LINKS + 1).map(([x, y], i): Vec => [x + (x0 - x) * SAG, y + (y0 + i * LINK - y) * SAG]);
}

/**
 * One thick braid over her back in the hair colours, drawn along the first links of the rope: it narrows to the tip,
 * each plait lit on alternate sides, and a crimson tie in the scarf colours binds the end.
 */
export function drawBraid(s: SpriteCanvas, rope: readonly Vec[]): void {
  const links = hang(rope);
  s.begin();
  for (let i = 1; i < links.length; i++) {
    const [a, b] = [links[i - 1], links[i]];
    s.taper(a[0], a[1], b[0], b[1], ROOT - (i - 1) * NARROW, ROOT - i * NARROW, HC.hair);
  }
  s.shadeEdges(HC.hair, HC.hairLight, HC.hairDeep);
  for (let i = 1; i < links.length; i++) {
    const [a, b] = [links[i - 1], links[i]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const [nx, ny] = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len];
    const side = i % 2 ? 0.6 : -0.6;
    const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    s.set(mx + nx * side, my + ny * side, HC.hairLight);
    s.set(mx - nx * side * 0.4, my - ny * side * 0.4, HC.hairDark);
  }
  s.commit(false);
  const tie = links[links.length - 1];
  s.begin();
  s.dot(tie[0], tie[1], 0.9, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit(false);
}
