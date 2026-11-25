import { ENEMY_COLORS as EC } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { ellipseRing, fleck, glow, hairline, line, place, polygon, px } from "../../engine/frame";
import { eachStanding } from "../../game/coopHooks";
import { INNER_FIRE } from "../../game/enemies/night/colors";
import { heroGuarded } from "../../game/hero/guard";
import { hurtHero } from "../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../game/state";
import type { Approach, StageHazard } from "../../types/campaign";
import { PK } from "../../types/particle";
import { clamp, ease } from "../../utils/math";
import { floorSites } from "../marsh/floorSites";

const GRAVE = { spacing: 170, phase: 70, sense: 24, reach: 10, rise: 0.75, grasp: 0.45, sink: 0.4, rest: 2.2 } as const;
const HIT = { base: 9, extra: 6 } as const;
const FINGERS = [-2.4, -1, 0.4, 1.8] as const;

interface Grave {
  x: number;
  t: number;
  phase: "idle" | "rise" | "grasp" | "sink" | "rest";
  struck: boolean;
}

let span = 1;
let graves: Grave[] = [];

function feetNear(x: number, reach: number): boolean {
  return Math.abs(hero.x - x) < reach && hero.y >= GROUND - 18 && hero.state !== "dead";
}

function stepGrave(g: Grave, dt: number): void {
  g.t += dt;
  if (g.phase === "idle") {
    let woken = false;
    eachStanding(() => {
      woken = woken || (feetNear(g.x, GRAVE.sense) && hero.ground);
    });
    if (woken) Object.assign(g, { phase: "rise", t: 0, struck: false });
    return;
  }
  if (g.phase === "rise") {
    if (fxRng.chance(dt * 18))
      particles.spawn(PK.DUST, g.x + fxRng.range(-6, 6), GROUND - 1, fxRng.range(-10, 10), -fxRng.range(8, 20), 0.4, {
        col: EC.bodyLight,
        size: fxRng.range(1, 2),
      });
    if (g.t >= GRAVE.rise) Object.assign(g, { phase: "grasp", t: 0 });
    return;
  }
  if (g.phase === "grasp") {
    eachStanding(() => {
      if (g.struck || !feetNear(g.x, GRAVE.reach) || heroGuarded()) return;
      g.struck = true;
      hurtHero(HIT.base + HIT.extra * (g.x / span), g.x);
    });
    if (g.t >= GRAVE.grasp) Object.assign(g, { phase: "sink", t: 0 });
    return;
  }
  if (g.phase === "sink" && g.t >= GRAVE.sink) Object.assign(g, { phase: "rest", t: 0 });
  if (g.phase === "rest" && g.t >= GRAVE.rest) Object.assign(g, { phase: "idle", t: 0 });
}

function reachOf(g: Grave): number {
  if (g.phase === "rise") return 3 * clamp(g.t / GRAVE.rise);
  if (g.phase === "grasp") return 3 + 13 * ease.outBack(clamp(g.t / 0.14));
  if (g.phase === "sink") return 16 * (1 - clamp(g.t / GRAVE.sink));
  return 0;
}

function hand(x: number, height: number, lean: number, curl: number): void {
  const top = GROUND - height;
  polygon(
    [
      [x - 2.2, GROUND],
      [x + 2.2, GROUND],
      [x + 2.6 + lean, top + 4],
      [x - 2.6 + lean, top + 4],
    ],
    EC.body,
  );
  line(x - 2.2, GROUND, x - 2.6 + lean, top + 4, EC.bodyLight);
  line(x + 2.2, GROUND, x + 2.6 + lean, top + 4, EC.bodyDark);
  for (const f of FINGERS) {
    const fx = x + lean + f;
    const tipX = fx + curl * (f < 0 ? 1.2 : -1.2);
    line(fx, top + 4, tipX, top + 1 + Math.abs(f) * 0.4, EC.bodyLight);
    fleck(tipX, top + 0.5 + Math.abs(f) * 0.4, EC.claw);
  }
  hairline(x - 1 + lean, top + 6, x + 1.2 + lean, top + 6.5, EC.crack);
}

function sigil(x: number, t: number, heat: number): void {
  const pulse = 0.35 + 0.25 * Math.sin(t * 3 + x);
  const a = clamp(pulse + heat);
  ellipseRing(x, GROUND + 0.5, 7, 1.6, heat > 0.5 ? INNER_FIRE[3] : INNER_FIRE[1], a);
  hairline(x - 4, GROUND + 0.5, x + 4, GROUND + 0.5, INNER_FIRE[heat > 0.5 ? 2 : 0], a);
  px(x - 6, GROUND - 1, EC.bodyLight);
  px(x - 6, GROUND - 2, EC.bodyLight);
  px(x - 7, GROUND - 2, EC.rim);
  px(x - 5, GROUND - 2, EC.bodyLight);
  glow(x, GROUND - 1, 8 + heat * 14, INNER_FIRE[2], 0.1 + heat * 0.35);
}

export function createMoonlitHazard(areas: readonly Approach[]): StageHazard {
  const layout = floorSites(areas, GRAVE.spacing, GRAVE.phase);
  span = layout.span;
  return {
    reset() {
      graves = layout.xs.map((x) => ({ x, t: 0, phase: "idle", struck: false }));
    },
    update(dt) {
      if (game.mode !== "play") return;
      for (const g of graves) if (Math.abs(g.x - hero.x) < W) stepGrave(g, dt);
    },
    drawBack(cameraX, t) {
      place();
      for (const g of graves) {
        if (g.x < cameraX - 30 || g.x > cameraX + W + 30) continue;
        const heat = g.phase === "rise" ? clamp(g.t / GRAVE.rise) : g.phase === "grasp" ? 1 : 0;
        sigil(g.x, t, heat);
        const height = reachOf(g);
        if (height <= 0.5) continue;
        const curl = g.phase === "grasp" ? clamp(g.t / GRAVE.grasp) * 1.6 : 0;
        hand(g.x - 4, height * 0.85, -1, curl);
        hand(g.x + 4, height, 1, curl);
      }
    },
  };
}
