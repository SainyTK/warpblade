import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { createGlyph } from "./glyph";

export const TOMEGUARD_HITS = { glyph: 14, bash: 15, touch: 7 } as const;
export const TOMEGUARD_MOVES = {
  cast: 0.95,
  release: 0.3,
  bashWind: 0.5,
  bash: 0.18,
  recover: 0.7,
  reach: 24,
  range: { near: 54, far: 92, cast: 150 },
  walk: 18,
} as const;

export const BOOK_POINT = { x: 9, y: -22 } as const;

function release(e: Enemy): void {
  game.fx.push(
    createGlyph(e.x + e.face * (BOOK_POINT.x + 2), e.y + BOOK_POINT.y - 6, e.face, TOMEGUARD_HITS.glyph * e.power),
  );
  sfx.chime(2);
}

function bash(e: Enemy): void {
  const reach = TOMEGUARD_MOVES.reach;
  const box = e.face > 0 ? ([e.x, e.y - 26, e.x + reach, e.y] as const) : ([e.x - reach, e.y - 26, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(TOMEGUARD_HITS.bash * e.power, e.x);
  });
  dust(e.x + e.face * 12, GROUND, 3, e.face);
  shake(0.1, 1.2);
  sfx.swing(0.8);
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const { near, far } = TOMEGUARD_MOVES.range;
  const want = !foeSees(e) ? 1 : gap > far ? 1 : gap < near ? -0.6 : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : e.face * TOMEGUARD_MOVES.walk * want, 160 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  if (gap < TOMEGUARD_MOVES.reach + 4) Object.assign(e, { state: "charge", st: 0 });
  else if (gap < TOMEGUARD_MOVES.range.cast) Object.assign(e, { state: "wind", st: 0 });
}

export function updateTomeguard(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.5 * ts)) {
      const a = fxRng.range(0, Math.PI * 2);
      const bx = e.x + e.face * BOOK_POINT.x;
      const by = e.y + BOOK_POINT.y - 6;
      particles.spawn(
        PK.MOTE,
        bx + Math.cos(a) * 10,
        by + Math.sin(a) * 10,
        -Math.cos(a) * 28,
        -Math.sin(a) * 28,
        0.35,
        {
          col: FOE.glyph[3],
          size: 0.6,
        },
      );
    }
    if (e.pinned > 0) e.st = Math.min(e.st, TOMEGUARD_MOVES.cast * 0.9);
    if (e.st >= TOMEGUARD_MOVES.cast * windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      release(e);
    }
  } else if (e.state === "shoot") {
    if (e.st >= TOMEGUARD_MOVES.release) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, -e.face * 6, 300 * dt);
    if (e.st >= TOMEGUARD_MOVES.bashWind * windup) {
      Object.assign(e, { state: "swipe", st: 0, vx: e.face * 70 });
      bash(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= TOMEGUARD_MOVES.bash) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= TOMEGUARD_MOVES.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.6) * waveScale(game.wave).cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(TOMEGUARD_HITS.touch * e.power, e.x);
  });
}
