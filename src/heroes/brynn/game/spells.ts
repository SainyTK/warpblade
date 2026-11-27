import { dealDamage } from "../../../game/damage";
import { createFloorRing } from "../../../game/effects/floorRing";
import { createImpact } from "../../../game/effects/impact";
import { ignite } from "../../../game/enemies/burn";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { shake, surfaceBelow } from "../../../game/world";
import { ARC, CRY, PILLARS } from "../constants/abilities";
import { CRIMSON, CRIMSON_SPARKS } from "../constants/colors";
import { HEFT } from "../constants/heft";
import { createCrescentWave } from "./effects/heavyWave";
import { later } from "./effects/later";
import { createPillars } from "./effects/pillars";
import { brynnFx, CRESCENT, PLANTED, ROAR } from "./fx";
import { addHeft } from "./heft";
import { brynn } from "./state";

/** Ember Arc: tall crimson crescents along the line ahead, one after another; held, a fan of three at once */
export function castArc(power: number, wide: boolean): void {
  const v = skillValues("br_arc");
  const floor = surfaceBelow(hero.x, hero.y);
  const face = hero.face;
  const x = hero.x + face * 12;
  const throwOne = (height: number) =>
    game.fx.push(
      createCrescentWave({
        x,
        y: floor - height,
        face,
        reach: v.reach,
        damage: progress.stats.ap * v.power * power,
        source: "abilities",
        scale: 1.4 + (v.size ?? 0),
        back: skillEvolved("br_arc"),
        onHit: v.burn ? (e) => ignite(e, v.burn) : undefined,
      }),
    );
  const heights = wide ? ARC.fan : [ARC.height];
  const ember = (i: number) => () => {
    const at = { x, y: floor - ARC.height, face, reach: 18 };
    brynnFx("br_arc", "slash", at, { damage: progress.stats.ap * v.power * power, quiet: i > 0, signature: CRESCENT });
  };
  for (let i = 0; i < withBuild("amount", v.count); i++)
    game.fx.push(
      later(i * ARC.gap, () => {
        heights.forEach(throwOne);
        ember(i)();
      }),
    );
}

/** Brand Pillars: a line of crimson pillars bursts from the floor ahead, again with its later levels; held, both ways */
export function castPillars(power: number, wide: boolean): void {
  const v = skillValues("br_pillars");
  const y = surfaceBelow(hero.x, hero.y);
  const shares = [1, v.again ?? 0, skillEvolved("br_pillars") ? v.third : 0].filter((k) => k > 0);
  const count = Math.round(withBuild("amount", v.count));
  const blow = progress.stats.ap * v.power * power;
  for (const face of wide ? [hero.face, -hero.face] : [hero.face])
    shares.forEach((_share, wave) => {
      for (let i = 0; i < count; i++) {
        const at = { x: hero.x + face * (6 + v.gap * (i + 0.5)), y, reach: 30 };
        const lead = wave === 0 && i === 0 && face === hero.face;
        const delay = wave * PILLARS.again + i * PILLARS.every;
        brynnFx("br_pillars", "pillar", at, {
          damage: blow,
          quiet: !lead,
          delay,
          signature: lead ? PLANTED : undefined,
        });
      }
    });
  for (const face of wide ? [hero.face, -hero.face] : [hero.face])
    shares.forEach((share, i) =>
      game.fx.push(
        createPillars({
          x: hero.x + face * 6,
          y,
          face,
          count: Math.round(withBuild("amount", v.count)),
          gap: v.gap,
          every: PILLARS.every,
          delay: i * PILLARS.again,
          damage: progress.stats.ap * v.power * power * share,
          launch: PILLARS.launch,
          burn: v.burn,
          stun: v.stun,
          halt: v.halt,
        }),
      ),
    );
}

/** War Cry: a roar that knocks every foe in reach back and makes them reel, fills Heft, heals, and lifts her damage */
export function castCry(power: number, wide: boolean): void {
  const v = skillValues("br_cry");
  const reach = withBuild("area", v.reach) * (wide ? 1.5 : 1);
  game.fx.push(createFloorRing(hero.x, hero.y, reach, CRIMSON, 0.5));
  game.fx.push(createFloorRing(hero.x, hero.y, reach * 0.6, CRIMSON, 0.35));
  const roar = progress.stats.ap * (v.power ?? 1) * power;
  brynnFx("br_cry", "nova", { x: hero.x, y: hero.y, reach: reach * 0.5 }, { damage: roar, signature: ROAR });
  lights.add(hero.x, hero.y - 20, reach, CRIMSON[4], 0.8, 0.35);
  shake(0.3, 3);
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - hero.x) > reach || Math.abs(e.y - hero.y) > reach * 0.6) continue;
    const dir = Math.sign(e.x - hero.x) || hero.face;
    dealDamage(e, progress.stats.ap * (v.power ?? 0) * power, {
      fromX: hero.x,
      kx: dir * CRY.push,
      stagger: CRY.stagger,
      heavy: true,
      source: "abilities",
    });
    game.fx.push(createImpact(e.x, e.y - 12, dir, false, CRIMSON_SPARKS));
  }
  addHeft(Math.min(v.heft, HEFT.most));
  if (v.heal) hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * v.heal);
  brynn.cry = withBuild("duration", v.time);
}
