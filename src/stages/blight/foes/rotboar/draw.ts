import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { BOAR } from "./colors";
import { drawBack } from "./drawBack";
import { drawHead } from "./drawHead";
import { type BoarPose, boarPose, type Pt } from "./pose";

const canvas = detailCanvas(64, 42, 32, 38);
const H = BOAR.hide;

function leg(s: SpriteCanvas, hip: Pt, hoof: Pt, near: boolean): void {
  const tone = near ? H[3] : H[1];
  const knee: Pt = [(hip[0] + hoof[0]) / 2, (hip[1] + hoof[1]) / 2 - 0.5];
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], near ? 2.1 : 1.8, tone);
  s.stroke(knee[0], knee[1], hoof[0], hoof[1] - 1, near ? 1.2 : 1, tone);
  s.shadeEdges(tone, near ? H[4] : H[2], near ? H[1] : H[0], 1);
  s.commit();
  s.begin();
  s.block(hoof[0] - 1, hoof[1] - 1.5, near ? BOAR.tusk[0] : H[0], 2.5, 1.5);
  s.set(hoof[0] + 1, hoof[1] - 1.5, near ? BOAR.tusk[1] : H[1]);
  s.commit();
}

function torso(s: SpriteCanvas, p: BoarPose): void {
  const by = p.bob;
  const lx = p.lean;
  s.begin();
  s.dot(-8 + lx * 0.5, -11 + by + p.rump, 6, H[2]);
  s.dot(-1 + lx, -12 + by, 7, H[2]);
  s.dot(5 + lx, -12.5 + by, 7, H[2]);
  s.stroke(-9 + lx, -8.5 + by, 7 + lx, -8 + by, 4, H[2]);
  s.shadeEdges(H[2], H[3], H[1], 2);
  s.commit();
  s.begin();
  s.stroke(-9 + lx, -5.5 + by, 8 + lx, -5 + by, 1.4, BOAR.snout[1]);
  s.hairline(-7 + lx, -4.5 + by, 6 + lx, -4 + by, H[0]);
  s.set(-4 + lx, -6 + by, BOAR.snout[2]);
  for (let i = 0; i < 5; i++) {
    const x = -9 + i * 3.6 + lx;
    s.hairline(x, -12 + by + (i % 2), x - 1.5, -9 + by + (i % 2), H[1]);
  }
  s.hairline(4 + lx, -16 + by, 8 + lx, -15 + by, H[4]);
  s.set(2 + lx, -5.5 + by, BOAR.snout[2]);
  s.commit(false);
}

function tail(s: SpriteCanvas, p: BoarPose): void {
  const x = -13 + p.lean * 0.5;
  const y = -13 + p.bob + p.rump;
  s.begin();
  s.taper(x, y, x - 4, y + 3 + p.tail, 0.8, 0.4, H[2], 1);
  s.set(x - 4, y + 3.5 + p.tail, BOAR.bristle[3]);
  s.commit();
}

function streaks(s: SpriteCanvas): void {
  s.begin();
  for (let i = 0; i < 4; i++)
    s.hairline(-16 - i * 2.5, -16 + i * 3.4, -23 - i * 3, -16 + i * 3.4, i % 2 ? BOAR.pustule[2] : H[4]);
  s.commit(false);
}

export function drawRotboar(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const walking = e.state === "walk" && Math.abs(e.vx) > 4;
  const p = boarPose(e, time, walking);
  const lx = p.lean;
  s.clear();
  tail(s, p);
  leg(s, [-8 + lx, -7 + p.bob], p.hind[1], false);
  leg(s, [7 + lx, -7 + p.bob], p.front[1], false);
  torso(s, p);
  drawBack(s, p, time);
  drawHead(s, p, time, e.state === "wind" || e.state === "lunge");
  leg(s, [-7 + lx, -6.5 + p.bob], p.hind[0], true);
  leg(s, [8 + lx, -6.5 + p.bob], p.front[0], true);
  s.outline(BOAR.outline);
  if (e.state === "lunge") streaks(s);
  return s;
}
