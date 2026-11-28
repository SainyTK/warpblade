import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { SCRIVENER, SCRIVENER_HITS } from "./moves";
import { QUILL_TIP } from "./pose";
import { scatterPages } from "./scatter";
import { createWrit } from "./writ";

function startBlink(e: Enemy): void {
  Object.assign(e, { state: "blink", st: 0, vx: 0, n: SCRIVENER.blinkEvery, ax: e.x, ay: 0 });
  scatterPages(e.x, e.y - 16);
  sfx.evade();
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const sees = foeSees(e);
  const want = !sees ? 1 : gap < SCRIVENER.near ? -1 : gap > SCRIVENER.far ? 1 : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : e.face * SCRIVENER.pace * want, 140 * dt);
  if (hero.state === "dead" || !sees) return;
  if (gap < SCRIVENER.close && e.n <= 0) return startBlink(e);
  if (e.cd > 0 || !facesHero(e)) return;
  if (gap < SCRIVENER.stabReach + 4) Object.assign(e, { state: "charge", st: 0 });
  else if (gap < SCRIVENER.cast) Object.assign(e, { state: "wind", st: 0 });
}

function stab(e: Enemy): void {
  const reach = SCRIVENER.stabReach;
  const box =
    e.face > 0 ? ([e.x, e.y - 24, e.x + reach, e.y - 6] as const) : ([e.x - reach, e.y - 24, e.x, e.y - 6] as const);
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(SCRIVENER_HITS.stab * e.power, e.x);
  });
  sfx.swing(1.2);
}

function blink(e: Enemy): void {
  const [out, back] = SCRIVENER.vanish;
  if (e.st >= out && e.ax === e.x) {
    const away = -Math.sign(hero.x - e.x) || -e.face;
    e.x = clampStageX(e.x + away * SCRIVENER.blinkHop, 14);
    if (e.x === e.ax) e.x = clampStageX(e.x - away * SCRIVENER.blinkHop, 14);
    e.face = Math.sign(hero.x - e.x) || e.face;
  }
  if (e.st >= back && e.ay === 0) {
    e.ay = 1;
    scatterPages(e.x, e.y - 16);
  }
  if (e.st >= SCRIVENER.blink) Object.assign(e, { state: "walk", st: 0, cd: Math.max(e.cd, 0.6) });
}

export function updateScrivener(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  e.n = Math.max(0, e.n - dt);
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.6 * ts)) {
      const [qx, qy] = QUILL_TIP.raised;
      particles.spawn(PK.MOTE, e.x + e.face * qx + fxRng.range(-5, 5), e.y + qy + fxRng.range(-5, 5), 0, -16, 0.4, {
        col: FOE.letter,
        size: 0.6,
      });
    }
    if (e.st >= SCRIVENER.write * windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      game.fx.push(createWrit(e.x + e.face * 12, e.face, SCRIVENER_HITS.writ * e.power));
      sfx.chime(3);
    }
  } else if (e.state === "shoot") {
    if (e.st >= SCRIVENER.scrawl) Object.assign(e, { state: "recover", st: 0, ay: SCRIVENER.recover });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, -e.face * 8, 300 * dt);
    if (e.st >= SCRIVENER.stabWind * windup) {
      Object.assign(e, { state: "swipe", st: 0, vx: e.face * 60 });
      stab(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= SCRIVENER.stab) Object.assign(e, { state: "recover", st: 0, ay: SCRIVENER.stabRecover });
  } else if (e.state === "blink") blink(e);
  else if (e.st >= e.ay)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.5, 2.4) * waveScale(game.wave).cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(SCRIVENER_HITS.touch * e.power, e.x);
  });
}

export const scrivenerHidden = (e: Enemy): boolean =>
  e.state === "blink" && e.st >= SCRIVENER.vanish[0] && e.st < SCRIVENER.vanish[1];
