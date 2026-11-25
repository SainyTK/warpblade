import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { WYRM } from "./moves";

export type Pt = [number, number];

export interface Neck {
  joints: Pt[];
  head: Pt;
  angle: number;
  jaw: number;
}

export interface WyrmPose {
  main: Neck;
  twin: Neck | null;
  inked: boolean;
  mark: number;
  wake: boolean;
  orbit: number;
}

interface Shape {
  reach: number;
  lift: number;
  coil: number;
  jaw: number;
  sway: number;
  tilt: number;
}

const JOINTS = 18;
const IDLE: Shape = { reach: 16, lift: 44, coil: 14, jaw: 0.12, sway: 1, tilt: 0.35 };
const UNDER = -18;

const blend = (a: Shape, b: Shape, k: number): Shape => ({
  reach: lerp(a.reach, b.reach, k),
  lift: lerp(a.lift, b.lift, k),
  coil: lerp(a.coil, b.coil, k),
  jaw: lerp(a.jaw, b.jaw, k),
  sway: lerp(a.sway, b.sway, k),
  tilt: lerp(a.tilt, b.tilt, k),
});

const enraged = (e: Enemy): boolean => e.phase === 2;
export const markTime = (e: Enemy): number => (enraged(e) ? WYRM.mark.enraged : WYRM.mark.calm);

function shapeOf(e: Enemy): Shape {
  const st = e.st;
  switch (e.state) {
    case "burrow": {
      const k = ease.outQuad(clamp(st / WYRM.dive));
      return blend(IDLE, { reach: 34, lift: UNDER, coil: 4, jaw: 0.3, sway: 0, tilt: -1.2 }, k);
    }
    case "blink":
      return { reach: 0, lift: UNDER, coil: 0, jaw: 0, sway: 0, tilt: 0 };
    case "dive": {
      const k = ease.outExpo(clamp(st / WYRM.erupt.rise));
      const close = clamp((st - WYRM.erupt.hurt) / 0.25);
      const settle = clamp((st - WYRM.erupt.hurt) / WYRM.erupt.hold);
      const up = {
        reach: 3,
        lift: lerp(UNDER, WYRM.erupt.height, k),
        coil: 4,
        jaw: 1 - close * 0.8,
        sway: 0,
        tilt: 1.4,
      };
      return blend(up, IDLE, ease.outCubic(settle));
    }
    case "charge": {
      const k = clamp(st / WYRM.storm.wind);
      return blend(IDLE, { reach: 6, lift: 60, coil: 20, jaw: 0.6, sway: 0.4, tilt: 0.6 }, ease.outCubic(k));
    }
    case "shoot":
      return { reach: 16, lift: 56, coil: 16, jaw: 1, sway: 0.3, tilt: 0.2 };
    case "wind": {
      const k = clamp(st / WYRM.wave.wind);
      return blend(IDLE, { reach: -8, lift: 62, coil: 22, jaw: 0.85, sway: 0.2, tilt: 0.9 }, ease.outCubic(k));
    }
    case "swipe": {
      const k = ease.outExpo(clamp(st / WYRM.wave.slam));
      const rear = { reach: -8, lift: 62, coil: 22, jaw: 0.85, sway: 0, tilt: 0.9 };
      return blend(rear, { reach: 34, lift: 5, coil: 6, jaw: 0.2, sway: 0, tilt: -0.9 }, k);
    }
    case "hop": {
      const rise = ease.outCubic(clamp(st / 0.22));
      const k = clamp(st / WYRM.bite.coil);
      const coiled = {
        reach: 10 - 20 * k,
        lift: lerp(UNDER, WYRM.bite.height + 2, rise),
        coil: 24,
        jaw: k,
        sway: 0,
        tilt: 0.15,
      };
      return coiled;
    }
    case "lunge": {
      const k = ease.outExpo(clamp(st / WYRM.bite.strike));
      const snap = st > WYRM.bite.strike * 0.85 ? 0.1 : 1;
      const out = {
        reach: lerp(-10, WYRM.bite.reach, k),
        lift: WYRM.bite.height,
        coil: lerp(24, 3, k),
        jaw: snap,
        sway: 0,
        tilt: 0,
      };
      return out;
    }
    case "summon": {
      const k = clamp(st / WYRM.summon);
      if (k < 0.4) return blend(IDLE, { ...IDLE, lift: UNDER, sway: 0 }, ease.outQuad(k / 0.4));
      if (k < 0.62) return { ...IDLE, lift: UNDER, sway: 0 };
      return blend(
        { ...IDLE, lift: UNDER, jaw: 1, sway: 0 },
        { ...IDLE, lift: 50, jaw: 1 },
        ease.outCubic((k - 0.62) / 0.38),
      );
    }
    default:
      return IDLE;
  }
}

