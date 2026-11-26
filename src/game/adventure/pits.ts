import { PIT_FALL } from "../../constants/campaign";
import { GROUND, H } from "../../constants/stage";
import { drillFighter } from "../../drill";
import { sfx } from "../../services/audio";
import { game, hero, ponytail, progress, scarf, showBanner } from "../state";
import { shake } from "../world";
import { overPit, trail } from "./trail";

const SAFE_MARGIN = 14;

function firmFooting(x: number): boolean {
  return !overPit(x - SAFE_MARGIN) && !overPit(x + SAFE_MARGIN) && !overPit(x);
}

export function updatePits(): void {
  if (!trail || game.mode !== "play" || hero.state === "dead") return;
  if (hero.ground && hero.y >= GROUND - 0.5 && firmFooting(hero.x)) trail.safeX = hero.x;
  if (hero.ground && hero.y < GROUND - 0.5) trail.safeX = hero.x;
  if (hero.y < H + PIT_FALL.below) return;
  const lost = Math.ceil(progress.stats.hp * PIT_FALL.hpShare);
  hero.hp = Math.max(1, hero.hp - lost);
  scarf.shift(trail.safeX - hero.x, GROUND - hero.y);
  ponytail.shift(trail.safeX - hero.x, GROUND - hero.y);
  Object.assign(hero, { x: trail.safeX, y: GROUND, vx: 0, vy: 0, ground: true, inv: PIT_FALL.invulnerable });
  const fighter = drillFighter();
  if (fighter) Object.assign(fighter, { x: trail.safeX, y: GROUND, vx: 0, vy: 0, grounded: true, dashTime: 0 });
  shake(0.2, 2);
  sfx.hurt();
  showBanner(`-${lost} HP`, 0.9);
}

export function enemyOverPit(x: number): boolean {
  return overPit(x);
}
