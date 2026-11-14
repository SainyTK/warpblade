import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { refundStamina } from "../../../game/hero/stamina";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { surfaceBelow } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import { CRIMSON_SPARKS } from "../constants/colors";
import { FISSURE } from "../constants/heft";
import { SHOCKWAVE } from "../constants/string";
import { createFloorWave } from "./effects/floorWave";
import { addHeft } from "./heft";

const ID = "br_charge";
/** where the dodge started, for Battering Ram's fissure back along its path */
const charge = { from: 0 };
rememberPerSeat(objectMemory(charge, true));

/** the dodge starts: remember where */
function started(): void {
  charge.from = hero.x;
}

/** the dodge passes through a foe: Shoulder Charge's bash, Heft and stamina */
function passed(e: Enemy): void {
  const v = skillValues(ID);
  if (!v.power) return;
  dealDamage(e, progress.stats.ad * v.power, {
    fromX: hero.x,
    kx: hero.face * 90,
    ky: -40,
    stun: v.stun,
    heavy: true,
    melee: true,
  });
  game.fx.push(createImpact(e.x, e.y - 10, hero.face, true, CRIMSON_SPARKS));
  addHeft(v.heft ?? 0);
  if (v.stamina) refundStamina(v.stamina);
}

/** the dodge ends: a shockwave ahead, and with Battering Ram a fissure back along the path */
function ended(): void {
  const v = skillValues(ID);
  if (!v.wave) return;
  const y = surfaceBelow(hero.x, hero.y);
  game.fx.push(
    createFloorWave({
      x: hero.x + hero.face * 8,
      y,
      face: hero.face,
      reach: SHOCKWAVE.reach,
      speed: SHOCKWAVE.speed,
      damage: progress.stats.ad * v.wave,
      stun: SHOCKWAVE.stun,
      kind: "shock",
    }),
  );
  if (!skillEvolved(ID)) return;
  const reach = Math.abs(hero.x - charge.from) + 10;
  game.fx.push(
    createFloorWave({
      x: hero.x,
      y,
      face: -hero.face,
      reach,
      speed: FISSURE.speed,
      damage: progress.stats.ad * v.trail,
      stun: FISSURE.stun,
      kind: "fissure",
    }),
  );
}

/** Shoulder Charge on the shared dodge */
export const BRYNN_DODGE = { started, passed, ended };
