import { dealDamage } from "../../../../game/damage";
import { createGlint } from "../../../../game/effects/flash";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { addStacks, markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, lights, progress } from "../../../../game/state";
import { shake, surfaceBelow } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";
import { SPELLS } from "../../constants/spells";
import { createDawnLance } from "../effects/lance";
import { aldricFx } from "../fx";
import { aldric } from "../state";
import { foesNear, strikeEach } from "../strike";
import { gainValor, radiant } from "../valor";

/** Dawn Lance: spears of light thrown ahead that pierce, burn and burst; held, a fan of three */
export function castLance(power: number, wide: boolean): void {
  const v = skillValues("al_lance");
  const evolved = skillEvolved("al_lance");
  const ap = progress.stats.ap * power;
  const struck = new Set<Enemy>();
  const landed = { first: true };
  const hx = hero.x + hero.face * 12;
  const hy = hero.y - 20;
  const rises = wide ? SPELLS.lanceFan : [0];
  const count = withBuild("amount", v.count ?? 1);
  for (const rise of rises)
    for (let i = 0; i < count; i++)
      game.fx.push(
        createDawnLance(
          hx - hero.face * i * SPELLS.lanceGap,
          hy - i * 4,
          hero.face,
          {
            pierce: v.pierce ?? 1,
            rise,
            size: evolved ? SPELLS.spearSize : 1,
            hit: (e, x, y) => {
              dealDamage(e, ap * (v.power ?? 0), { fromX: x - hero.face * 8, kx: hero.face * 50, source: "abilities" });
              game.fx.push(createImpact(x, y, hero.face, false, DAWN_SPARKS));
              aldricFx(
                "al_lance",
                "burst",
                { x, y, face: hero.face, reach: 12 },
                {
                  damage: ap * (v.power ?? 0),
                  quiet: !landed.first,
                  sigil: "sword",
                },
              );
              const flight = { x: x - hero.face * 34, y, face: hero.face, toX: x, toY: y };
              aldricFx("al_lance", "trail", flight, { quiet: true });
              if (evolved && landed.first) {
                aldricFx("al_lance", "pillar", { x, y: surfaceBelow(x, y), reach: 30 }, { quiet: true, delay: 0.1 });
              }
              landed.first = false;
              if (v.burn) addStacks(e, "al_lance", { stacks: 1, max: 5, damage: ap * v.burn, every: 0.5, duration: 3 });
              if (v.mark) markFoe(e, "al_lance", 4, v.mark);
            },
            end: (x, y) => {
              if (!v.burst) return;
              strikeEach(foesNear(x, y, v.burst), ap * (v.power ?? 0) * SPELLS.burstShare, {
                fromX: x,
                kx: 40,
                ky: -40,
                source: "abilities",
              });
              game.fx.push(createGlint(x, y, DAWN_RAMP[5], 1));
            },
          },
          struck,
        ),
      );
}

/** Mending Light: he heals, and a ring of light burns the foes around him; held, a wider ring and more healing */
export function castMend(power: number, wide: boolean): void {
  const v = skillValues("al_mend");
  const grow = wide ? SPELLS.mendWide : 1;
  const heal = progress.stats.hp * (v.heal ?? 0) * grow;
  hero.hp = Math.min(progress.stats.hp, hero.hp + heal);
  aldric.mending = withBuild("duration", v.regen ? SPELLS.regenTime : 0);
  const r = withBuild("area", (v.ring ?? 0) * grow);
  const hit = strikeEach(foesNear(hero.x, hero.y - 16, r), progress.stats.ap * (v.power ?? 0) * power, {
    fromX: hero.x,
    kx: 60,
    ky: -30,
    stun: v.stun ?? 0,
    source: "abilities",
  });
  if (skillEvolved("al_mend"))
    for (const e of hit)
      addStacks(e, "al_penance", { ...SPELLS.absolution, damage: progress.stats.ap * SPELLS.absolution.tick });
  if (v.barrier) {
    aldric.barrier = Math.max(aldric.barrier, SPELLS.mendBarrier);
    aldric.barrierBlows = Math.max(aldric.barrierBlows, 1);
  }
  if (v.valor) gainValor(v.valor);
  aldricFx(
    "al_mend",
    "nova",
    { x: hero.x, y: hero.y, face: hero.face, reach: Math.max(18, r * 0.7) },
    {
      damage: progress.stats.ap * (v.power ?? 0) * power + heal * 0.2,
      sigil: "shield",
      lift: 20,
    },
  );
  game.fx.push(createFloorRing(hero.x, hero.y, r, DAWN_RAMP, 0.45));
  game.fx.push(createGlint(hero.x, hero.y - 18, DAWN_RAMP[5], 1));
  lights.add(hero.x, hero.y - 18, r + 10, DAWN_RAMP[4], 0.6, 0.4);
  sfx.chime(4);
}

/** Rallying Cry: a shout that throws foes back in a ring and fills Valor; held, a wider ring */
export function castRally(power: number, wide: boolean): void {
  const v = skillValues("al_rally");
  const r = withBuild("area", (v.radius ?? 0) * (wide ? SPELLS.rallyWide : 1));
  const hit = strikeEach(foesNear(hero.x, hero.y - 16, r), progress.stats.ap * (v.power ?? 0) * power, {
    fromX: hero.x,
    kx: 140,
    ky: -60,
    stagger: 0.6,
    heavy: true,
    source: "abilities",
  });
  for (const e of hit) {
    if (v.blind) e.blind = Math.max(e.blind, v.blind);
    if (v.mark) markFoe(e, "al_rally", 4, v.mark);
  }
  if (v.extend && radiant()) aldric.radiance += v.extend;
  if (v.haste) aldric.rally = withBuild("duration", SPELLS.rallyTime);
  const blow = progress.stats.ap * (v.power ?? 0) * power;
  aldricFx(
    "al_rally",
    "pillar",
    { x: hero.x, y: hero.y, face: hero.face, reach: 34 },
    { damage: blow, sigil: "sun", lift: 36 },
  );
  aldricFx("al_rally", "nova", { x: hero.x, y: hero.y, reach: Math.max(20, r * 0.7) }, { quiet: true, damage: blow });
  if (skillEvolved("al_rally")) {
    for (const side of [-1, 1]) {
      const px = hero.x + side * 26;
      aldricFx("al_rally", "pillar", { x: px, y: hero.y, reach: 26 }, { quiet: true, delay: 0.12 });
    }
  }
  if (skillEvolved("al_rally")) gainValor(999);
  else gainValor(v.valor ?? 0);
  game.fx.push(createFloorRing(hero.x, hero.y, r, DAWN_RAMP, 0.4));
  game.fx.push(createFloorRing(hero.x, hero.y, r * 0.6, DAWN_RAMP, 0.3));
  shake(0.15, 2);
  sfx.boom();
}
