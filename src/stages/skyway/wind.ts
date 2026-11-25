import { drillFighter } from "../../drill";
import { heroGuarded } from "../../game/hero/guard";
import { moveHeroX } from "../../game/hero/terrain";
import { game, hero } from "../../game/state";
import { clamp } from "../../utils/math";

const AIR_MOST = 190;
const BRACED = 0.35;

export function pushHero(air: number, ground: number, dt: number): void {
  if (hero.state === "dead") return;
  const brace = heroGuarded() ? BRACED : 1;
  const fighter = drillFighter();
  if (!hero.ground) {
    const kick = air * brace * dt;
    hero.vx = clamp(hero.vx + kick, -AIR_MOST, AIR_MOST);
    if (fighter) fighter.vx = clamp(fighter.vx + kick, -AIR_MOST, AIR_MOST);
    return;
  }
  if (ground === 0) return;
  hero.x = moveHeroX(hero.x, hero.y, hero.x + ground * brace * dt);
  if (fighter) fighter.x = hero.x;
}

const BREEZE_HOLD = 0.1;
const breeze = { dir: -1, force: 0, at: -1 };

export function blowBreeze(dir: number, force: number): void {
  Object.assign(breeze, { dir, force, at: game.t });
}

export function breezeNow(): { dir: number; force: number } | null {
  return game.t - breeze.at < BREEZE_HOLD ? { dir: breeze.dir, force: breeze.force } : null;
}
