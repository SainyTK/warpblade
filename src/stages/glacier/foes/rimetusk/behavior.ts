import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { touchHero } from "../contact";
import { TUSK_COLORS } from "./colors";
import { TUSK, TUSK_HITS } from "./constants";
import { beginCharge, charge, snort, toss } from "./moves";
import { isDazed, recoverFrom, recoveryTime } from "./recovery";

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const pace = (gap > 30 || !foeSees(e)) && e.halt <= 0 ? e.face * TUSK.walk : 0;
  e.vx = approach(e.vx, pace, 120 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead" || Math.abs(hero.y - e.y) > 60) return;
  if (gap < TUSK.near) {
    Object.assign(e, { state: "hop", st: 0 });
    sfx.swing(0.4);
  } else if (gap < TUSK.far) beginCharge(e);
}

function recover(e: Enemy, scale: ReturnType<typeof waveScale>): void {
  if (isDazed(e) && fxRng.chance(0.15))
    particles.spawn(PK.STAR, e.x + e.face * 14 + fxRng.range(-6, 6), e.y - 30, 0, -10, 0.5, {
      col: TUSK_COLORS.tusk[2],
    });
  if (e.st < recoveryTime(e)) return;
  Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.2, 1.9) * scale.cooldown });
}

export function updateRimetusk(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(6 * dt)) snort(e);
    if (fxRng.chance(8 * dt)) dust(e.x - e.face * 10, GROUND, 1, -e.face);
    if (e.st >= TUSK.wind * scale.windup) {
      Object.assign(e, { state: "charge", st: 0, n: 0, ax: e.x });
      sfx.lunge();
    }
  } else if (e.state === "charge") charge(e);
  else if (e.state === "hop") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(4 * dt)) snort(e);
    if (e.st >= TUSK.toss * scale.windup) toss(e);
  } else if (e.state === "swipe") {
    if (e.st >= TUSK.tossActive) recoverFrom(e, "toss");
  } else recover(e, scale);
  if (e.state !== "walk" && e.state !== "charge") e.vx -= e.vx * 4 * dt;
  e.ay = e.x;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (e.state === "walk") touchHero(e, TUSK_HITS.touch);
  if (fxRng.chance(0.06 * ts))
    particles.spawn(
      PK.FLAKE,
      e.x + fxRng.range(-14, 14),
      e.y - fxRng.range(14, 26),
      fxRng.range(-4, 4),
      fxRng.range(4, 10),
      0.8,
      {
        col: TUSK_COLORS.wool[4],
      },
    );
}
