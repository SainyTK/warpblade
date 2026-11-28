import { circle, ellipseRing, fleck, glow, glowLine, hairline, line, px, viewX } from "../../../engine/frame";
import { inStageView, stageWalls } from "../../../game/adventure";
import { eachStanding, heroSlot } from "../../../game/coopHooks";
import { heroGuarded } from "../../../game/hero/guard";
import { hurtHero } from "../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../game/state";
import { boxHit, heroBox, shake } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { Platform } from "../../../types/world";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { inView } from "../../../utils/views";
import { SKYWAY_COLORS as S } from "../scene/palette";

export const ROD = { every: 6.5, warn: 1.1, live: 0.1, show: 0.3, tall: 15, reach: 11, damage: 14 } as const;
const SPARKS = [S.boltCore, S.boltEdge, S.boltGlow, S.stormGlow];

let clock = 0;
const struck = new Map<string, number>();

export const rodX = (wall: Platform): number => Math.round((wall.x0 + wall.x1) / 2);
const offsetOf = (x: number): number => grain(x, 41) * ROD.every;
const cycleOf = (x: number): number => (clock + offsetOf(x)) / ROD.every;

export function resetRods(): void {
  clock = 0;
  struck.clear();
}

function strikeBox(wall: Platform): readonly [number, number, number, number] {
  return [wall.x0 - 3, -20, wall.x1 + 3, wall.y + 1];
}

const SCREEN_MARGIN = 20;

export function updateRods(dt: number): void {
  if (game.mode !== "play") return;
  const before = clock;
  clock += dt;
  for (const wall of stageWalls()) {
    const x = rodX(wall);
    const n = Math.floor(cycleOf(x));
    const wrapped = Math.floor((before + offsetOf(x)) / ROD.every) !== n;
    if (wrapped && inStageView(x, SCREEN_MARGIN)) {
      sfx.thunder();
      shake(0.1, 1.5);
      for (let i = 0; i < 10; i++)
        particles.spawn(PK.SPARK, x, wall.y - 1, fxRng.range(-90, 90), -fxRng.range(40, 130), 0.35, { sparks: SPARKS });
    }
    const age = (cycleOf(x) - n) * ROD.every;
    if (age >= ROD.live) continue;
    eachStanding(() => {
      const key = `${x}:${heroSlot()}`;
      if (struck.get(key) === n || hero.inv > 0 || heroGuarded() || hero.y > wall.y + 2) return;
      if (!boxHit(strikeBox(wall), heroBox())) return;
      struck.set(key, n);
      hurtHero(ROD.damage, x);
    });
  }
}

function rodPost(x: number, y: number, heat: number): void {
  line(x - 2, y - 1, x + 2, y - 1, S.rod[1]);
  line(x, y - 1, x, y - ROD.tall + 3, S.rod[1]);
  hairline(x + 0.5, y - 1, x + 0.5, y - ROD.tall + 3, S.rod[2]);
  line(x - 3, y - ROD.tall + 6, x + 3, y - ROD.tall + 6, S.rod[2]);
  px(x - 3, y - ROD.tall + 7, S.rodRust);
  px(x + 3, y - ROD.tall + 7, S.rodRust);
  ellipseRing(x, y - ROD.tall + 9, 2, 1, S.rod[3]);
  line(x, y - ROD.tall + 2, x, y - ROD.tall, heat > 0.5 ? S.boltCore : S.rod[3]);
  fleck(x + 0.5, y - ROD.tall, heat > 0 ? WHITE : S.rod[4]);
  px(x, y - 4, S.rodRust, 0.6);
}

export function drawRods(): void {
  for (const wall of stageWalls()) {
    const x = rodX(wall);
    if (!inView(viewX(), x, SCREEN_MARGIN)) continue;
    const phase = cycleOf(x);
    const age = (phase - Math.floor(phase)) * ROD.every;
    const warn = clamp((age - (ROD.every - ROD.warn)) / ROD.warn);
    rodPost(x, wall.y, warn);
    if (warn > 0) {
      for (let k = 0; k < 4; k++) {
        const climb = ((game.t * 3 + k / 4) % 1) * (ROD.tall - 2);
        fleck(x + (k % 2 ? 1 : -0.5), wall.y - 1 - climb, S.boltEdge, warn);
      }
      ellipseRing(x, wall.y, ROD.reach * (1.4 - warn * 0.4), 2, warn > 0.8 ? S.boltCore : S.boltEdge, 0.4 + warn * 0.6);
      for (let y = wall.y - ROD.tall - 4; y > 0; y -= 7)
        if ((y + game.t * 30) % 14 < 7) px(x, y, S.boltEdge, warn * 0.4);
      glow(x, wall.y - ROD.tall, 10 + warn * 10, S.boltGlow, 0.25 + warn * 0.35);
    }
  }
}

export function drawRodBolts(): void {
  for (const wall of stageWalls()) {
    const x = rodX(wall);
    if (!inView(viewX(), x, SCREEN_MARGIN)) continue;
    const phase = cycleOf(x);
    const n = Math.floor(phase);
    const age = (phase - n) * ROD.every;
    if (age > ROD.show) continue;
    const f = 1 - age / ROD.show;
    const flick = age > 0.06 && age < 0.1 ? 0.3 : 1;
    let bx = x + (grain(n, x) - 0.5) * 20;
    let by = -6;
    const tipY = wall.y - ROD.tall;
    for (let k = 1; k <= 7; k++) {
      const nx = k === 7 ? x : x + (grain(n + k, x) - 0.5) * 16 * (1 - k / 7);
      const ny = -6 + ((tipY + 6) * k) / 7;
      line(bx, by, nx, ny, age < 0.07 ? WHITE : S.boltEdge, f * flick);
      hairline(bx + 0.5, by, nx + 0.5, ny, S.boltCore, f * flick);
      bx = nx;
      by = ny;
    }
    if (age < 0.12)
      for (const side of [-1, 1]) {
        hairline(x, tipY, x + side * 6, wall.y - 4, S.boltCore);
        hairline(x + side * 6, wall.y - 4, x + side * ROD.reach, wall.y, S.boltEdge);
      }
    circle(x, tipY, 2, WHITE, f);
    glowLine(x, 0, x, tipY, 10, S.boltGlow, 0.5 * f);
    glow(x, wall.y - 6, 26, S.boltEdge, 0.6 * f);
  }
}
