import { GROUND, W } from "../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, polygon, px } from "../../../engine/frame";
import { heroGuarded } from "../../../game/hero/guard";
import { hurtHero } from "../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../game/state";
import { boxHit, heroBox, shake } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import { scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, ease } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { SCENE } from "../scene/palette";
import { BOOK_SPOTS } from "./places";

const CYCLE = { rest: 3.4, mark: 1.05, fall: 0.32, lie: 0.7 } as const;
const PERIOD = CYCLE.rest + CYCLE.mark + CYCLE.fall + CYCLE.lie;
const DROP = { from: -14, half: 7, height: 9, damage: 12 } as const;
const MARK = { radius: 9 } as const;

type Stage = "rest" | "mark" | "fall" | "lie";

interface Moment {
  stage: Stage;
  k: number;
  cycle: number;
}

function momentAt(t: number, x: number): Moment {
  const shifted = t + x * 0.047;
  const cycle = Math.floor(shifted / PERIOD);
  let s = shifted - cycle * PERIOD;
  if (s < CYCLE.rest) return { stage: "rest", k: s / CYCLE.rest, cycle };
  s -= CYCLE.rest;
  if (s < CYCLE.mark) return { stage: "mark", k: s / CYCLE.mark, cycle };
  s -= CYCLE.mark;
  if (s < CYCLE.fall) return { stage: "fall", k: s / CYCLE.fall, cycle };
  s -= CYCLE.fall;
  return { stage: "lie", k: s / CYCLE.lie, cycle };
}

const bookY = (k: number): number => DROP.from + (GROUND - DROP.from) * ease.outQuad(k) ** 1.6;
const struck = new Map<number, number>();
const landed = new Map<number, number>();

export function resetBooks(): void {
  struck.clear();
  landed.clear();
}

function splash(x: number): void {
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-6, 6),
      GROUND - 1,
      fxRng.range(-60, 60),
      -fxRng.range(40, 110),
      fxRng.range(0.3, 0.5),
      { sparks: [SCENE.waterLit, SCENE.water, SCENE.ink[3], SCENE.ink[2]], size: 1 },
    );
  for (let i = 0; i < 4; i++)
    particles.spawn(PK.FLAKE, x + fxRng.range(-4, 4), GROUND - 6, fxRng.range(-30, 30), -fxRng.range(20, 50), 0.9, {
      col: SCENE.page[3],
      size: 1.2,
    });
}

export function updateBooks(): void {
  if (game.mode !== "play" || hero.state === "dead") return;
  for (const x of BOOK_SPOTS) {
    const m = momentAt(game.t, x);
    if (m.stage === "lie" && landed.get(x) !== m.cycle) {
      landed.set(x, m.cycle);
      if (Math.abs(x - hero.x) < W) {
        splash(x);
        shake(0.08, 1);
        sfx.block();
      }
    }
    if (m.stage !== "fall" && m.stage !== "lie") continue;
    if (m.stage === "lie" && m.k > 0.15) continue;
    if (struck.get(x) === m.cycle || heroGuarded()) continue;
    const y = m.stage === "fall" ? bookY(m.k) : GROUND;
    if (!boxHit([x - DROP.half, y - DROP.height, x + DROP.half, y], heroBox())) continue;
    struck.set(x, m.cycle);
    hurtHero(DROP.damage * waveScale(game.wave).damage, x);
  }
}

function tome(x: number, y: number, k: number, seed: number): void {
  const cover = SCENE.spines[seed % SCENE.spines.length];
  const tilt = Math.sin(k * 9 + seed) * 1.5;
  polygon(
    [
      [x - 7, y - 8 + tilt],
      [x + 7, y - 8 - tilt],
      [x + 7, y - tilt],
      [x - 7, y + tilt],
    ],
    cover,
  );
  hairline(x - 6, y - 2 + tilt * 0.8, x + 6, y - 2 - tilt * 0.8, SCENE.page[3]);
  hairline(x - 6, y - 1 + tilt * 0.9, x + 6, y - 1 - tilt * 0.9, SCENE.page[2]);
  hairline(x - 7, y - 8 + tilt, x + 7, y - 8 - tilt, scale(cover, 1.5));
  px(x - 1, y - 6, SCENE.gilt);
  px(x, y - 6, SCENE.gilt);
  fleck(x + 6, y - 8 - tilt, SCENE.gilt);
}

function mark(x: number, k: number, t: number): void {
  const pulse = 0.55 + Math.sin(t * 14) * 0.25;
  const size = MARK.radius * (1.3 - 0.3 * ease.outCubic(k));
  ellipseRing(x, GROUND - 0.5, size, size * 0.28, SCENE.gilt, pulse);
  ellipseRing(x, GROUND - 0.5, size * 0.5, size * 0.14, SCENE.flame, pulse * k);
  glow(x, GROUND - 2, 10, SCENE.candleGlow, 0.25 * k);
  for (let i = 0; i < 3; i++) {
    const fall = (t * 50 + i * 37 + x) % 120;
    fleck(x + (grain(i, x) - 0.5) * 10, fall, SCENE.page[3], 0.9);
  }
  const top = clamp(k * 3) * 22;
  hairline(x, 0, x, top, SCENE.gilt, 0.35);
}

export function drawBooks(cameraX: number, t: number): void {
  for (const x of BOOK_SPOTS) {
    if (x < cameraX - 12 || x > cameraX + W + 12) continue;
    const m = momentAt(t, x);
    const seed = Math.floor(grain(m.cycle, x) * 97);
    if (m.stage === "mark") mark(x, m.k, t);
    else if (m.stage === "fall") {
      mark(x, 1, t);
      tome(x, bookY(m.k), m.k, seed);
    } else if (m.stage === "lie") {
      const sink = m.k * 9;
      if (m.k < 0.9) tome(x, GROUND + sink, 0, seed);
    }
  }
}
