import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { RAIN_FOES as C, STORM_VOLT as V } from "./colors";
import { KITE_WINDUP } from "./stormkite";

const canvas = new SpriteCanvas(44, 48, 22, 16);

/** a living storm kite: a diamond of taut storm hide on violet veins, one eye at the cross, a tail of bows in the wind */
export function drawStormkite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const wind = e.state === "wind";
  const charge = wind ? clamp(e.st / (KITE_WINDUP * waveScale(game.wave).windup)) : 0;
  const flap = wind ? 0 : Math.sin(time * 5) * 1.5;
  const lean = e.state === "dive" ? 2 : 0;
  const top: [number, number] = [2 + lean, -9];
  const front: [number, number] = [8 + lean * 0.5, -1 - flap];
  const bottom: [number, number] = [-1 - lean, 8];
  const back: [number, number] = [-8, -1 + flap];
  s.clear();
  // the tail streams out behind and below, with three bows
  s.begin();
  let px0 = bottom[0];
  let py0 = bottom[1];
  const bows: [number, number][] = [];
  for (let i = 1; i <= 8; i++) {
    const x = bottom[0] - i * 1.4 - lean;
    const y = bottom[1] + i * 2.4;
    const wx = x + Math.sin(time * 7 - i * 0.8) * (0.4 + i * 0.35);
    s.stroke(px0, py0, wx, y, 0.5, C.kiteDark);
    if (i % 3 === 0) bows.push([wx, y]);
    px0 = wx;
    py0 = y;
  }
  s.commit(false);
  s.begin();
  for (const [x, y] of bows) {
    s.stroke(x - 1.8, y - 1, x + 1.8, y + 1, 0.6, C.kiteVein);
    s.set(x, y, C.kiteRim);
  }
  s.commit();
  // the diamond, darker on its lower half, lit on its upper edges
  s.begin();
  s.poly([top, front, bottom, back], C.kite);
  s.poly(
    [
      [top[0], top[1] + 1],
      [front[0] - 1.5, front[1]],
      [0, 0],
      [back[0] + 1.5, back[1]],
    ],
    C.kiteLight,
  );
  s.poly(
    [
      [0, 1],
      [front[0] - 1, front[1] + 0.5],
      [bottom[0], bottom[1] - 0.5],
    ],
    C.kiteDark,
  );
  const vein = wind ? mix(C.kiteVein, WHITE, charge * (Math.sin(t * 60) > 0 ? 1 : 0.5)) : C.kiteVein;
  s.stroke(top[0], top[1] + 1, bottom[0], bottom[1] - 1, 0.4, vein);
  s.stroke(back[0] + 1, back[1], front[0] - 1, front[1], 0.4, vein);
  for (let u = 0.15; u < 0.95; u += 0.12) {
    s.set(top[0] + (front[0] - top[0]) * u, top[1] + (front[1] - top[1]) * u, C.kiteRim);
    s.set(top[0] + (back[0] - top[0]) * u, top[1] + (back[1] - top[1]) * u, C.kiteRim);
  }
  // the eye at the cross of the veins, white hot as the charge gathers
  s.dot(0.5, -0.5, 1.7, C.kiteDark);
  s.set(1, -1, wind ? WHITE : C.eye);
  s.set(0, -1, wind ? V[4] : C.kiteVein);
  s.commit();
  // the gathering charge crackles along its lower edges
  if (wind) {
    s.begin();
    for (let i = 0; i < 4; i++) {
      const u = (Math.sin(t * 37 + i * 2.3) + 1) / 2;
      const left = i % 2 === 0;
      const [ax, ay] = left ? back : front;
      s.set(ax + (bottom[0] - ax) * u, ay + (bottom[1] - ay) * u + 1, charge > 0.6 ? WHITE : V[3]);
    }
    if (charge > 0.3) s.dot(bottom[0], bottom[1] + 1.5, 0.6 + charge, V[3]);
    s.commit(false);
  }
  s.outline(C.outline);
  return s;
}
