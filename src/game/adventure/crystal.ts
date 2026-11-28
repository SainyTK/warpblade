import { FLYER_REACH } from "../../constants/campaign";
import { CRYSTAL, HERO_HUNT_RANGE } from "../../constants/defense";
import { PAL } from "../../constants/palette";
import { GROUND } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { createFloorRing } from "../effects/floorRing";
import { kindOf } from "../enemies/kinds";
import { besiegingFoe, setBesiegingFoe } from "../foeTarget";
import { game, hero, lights, showBanner } from "../state";
import { shake } from "../world";
import { defense } from "./defense";

const HERO_HEIGHT_WEIGHT = 0.5;
const besiegers = new WeakSet<Enemy>();

function huntsHero(e: Enemy): boolean {
  if (hero.state === "dead") return false;
  const gap = Math.abs(hero.x - e.x) + Math.abs(hero.y - e.y) * HERO_HEIGHT_WEIGHT;
  return gap <= HERO_HUNT_RANGE[e.rank];
}

export function actOnFoe(e: Enemy, act: () => void): void {
  const run = defense;
  if (!run || run.end || huntsHero(e)) {
    besiegers.delete(e);
    act();
    return;
  }
  besiegers.add(e);
  const saved = { ...hero };
  Object.assign(hero, { x: run.crystal.x, y: GROUND, vx: 0, vy: 0, ground: true, inv: 0, move: null });
  hero.state = "idle";
  setBesiegingFoe(e);
  try {
    act();
  } finally {
    setBesiegingFoe(null);
    Object.assign(hero, saved);
  }
}

function shatter(): void {
  const run = defense;
  if (!run) return;
  run.end = "shattered";
  run.endIn = CRYSTAL.shatterSeconds;
  const y = GROUND - CRYSTAL.floatY - CRYSTAL.height / 2;
  game.fx.push(createFloorRing(run.crystal.x, GROUND, 70, PAL.crystal, 0.9));
  lights.add(run.crystal.x, y, 120, PAL.crystal[4], 1, 1.2);
  shake(0.6, 4);
  sfx.defeat();
  showBanner("The Warp crystal shattered", CRYSTAL.shatterSeconds);
}

export function damageCrystal(amount: number): void {
  const run = defense;
  if (!run || run.end || amount <= 0) return;
  const crystal = run.crystal;
  crystal.hp = Math.max(0, crystal.hp - amount);
  crystal.flash = CRYSTAL.flashSeconds;
  crystal.lastHitAt = game.t;
  if (crystal.hp <= 0) shatter();
}

export function strikeCrystal(amount: number): boolean {
  const foe = besiegingFoe();
  const run = defense;
  if (!foe || !run) return false;
  const crystal = run.crystal;
  const last = crystal.struckBy.get(foe) ?? Number.NEGATIVE_INFINITY;
  if (game.t - last < CRYSTAL.secondsBetweenHitsByOneFoe) return true;
  crystal.struckBy.set(foe, game.t);
  damageCrystal(amount * CRYSTAL.strikeShare);
  return true;
}

function pressing(e: Enemy, x: number): boolean {
  return e.hp > 0 && besiegers.has(e) && Math.abs(e.x - x) <= CRYSTAL.siegeReach;
}

export function updateSiege(dt: number): void {
  const run = defense;
  if (!run) return;
  const crystal = run.crystal;
  crystal.flash = Math.max(0, crystal.flash - dt);
  if (run.end) return;
  let chip = 0;
  for (const e of game.enemies) {
    if (!pressing(e, crystal.x)) continue;
    chip += CRYSTAL.siegeDamagePerSecond * e.power * dt;
    if (kindOf(e.type).flies && !e.air && e.y < FLYER_REACH.lowestY)
      e.y = Math.min(FLYER_REACH.lowestY, e.y + FLYER_REACH.sinkPerSecond * dt);
  }
  if (chip > 0) damageCrystal(chip);
}