function bezier(a: Pt, b: Pt, c: Pt, d: Pt, u: number): Pt {
  const v = 1 - u;
  return [
    v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0],
    v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1],
  ];
}

function neck(from: Pt, s: Shape, time: number, phase: number): Neck {
  const sway = s.sway * Math.sin(time * 1.6 + phase) * 4;
  const bob = s.sway * Math.sin(time * 2.3 + phase) * 1.5;
  const head: Pt = [s.reach + sway * 0.5, -s.lift + bob];
  const c1: Pt = [from[0] - s.coil + sway, from[1] - Math.max(s.lift, 6) * 0.55];
  const c2: Pt = [s.reach * 0.25 - s.coil * 0.4 - sway, -Math.max(s.lift, 4) * 1.05];
  const joints: Pt[] = [];
  for (let i = 0; i <= JOINTS; i++) joints.push(bezier(from, c1, c2, head, i / JOINTS));
  const [px, py] = joints[JOINTS - 2];
  const tangent = Math.atan2(head[1] - py, head[0] - px);
  return { joints, head, angle: lerp(tangent, -s.tilt, 0.6), jaw: clamp(s.jaw) };
}

function twinOf(e: Enemy, main: Neck, s: Shape, time: number): Neck {
  const fork = main.joints[Math.floor(JOINTS * 0.55)];
  let twin: Shape = {
    ...s,
    reach: s.reach - 26,
    lift: Math.max(UNDER, s.lift - 8),
    coil: s.coil * 0.4,
    sway: s.sway,
    tilt: s.tilt + 0.3,
  };
  if (e.state === "lunge") {
    const k = ease.outExpo(clamp((e.st - WYRM.bite.lag) / WYRM.bite.strike));
    const snap = e.st > WYRM.bite.lag + WYRM.bite.strike * 0.85 ? 0.1 : 1;
    twin = {
      ...twin,
      reach: lerp(-14, WYRM.bite.reach - 6, k),
      lift: WYRM.bite.height - 10,
      coil: lerp(14, 2, k),
      jaw: snap,
    };
  }
  if (e.state === "hop") twin = { ...twin, lift: Math.max(UNDER, s.lift - 10), reach: s.reach - 12, jaw: s.jaw };
  const t = neck(fork, twin, time, 2.1);
  const start = Math.floor(JOINTS * 0.55);
  return { ...t, joints: t.joints.slice(Math.floor(start * 0.3)) };
}

export function wyrmPose(e: Enemy, time: number): WyrmPose {
  const s = shapeOf(e);
  const main = neck([0, 0], s, time, 0);
  const summoning = e.state === "summon";
  const reborn = !summoning || e.st > WYRM.summon * 0.55;
  const inked = enraged(e) && reborn;
  const underground = e.state === "blink" || (e.state === "burrow" && e.st >= WYRM.dive);
  return {
    main,
    twin: inked && !underground ? twinOf(e, main, s, time) : null,
    inked,
    mark: e.state === "blink" ? clamp(e.st / markTime(e)) : -1,
    wake: e.state === "burrow" && e.st >= WYRM.dive,
    orbit: e.state === "charge" ? clamp(e.st / WYRM.storm.wind) : e.state === "shoot" ? 1 : 0,
  };
}

export const headBox = (e: Enemy, n: Neck): [number, number, number, number] => {
  const x = e.x + e.face * n.head[0];
  const y = e.y + n.head[1];
  return [x - 8, y - 7, x + 8, y + 6];
};
