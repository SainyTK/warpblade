import { PYRE_COLONNADE } from "../../../../constants/evolutions";
import { W } from "../../../../constants/stage";
import { RITE_RAMP, RITE_SPARKS } from "../../../../constants/ysra/emberLook";
import { BRAZIER, FLAME_PILLAR, FLARE, RITE_WIDE } from "../../../../constants/ysra/rites";
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

/** the foes within the pillar's seek, nearest first: ahead of her, or on both sides */
function foesNear(bothSides: boolean): Enemy[] {
  const away = (e: Enemy) => (bothSides ? Math.abs(e.x - hero.x) : (e.x - hero.x) * hero.face);
  return game.enemies
    .filter((e) => e.hp > 0 && away(e) >= -6 && away(e) < FLAME_PILLAR.seek)
    .sort((a, b) => away(a) - away(b));
}

/** one pillar at this spot, at this share of its power, shaped by Flame Pillar's level; as Pyre Colonnade with its two
 *  flanks */
function pillarAt(x: number, share: number): void {
  const v = skillValues("y_pillar");
  const shape: PillarShape = {
    ...FLAME_PILLAR,
    power: v.power * share,
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
    const flank = { ...C.flank, power: v.power * share * C.flankShare, column: v.column };
    game.fx.push(castFlamePillar(fx, surfaceBelow(fx, hero.y), flank));
  }
}

/** Flame Pillar: a pillar under each of the nearest foes ahead, as many as its level calls, or one just ahead; the wide
 *  form raises more, weaker pillars under the nearest foes on both sides */
function pillars(wide: boolean): void {
  const count = (skillValues("y_pillar").count ?? 1) + (wide ? RITE_WIDE.pillars : 0);
  const share = wide ? RITE_WIDE.pillarShare : 1;
  const foes = foesNear(wide).slice(0, count);
  if (!foes.length) pillarAt(hero.x + hero.face * FLAME_PILLAR.fallback, share);
  for (const e of foes) pillarAt(e.x, share);
}

/** Flare's wide form: a wider ring at a share of its power that throws foes farther */
const WIDE_FLARE = {
  ...FLARE,
  radius: FLARE.radius * RITE_WIDE.flareRadius,
  power: FLARE.power * RITE_WIDE.flarePower,
  kx: FLARE.kx * RITE_WIDE.flareThrow,
};

/** Cinder Lash's wide form: a lash each way at a share of its power */
function lashBothWays(floor: number): void {
  for (const dir of [hero.face, -hero.face]) game.fx.push(castCinderLash(hero.x, floor, dir, RITE_WIDE.lashShare));
}

/** the rites with a wide form on I held */
const WIDE: ReadonlySet<RiteId> = new Set(["flare", "cinderLash", "flamePillar"]);
export const hasWideForm = (id: RiteId): boolean => WIDE.has(id);

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

/** the rite bursts out where she planted the glaive, in its wide form when `wide` */
export function letLoose(id: RiteId, wide: boolean): void {
  const floor = surfaceBelow(hero.x, hero.y);
  if (id === "flare") game.fx.push(castFlare(hero.x, floor, wide ? WIDE_FLARE : FLARE));
  else if (id === "cinderLash" && wide) lashBothWays(floor);
  else if (id === "cinderLash") game.fx.push(castCinderLash(hero.x, floor, hero.face));
  else if (id === "flamePillar") pillars(wide);
  else if (id === "brazier") brazier();
  else overheat();
}
