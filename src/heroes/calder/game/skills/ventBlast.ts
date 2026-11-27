import { dealDamage } from "../../../../game/damage";
import { createBlastCore } from "../../../../game/effects/flash";
import { enemyBox } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { fxRng, game, hero, particles, progress } from "../../../../game/state";
import { boxAhead, boxBehind, boxHit } from "../../../../game/world";
import { PK } from "../../../../types/particle";
import type { Box } from "../../../../types/world";
import { GUNSMOKE, PHOSPHOR } from "../../constants/colors";
import { calderFx, calderRing } from "../skillFx";
import { layStacks } from "./stacks";

const SKILL = "ca_vent";
/** the vent's height, its push and stagger, its burn and how far the evolved ring reaches */
const VENT = { top: -36, push: 140, stagger: 0.4, burnStacks: 1, burnMax: 5, ring: 50 } as const;

/** the vent's puff: a flash at the chamber and gunsmoke blown out behind */
function puff(x: number, y: number, dir: number): void {
  game.fx.push(createBlastCore(x, y, PHOSPHOR[4]));
  for (let i = 0; i < 3; i++)
    particles.spawn(PK.SMOKE, x, y, dir * fxRng.range(20, 50), fxRng.range(-20, -5), fxRng.range(0.4, 0.6), {
      col: GUNSMOKE,
    });
}

/** foes inside a box take the vent */
function strike(box: Box, damage: number, dir: number): void {
  const v = skillValues(SKILL);
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
    dealDamage(e, damage, {
      fromX: hero.x,
      kx: dir * (v.knock ? VENT.push : 30),
      ky: -30,
      stagger: v.knock ? VENT.stagger : undefined,
    });
    if (v.burn) layStacks(e, SKILL, VENT.burnStacks, progress.stats.ad * v.burn, VENT.burnMax);
  }
}

/**
 * Vent Blast: each string blow vents the chamber behind Calder, striking foes there; from level 7 it bursts in front
 * too, and Furnace Vent bursts all round him.
 */
export function vent(): void {
  const v = skillValues(SKILL);
  if (!v.power || (!hero.ground && !v.air)) return;
  const damage = progress.stats.ad * v.power;
  const reach = withBuild("area", skillEvolved(SKILL) ? VENT.ring : v.reach);
  puff(hero.x - hero.face * 6, hero.y - 18, -hero.face);
  const y = hero.y - 16;
  const back = { x: hero.x - hero.face * 20, y, face: -hero.face, toX: hero.x - hero.face * reach, toY: y };
  calderFx(SKILL, "trail", back, { damage });
  if (skillEvolved(SKILL)) {
    calderRing(SKILL, "wave", { x: hero.x, y: hero.y, face: hero.face, reach: reach * 0.6 }, { damage, quiet: true });
  }
  if (skillEvolved(SKILL) || v.front) {
    const front = { x: hero.x + hero.face * 20, y, face: hero.face, toX: hero.x + hero.face * reach, toY: y };
    calderFx(SKILL, "trail", front, { damage: damage * (v.front ?? 1), quiet: true });
  }
  strike(boxBehind(0, VENT.top, reach, 2), damage, -hero.face);
  if (skillEvolved(SKILL)) strike(boxAhead(0, VENT.top, reach, 2), damage, hero.face);
  else if (v.front) strike(boxAhead(0, VENT.top, reach, 2), damage * v.front, hero.face);
}
