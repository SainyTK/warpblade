import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { FOE } from "../colors";
import { letter } from "../letters";
import { drawNeck, INK_SKIN, PAPER_SKIN } from "./drawBody";
import { drawHead, INK_HEAD, LEATHER_HEAD } from "./drawHead";
import { WYRM } from "./moves";
import { wyrmPose } from "./pose";

const canvas = detailCanvas(230, 124, 115, 104);
const POOL = { half: 14, depth: 2.5 } as const;
const MARK = { radius: 13, letters: 6 } as const;

function pool(s: SpriteCanvas, time: number, wide: number): void {
  s.begin();
  const half = POOL.half * wide;
  for (let x = -half; x <= half; x += 0.5) {
    const u = x / half;
    const depth = POOL.depth * Math.sqrt(1 - u * u);
    for (let y = -0.5; y <= depth; y += 0.5) {
      const ripple = Math.sin(x * 0.8 + time * 6) > 0.6 && y < 0;
      s.set(x, y, y < 0 ? (ripple ? FOE.inkSheen : FOE.ink[3]) : FOE.ink[y < 1 ? 2 : 1]);
    }
  }
  s.commit(false);
}

function mark(s: SpriteCanvas, k: number, time: number): void {
  pool(s, time, 0.8 + k * 0.4);
  const pulse = 0.5 + Math.sin(time * (10 + k * 20)) * 0.5;
  const r = MARK.radius * (1.3 - k * 0.3);
  const hot = k > 0.7 && pulse > 0.4;
  s.begin();
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * TAU;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * 0.28;
    s.dot(x, y, 0.7, FOE.ink[0]);
  }
  s.commit(false);
  s.begin();
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * TAU;
    s.dot(Math.cos(a) * r, Math.sin(a) * r * 0.28, 0.4, hot ? WHITE : i % 3 ? FOE.letter : FOE.letterHot);
  }
  for (let i = 0; i < MARK.letters; i++) {
    const a = (i / MARK.letters) * TAU + time * 1.5;
    const rise = ((time * 18 + i * 9) % 40) * k;
    letter(s, Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.2 - rise, i + Math.floor(time * 3), FOE.letter, FOE.letterHot);
  }
  for (let y = -1; y > -WYRM.erupt.height * Math.min(1, k * 1.4); y -= 2.5) {
    const sway = Math.sin(y * 0.4 + time * 9) * 3;
    s.set(sway - 6, y, pulse > 0.5 ? FOE.letter : FOE.eyeDeep);
    s.set(-sway + 6, y, pulse > 0.5 ? FOE.eyeDeep : FOE.letter);
  }
  s.commit(false);
}

function wake(s: SpriteCanvas, time: number): void {
  pool(s, time, 0.45);
  s.begin();
  for (let i = 0; i < 3; i++) {
    const x = -i * 6 + Math.sin(time * 9 + i) * 0.6;
    const h = 4 - i;
    s.poly(
      [
        [x - 2, 0],
        [x + 1.5, -h],
        [x + 2.5, 0],
      ],
      i === 0 ? FOE.paper[4] : FOE.paper[3],
    );
  }
  s.commit();
}

function orbit(s: SpriteCanvas, k: number, head: [number, number], time: number): void {
  s.begin();
  const count = 7;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU + time * (3 + k * 5);
    const r = 16 - k * 6;
    const x = head[0] + Math.cos(a) * r;
    const y = head[1] + Math.sin(a) * r * 0.7;
    const spin = Math.cos(time * 12 + i);
    s.poly(
      [
        [x - 2 * spin, y - 1.4],
        [x + 2 * spin, y - 1.6],
        [x + 2 * spin, y + 1.2],
        [x - 2 * spin, y + 1.4],
      ],
      spin > 0 ? FOE.paper[4] : FOE.paper[2],
    );
    s.set(x, y - 0.5, FOE.text);
  }
  s.commit();
}

export function drawPagewyrm(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const pose = wyrmPose(e, t);
  const skin = pose.inked ? INK_SKIN : PAPER_SKIN;
  const head = pose.inked ? INK_HEAD : LEATHER_HEAD;
  const hot = e.state === "wind" || e.state === "charge" || e.state === "hop" || e.state === "lunge";
  s.clear();
  if (!pose.wake && pose.mark < 0) {
    if (pose.twin) {
      drawNeck(s, pose.twin, skin, time + 1, 0.8);
      drawHead(s, pose.twin, head, hot, time + 1);
    }
    drawNeck(s, pose.main, skin, time, 1);
    drawHead(s, pose.main, head, hot, time);
    if (pose.orbit > 0) orbit(s, pose.orbit, pose.main.head, time);
    s.outline(FOE.outline);
    s.clipBelow(0);
    pool(s, time, 1);
  }
  if (pose.mark >= 0) mark(s, pose.mark, time);
  if (pose.wake) wake(s, time);
  return s;
}
