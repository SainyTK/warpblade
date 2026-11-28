import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import type { Enemy } from "../../../../types/enemy";
import { knot, neck } from "./drawBody";
import { bud } from "./drawBud";
import { rootLeg } from "./drawLegs";
import { whip } from "./drawWhip";
import { vinePose } from "./pose";

const canvas = detailCanvas(80, 44, 26, 40);

export function drawVinelash(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = vinePose(e, t);
  const walking = e.state === "walk" && Math.abs(e.vx) > 2;
  const gait = walking ? Math.floor(time * 5) % 2 : 0;
  const step = walking ? (gait ? 1.2 : -1.2) : 0;
  const lift = walking ? 0.6 : 0;
  const breath = Math.sin(time * (e.state === "recover" ? 9 : 2.6)) * 0.3;
  const bob = walking && gait ? -0.5 : 0;
  s.clear();
  rootLeg(s, -6, -8 - step, gait ? lift : 0, false);
  rootLeg(s, 3, 4 + step, gait ? 0 : lift, false);
  s.shift(0, bob);
  knot(s, p.hunch, breath, p.bloom > 0.5);
  const head: [number, number] = [6 + p.hunch * 1.5, -24 + Math.abs(p.hunch) * 0.6];
  neck(s, p.hunch, [2, -17], [head[0], head[1] + 2]);
  bud(s, head[0], head[1], p.bloom, time);
  s.shift(0, 0);
  rootLeg(s, -3, -4 + step, gait ? 0 : lift, true);
  rootLeg(s, 6, 8 - step, gait ? lift : 0, true);
  whip(s, p.whip, p.crack);
  s.outline(DC.outline);
  return s;
}
