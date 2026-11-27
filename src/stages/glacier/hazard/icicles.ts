import { GROUND, W } from "../../../constants/stage";
import { stageExitX } from "../../../game/adventure";
import { heroGuarded } from "../../../game/hero/guard";
import { hurtHero } from "../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../game/state";
import { boxHit, heroBox, surfaceBelow } from "../../../game/world";
import { PK } from "../../../types/particle";
import { GLACIER as G } from "../colors";
import { drawFallPath, drawIcicle, drawMark, ICICLE, shatter } from "./icicle";
import { ICICLE_SPOTS } from "./spots";

const TOP = 2;
const NOTICE = 30;
const REGROW = { wait: 3.5, grow: 2.5 } as const;
const DAMAGE = { first: 14, extra: 10 } as const;

type Phase = "hang" | "shake" | "fall" | "gone";

interface Icicle {
  x: number;
  phase: Phase;
  t: number;
  y: number;
  vy: number;
  grown: number;
  struck: boolean;
  landing: number;
}

const icicles: Icicle[] = ICICLE_SPOTS.map((x) => ({
  x,
  phase: "hang",
  t: 0,
  y: TOP,
  vy: 0,
  grown: 1,
  struck: false,
  landing: GROUND,
}));

const landingOf = (x: number): number => surfaceBelow(x, TOP + ICICLE.length);

export function resetIcicles(): void {
  for (const c of icicles) Object.assign(c, { phase: "hang", t: 0, y: TOP, vy: 0, grown: 1, struck: false });
}

function fall(c: Icicle, dt: number): void {
  c.vy += ICICLE.gravity * dt;
  c.y += c.vy * dt;
  const tip = c.y + ICICLE.length;
  if (!c.struck && game.mode === "play" && !heroGuarded()) {
    const box = [c.x - ICICLE.hitHalf, c.y + 4, c.x + ICICLE.hitHalf, tip] as const;
    if (boxHit(box, heroBox())) {
      c.struck = true;
      hurtHero(DAMAGE.first + DAMAGE.extra * (c.x / stageExitX()), c.x);
    }
  }
  if (tip < c.landing) return;
  shatter(c.x, c.landing);
  Object.assign(c, { phase: "gone", t: 0, grown: 0 });
}

function step(c: Icicle, dt: number): void {
  c.t += dt;
  if (c.phase === "hang") {
    if (c.grown < 1 || hero.state === "dead" || Math.abs(hero.x - c.x) > NOTICE) return;
    Object.assign(c, { phase: "shake", t: 0, landing: landingOf(c.x) });
  } else if (c.phase === "shake") {
    if (fxRng.chance(dt * 14))
      particles.spawn(PK.FLAKE, c.x + fxRng.range(-4, 4), TOP + 1, fxRng.range(-6, 6), fxRng.range(20, 40), 1.2, {
        col: G.snow[4],
      });
    if (c.t >= ICICLE.shake) Object.assign(c, { phase: "fall", t: 0, y: TOP, vy: 0, struck: false });
  } else if (c.phase === "fall") fall(c, dt);
  else if (c.t >= REGROW.wait) {
    c.grown = Math.min(1, (c.t - REGROW.wait) / REGROW.grow);
    if (c.grown >= 1) Object.assign(c, { phase: "hang", t: 0, y: TOP });
  }
}

export function updateIcicles(dt: number): void {
  for (const c of icicles) step(c, dt);
}

const visible = (x: number, cameraX: number): boolean => x > cameraX - 20 && x < cameraX + W + 20;

export function drawIcicleMarks(cameraX: number): void {
  for (const c of icicles) {
    if (!visible(c.x, cameraX) || (c.phase !== "shake" && c.phase !== "fall")) continue;
    const progress = c.phase === "shake" ? c.t / ICICLE.shake : 1;
    drawMark(c.x, c.landing, progress, G.aurora[3]);
    if (c.phase === "shake") drawFallPath(c.x, TOP + ICICLE.length + 4, c.landing - 4, progress);
  }
}

export function drawIcicles(cameraX: number, t: number): void {
  for (const c of icicles) {
    if (!visible(c.x, cameraX)) continue;
    if (c.phase === "fall") drawIcicle(c.x, c.y, 1, 0);
    else if (c.phase === "shake") drawIcicle(c.x, TOP, 1, Math.sin(t * 70) * (0.5 + c.t));
    else if (c.phase === "hang") drawIcicle(c.x, TOP, 1, 0);
    else drawIcicle(c.x, TOP, c.grown, 0);
  }
}
