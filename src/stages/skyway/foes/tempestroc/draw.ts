import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_FOES as C } from "../colors";
import { featherWing, type WingStyle } from "../wing";
import { type At, body, head, type RocPose, tail, talons, veins } from "./look";
import { ROC_STORM_WINDUP, ROC_WINDUP, stormy } from "./moves";

const canvas = detailCanvas(76, 92, 38, 48);
const WING: WingStyle = { span: 34, chord: 14, fingers: 7, feathers: C.roc, tip: C.volt[3], tipHot: C.volt[4] };
const RAISED = -Math.PI / 2 - 0.45;
const LOWERED = Math.PI / 2 + 0.3;
const FOLDED = Math.PI - 0.3;

function windShare(e: Enemy, move: keyof typeof ROC_WINDUP): number {
  const storm = stormy(e) ? ROC_STORM_WINDUP : 1;
  return clamp(e.st / (ROC_WINDUP[move] * storm * waveScale(game.wave).windup));
}

function poseOf(e: Enemy, time: number): RocPose {
  const storm = stormy(e);
  const calm: RocPose = {
    flap: Math.sin(time * 4.6),
    spread: 1,
    tilt: Math.sin(time * 1.3) * 0.04,
    charge: 0,
    open: 0,
    headBack: 0,
    reach: 0,
    storm,
  };
  if (e.state === "charge") {
    const u = windShare(e, "gust");
    return { ...calm, flap: -1 + Math.sin(time * 30) * 0.05 * u, tilt: -0.18 * u, charge: u, headBack: 2 * u };
  }
  if (e.state === "swipe") return { ...calm, flap: Math.sin(time * 15), tilt: -0.12, open: 0.4, charge: 0.6 };
  if (e.state === "dive") {
    const u = windShare(e, "swoop");
    return { ...calm, flap: lerp(calm.flap, -0.6, u), spread: 1 - u * 0.4, tilt: 0.18 * u, charge: u, reach: u * 0.5 };
  }
  if (e.state === "lunge") {
    const tilt = Math.atan2(e.vy, Math.abs(e.vx) || 1) * 0.7;
    return { ...calm, flap: 0, spread: 0.1, tilt, charge: 1, reach: 1, open: 0.5 };
  }
  if (e.state === "summon") {
    const u = windShare(e, "strikes");
    return { ...calm, flap: -0.35 + Math.sin(time * 20) * 0.08, tilt: -0.3 * u, open: u, headBack: 3 * u, charge: u };
  }
  if (e.state === "volley") {
    const u = windShare(e, "volley");
    return { ...calm, flap: -0.9, tilt: -0.1 * u, charge: u, headBack: u };
  }
  if (e.state === "shoot") return { ...calm, flap: 0.9, tilt: 0.1, open: 0.3, charge: 0.4 };
  if (e.state === "wind") {
    const u = windShare(e, "breath");
    return {
      ...calm,
      flap: -0.5 + Math.sin(time * 6) * 0.2,
      headBack: 4 * u,
      open: u * 0.5,
      charge: u,
      tilt: -0.15 * u,
    };
  }
  if (e.state === "beam") return { ...calm, flap: -0.3, open: 1, charge: 1, tilt: 0.12 };
  if (e.state === "blink") return { ...calm, flap: -0.8 + Math.sin(time * 40) * 0.1, open: 1, headBack: 3, charge: 1 };
  if (e.state === "recover") return { ...calm, flap: Math.sin(time * 7), tilt: 0.08 };
  return calm;
}

function wingAngle(p: RocPose): number {
  if (p.spread < 0.2) return FOLDED;
  return lerp(RAISED, LOWERED, (p.flap + 1) / 2);
}

export function drawTempestroc(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const cos = Math.cos(p.tilt);
  const sin = Math.sin(p.tilt);
  const at: At = (x, y) => [x * cos - y * sin, x * sin + y * cos];
  const angle = wingAngle(p) + p.tilt;
  const [rx, ry] = at(-1, -5);
  const farAngle = angle - 0.3;
  s.clear();
  featherWing(s, { x: rx - 2, y: ry - 1, angle: farAngle, spread: p.spread, dim: 0.6, charge: p.charge }, WING);
  tail(s, at, time, p.storm);
  talons(s, at, p.reach);
  body(s, at);
  head(s, at, p, time);
  featherWing(s, { x: rx, y: ry, angle, spread: p.spread, dim: 1, charge: p.charge }, WING);
  if (p.storm) {
    const span = WING.span * (0.45 + 0.55 * p.spread);
    const tips = [
      [rx + Math.cos(angle) * span, ry + Math.sin(angle) * span],
      [rx - 2 + Math.cos(farAngle) * span * 0.8, ry - 1 + Math.sin(farAngle) * span * 0.8],
    ] as const;
    veins(s, at, time, tips);
  }
  s.outline(C.outline);
  return s;
}
