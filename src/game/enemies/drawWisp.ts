import { ENEMY_COLORS as EC } from "../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { clamp } from "../../utils/math";
import { litOrb } from "./litOrb";
import { EYE_DULL, FLESH, FLESH_BRIGHT, INNER_FIRE } from "./night/colors";
import { moonlight } from "./night/moonlight";
import { rigsFor } from "./night/rig";

const canvas = detailCanvas(36, 36, 18, 18);
const rigFor = rigsFor(canvas);

/** eyes in image pixels, slanting down to the nose: "h" the hot centre, "c" the eye, "g" the glow under it, "d" dull */
const EYES = {
  rear: {
    open: ["c...", "hc..", "hhc.", "ghhc"],
    low: ["....", "....", "hcc.", "ghhc"],
    shut: ["....", "....", "dddd"],
  },
  front: {
    open: ["...c", "..ch", ".chh", "chhg"],
    low: ["....", "....", ".cch", "chhg"],
    shut: ["....", "....", "dddd"],
  },
};
/** the mouth at rest in image pixels, a small crooked slit */
const MOUTH = ["mm..", "..mm"];
/** the speed, in art pixels a second, at which its tail and crest stream straight back */
const STREAM_SPEED = 240;
const BODY_RADIUS = 5.3;

/**
 * A floating shadow lit from the moon's side: a round body with a flickering crest of shadow flame, three trailing
 * tendrils that stream behind it as it moves, and two slanted burning eyes. It pulls back and opens a glowing maw
 * before a lunge, stretches out in the lunge, and hangs limp with dull eyes when stunned or thrown.
 */
export function drawWisp(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const g = rigFor(e.face);
  const time = t + e.seed;
  const limp = e.stun > 0 || e.air;
  const winding = e.state === "wind" && !limp;
  const lunging = e.state === "lunge" && !limp;
  const ahead = limp ? 0 : clamp((e.vx * e.face) / STREAM_SPEED, -1, 1);
  const down = limp ? 0 : clamp(e.vy / STREAM_SPEED, -1, 1);
  const bx = winding ? -1 : lunging ? 0.5 : 0;
  const flick = limp ? 0 : Math.sin(time * 9);
  s.clear();
  // the tendrils, streaming away from the way it moves
  s.begin();
  for (let k = 0; k < 3; k++) {
    const ox = (k - 1) * 2.5 + bx;
    const wave = limp ? 0 : Math.sin(time * 6 + k * 2);
    const x1 = limp ? ox - 0.5 : ox - 3 + wave * 2 - ahead * 6;
    const y1 = limp ? 9.5 + k : 8 + k * 1.5 - down * 6 - Math.abs(ahead) * 3;
    g.taper(ox, 2, x1, y1, 2.2 - k * 0.3, 0.8, EC.bodyDark, wave * 1.2);
    g.taper(ox - 0.4, 3, x1, y1 - 1, 0.35, 0.2, FLESH_BRIGHT, wave * 1.2);
  }
  s.shadeEdges(EC.bodyDark, EC.bodyLight, EC.bodyDeep);
  s.commit(false);
  // the smear it leaves in a lunge
  if (lunging) {
    s.begin();
    g.taper(bx, 0, bx - ahead * 9, -down * 9, 4.4, 1, EC.bodyDark);
    s.shadeEdges(EC.bodyDark, EC.bodyLight, EC.bodyDeep);
    s.commit(false);
  }
  // the crest of shadow flame
  s.begin();
  const lift = winding ? 2.5 : 0;
  if (limp) g.taper(bx - 2, -4, bx - 5.5, -4.5, 1.6, 0.3, EC.body, -1);
  else {
    g.taper(bx - 0.5, -3.4, bx - 4 - ahead * 5 + flick, -9 - lift + Math.abs(ahead) * 3, 3, 0.4, EC.body, 1.2);
    g.taper(bx - 3, -2, bx - 6.5 - ahead * 3 - flick * 0.7, -5 - lift * 0.4, 1.7, 0.3, EC.body, 0.5);
  }
  s.shadeEdges(EC.body, FLESH_BRIGHT, EC.bodyDark);
  s.commit();
  s.begin();
  litOrb(s, g.x(bx), 0, BODY_RADIUS, FLESH);
  s.commit();
  // the eyes in their sockets, and the mouth
  s.begin();
  g.dot(bx + 1.1, -1.2, 1.5, EC.bodyDeep);
  g.dot(bx + 3.6, -1.2, 1.4, EC.bodyDeep);
  const look = limp ? "shut" : e.state === "recover" ? "low" : "open";
  const map = {
    h: winding || lunging ? WHITE : EC.eyeCore,
    c: winding ? EC.eyeCore : EC.eye,
    g: EC.eyeGlow,
    d: EYE_DULL,
  };
  const bob = limp ? 0 : Math.sin(time * 5) * 0.3;
  g.pixels(EYES.rear[look], map, bx + 0.1 + bob, -2.2);
  g.pixels(EYES.front[look], map, bx + 2.6 + bob, -2.2);
  if (winding || lunging) {
    g.dot(bx + 2.4, 2.4, lunging ? 1.7 : 1.2, INNER_FIRE[1]);
    g.dot(bx + 2.6, 2.5, lunging ? 0.9 : 0.5, INNER_FIRE[3]);
  } else g.pixels(MOUTH, { m: EC.bodyDeep }, bx + 1.2, 1.6);
  s.commit(false);
  moonlight(s);
  g.finish(EC.outline);
  return s;
}
