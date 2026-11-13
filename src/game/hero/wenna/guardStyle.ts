import { PAL } from "../../../constants/palette";
import { FLARE_BACK, LANTERN_GUARD } from "../../../constants/wenna/guard";
import { SHOULDER_Y } from "../../../constants/wenna/lamp";
import type { GuardStyle } from "../../../types/moveset";
import { dealDamage } from "../../damage";
import { createFlameCone } from "../../effects/wenna/flameCone";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero, lights, progress } from "../../state";
import { cappedWicks, relight, spawnWick, weakestWick, wickCap } from "./wicks";

/** a foe in front of her, within the flash's reach */
function inFlash(cx: number, cy: number): boolean {
  const ahead = (cx - hero.x) * hero.face;
  return ahead > -6 && ahead < FLARE_BACK.reach && Math.abs(cy - (hero.y - SHOULDER_Y)) < FLARE_BACK.rise;
}

/** the flash blinds every foe ahead (the big ones only a moment) and burns it a little */
function flash(): void {
  const y = hero.y - SHOULDER_Y;
  const cone = { x: hero.x + hero.face * 6, y, face: hero.face, near: 2, far: FLARE_BACK.reach, half: FLARE_BACK.half };
  game.fx.push(createFlameCone({ ...cone, power: 1.2 }));
  lights.add(hero.x + hero.face * 30, y, 56, PAL.wick[4], 0.55, 0.25);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (!inFlash(cx, cy)) continue;
    const big = e.rank === "mini" || e.rank === "boss";
    e.blind = Math.max(e.blind, big ? FLARE_BACK.bigBlind : FLARE_BACK.blind);
    dealDamage(e, progress.stats.ap * FLARE_BACK.power, { fromX: hero.x, kx: hero.face * FLARE_BACK.kx });
  }
}

/** a Wick rises at her feet for free; at the cap her weakest Wick flares back to full instead */
function wickAtFeet(): void {
  if (cappedWicks().length < wickCap()) {
    spawnWick(hero.x, hero.y, "parry");
    return;
  }
  const w = weakestWick();
  if (w) relight(w);
}

/**
 * Wenna's guard: the lantern raised before her. It blocks cheaply but lets much of a blow through; the parry, Flare
 * Back, throws the shutter open in the attacker's face, blinding the foes ahead, and lights a free Wick at her feet.
 */
export const WENNA_GUARD: GuardStyle = {
  chip: LANTERN_GUARD.chip,
  blockCost: LANTERN_GUARD.blockCost,
  parried() {
    flash();
    wickAtFeet();
  },
};
