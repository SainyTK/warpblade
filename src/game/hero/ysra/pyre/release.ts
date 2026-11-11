import { PYRE_COLONNADE } from "../../../../constants/evolutions";
import { W } from "../../../../constants/stage";
import { RITE_RAMP, RITE_SPARKS } from "../../../../constants/ysra/emberLook";
import { BRAZIER, FLAME_PILLAR } from "../../../../constants/ysra/rites";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import type { PillarShape, RiteId } from "../../../../types/ysra/pyre";
import { createFloorRing } from "../../../effects/floorRing";
import { skillEvolved, skillValues } from "../../../skills/query";
import { plantBrazier } from "../../../spells/rites/brazier";
import { castCinderLash } from "../../../spells/rites/cinderLash";
import { castFlamePillar } from "../../../spells/rites/flamePillar";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero, lights, particles, rng } from "../../../state";
import { surfaceBelow } from "../../../world";
import { startOverheat } from "./heat";

/** the foes ahead within the pillar's seek, nearest first */
function foesAhead(): Enemy[] {
  const ahead = (e: Enemy) => (e.x - hero.x) * hero.face;
  return game.enemies
    .filter((e) => e.hp > 0 && ahead(e) >= -6 && ahead(e) < FLAME_PILLAR.seek)
    .sort((a, b) => ahead(a) - ahead(b));
}

/** one pillar at this spot, shaped by Flame Pillar's level; as Pyre Colonnade with its two flanks */
function pillarAt(x: number): void {
  const v = skillValues("y_pillar");
  const shape: PillarShape = {
    ...FLAME_PILLAR,
    power: v.power,
    halfWidth: FLAME_PILLAR.halfWidth * v.width,
    column: v.column,
    pull: v.pull,
    stand: v.column ? FLAME_PILLAR.stand * 2 : FLAME_PILLAR.stand,
  };
  if (!skillEvolved("y_pillar")) {
    game.fx.push(castFlamePillar(x, surfaceBelow(x, hero.y), shape));
    return;
  }
  const C = PYRE_COLONNADE;
  game.fx.push(castFlamePillar(x, surfaceBelow(x, hero.y), { ...C.main, ...shape, ring: true }));
  for (const side of [-1, 1]) {
    const fx = x + side * C.offset;
    if (fx < C.margin || fx > W - C.margin) continue;
    const flank = { ...C.flank, power: v.power * C.flankShare, column: v.column };
    game.fx.push(castFlamePillar(fx, surfaceBelow(fx, hero.y), flank));
  }
}

/** Flame Pillar: a pillar under each of the nearest foes ahead, as many as its level calls, or one just ahead */
function pillars(): void {
  const count = skillValues("y_pillar").count ?? 1;
  const foes = foesAhead().slice(0, count);
  if (!foes.length) pillarAt(hero.x + hero.face * FLAME_PILLAR.fallback);
  for (const e of foes) pillarAt(e.x);
}

/** Brazier: planted just ahead, shaped by its level; Forge Altar once evolved */
function brazier(): void {
  const v = skillValues("y_brazier");
  const x = hero.x + hero.face * BRAZIER.ahead;
  game.fx.push(
    plantBrazier(x, surfaceBelow(x, hero.y), {
      life: v.life,
      every: v.every,
      shots: v.shots,
      ember: { power: v.ember, burn: v.burn, pierce: v.pierce, source: "y_brazier" },
      aura: v.aura,
      burst: v.burst,
      altar: v.altar,
    }),
  );
}

/** Overheat bursts out of her: a tall ring and a shower of embers */
function overheat(): void {
  startOverheat();
  game.fx.push(createFloorRing(hero.x, hero.y, 44, [...RITE_RAMP].reverse(), 0.6, 0.3));
  lights.add(hero.x, hero.y - 16, 56, RITE_RAMP[4], 0.5, 0.6);
  for (let i = 0; i < 30; i++)
    particles.spawn(PK.SPARK, hero.x, hero.y - 16, rng.range(-200, 200), -rng.range(80, 320), rng.range(0.3, 0.7), {
      sparks: RITE_SPARKS,
    });
  sfx.tone(140, 620, 0.5, "sawtooth", 0.06);
  sfx.noise(0.6, 600, 3000, 0.16, "bandpass", 0.9);
}

/** the rite bursts out where she planted the glaive */
export function letLoose(id: RiteId): void {
  const floor = surfaceBelow(hero.x, hero.y);
  if (id === "flare") game.fx.push(castFlare(hero.x, floor));
  else if (id === "cinderLash") game.fx.push(castCinderLash(hero.x, floor, hero.face));
  else if (id === "flamePillar") pillars();
  else if (id === "brazier") brazier();
  else overheat();
}
