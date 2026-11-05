import type { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { AC, VOID } from "./colors";
import { block, fang, glowEye } from "./paint";
import { RISE, SINK } from "./stalker";

/** the shadow pool a stalker sinks into: a flat ink puddle with a crimson lip, cracking with light before it rises */
export function drawStalkerPool(s: SpriteCanvas, e: Enemy, t: number): void {
  const time = t + e.seed;
  const heat = e.state === "charge" ? clamp(e.st / (0.65 * waveScale(game.wave).windup)) : 0;
  const fade = e.state === "hop" ? 1 - clamp(e.st / RISE) : e.state === "burrow" && e.n === 0 ? clamp(e.st / SINK) : 1;
  const half = Math.round((7 + heat * 3) * fade);
  if (half < 2) return;
  s.begin();
  // the ink surface: a wide floor row and a narrower raised row, each with a crimson lip at its ends
  block(s, -half, 0, half * 2 + 1, 1, AC.rimSoft);
  block(s, -half + 2, 0, half * 2 - 3, 1, AC.bodyDark);
  block(s, -half + 2, 0.5, half * 2 - 3, 0.5, AC.bodyDeep);
  if (half > 2) {
    block(s, -half + 3, -1, half * 2 - 5, 1, AC.rimSoft);
    block(s, -half + 5, -1, Math.max(0, half * 2 - 9), 1, AC.body);
    block(s, -half + 5, -1, Math.max(0, half * 2 - 9), 0.5, AC.sheen);
  }
  // ripples crawl across the surface, a bright glint riding each
  const r = Math.sin(time * 5) * (half - 3);
  block(s, r - 0.5, -1, 1.5, 0.5, AC.rim);
  block(s, -r - 0.5, 0, 1.5, 0.5, AC.rimSoft);
  if (e.state === "charge") {
    // cracks of void light run out from the middle, brighter and longer as the rise nears
    const c = heat > 0.7 ? VOID[5] : heat > 0.35 ? VOID[4] : VOID[3];
    const reach = heat * half;
    for (const side of [-1, 1]) {
      for (let i = 0; i <= reach * 2; i++) {
        const x = (side * i) / 2;
        const y = Math.floor(i / 2) % 3 === (side > 0 ? 0 : 1) ? -1 : 0;
        block(s, x - 0.25, y + 0.25, 0.5, 0.5, c);
      }
    }
    block(s, -0.5, -0.5, 1, 1, heat > 0.5 ? VOID[5] : VOID[4]);
    // claw tips poke out of the pool, lit on their leading edge
    const tip = heat * 4;
    if (tip >= 0.5)
      for (const x of [-3, 3]) {
        fang(s, [x + 0.5, -1], [x + 0.5 + Math.sign(x) * 0.6, -1 - tip], 1, AC.claw);
        block(s, x, -1 - tip + 0.5, 0.5, tip - 0.5, AC.clawLight);
      }
  }
  if (e.state !== "hop") {
    // the eyes watch from the shadow, turning white hot as it gathers to rise
    const eye = heat > 0.5 ? AC.eyeHot : AC.eye;
    const f = Math.sign(e.face);
    glowEye(s, 1.5 + f, -1.5, eye, heat > 0.5 ? AC.eye : AC.eyeDim, AC.eyeHot);
    glowEye(s, 3.5 + f, -1.5, eye, heat > 0.5 ? AC.eye : AC.eyeDim, AC.eyeHot);
  }
  s.commit(false);
}
