import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { refundStamina } from "../../../../game/hero/stamina";
import { objectMemory, rememberPerSeat } from "../../../../game/seatMemory";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PHOSPHOR_SPARKS } from "../../constants/colors";
import { blastAt } from "../blastFoe";

const SKILL = "ca_recoil";
/** the reach of the rounds the dodge fires, how far behind and ahead they go off, and the gap between Backfire Rush's
 *  blasts along the path */
const DODGE_ROUND = { reach: 24, behind: 12, ahead: 16, gap: 22 } as const;

/** where the dodge under way started, for Backfire Rush */
const dash = { fromX: 0 };
rememberPerSeat(objectMemory(dash));

/** a round of the dodge going off at x */
function round(x: number, power: number, dir: number): void {
  blastAt(null, x, hero.y - 16, {
    damage: 0,
    splash: progress.stats.ad * power,
    reach: withCharms("area", DODGE_ROUND.reach),
    kx: dir * 100,
    hot: false,
    big: true,
  });
}

/** Recoil Dash: the dodge fires a round behind as it starts, the kick carrying Calder forward */
function started(): void {
  dash.fromX = hero.x;
  const v = skillValues(SKILL);
  if (v.power) round(hero.x - hero.face * DODGE_ROUND.behind, v.power, -hero.face);
}

/** the dodge passes through a foe: a cut, and stamina back */
function passed(e: Enemy): void {
  const v = skillValues(SKILL);
  if (v.cut) {
    dealDamage(e, progress.stats.ad * v.cut, { fromX: hero.x, kx: hero.face * 40, ky: -30 });
    game.fx.push(createImpact(...enemyCenter(e), hero.face, false, PHOSPHOR_SPARKS));
  }
  if (v.stamina) refundStamina(v.stamina);
}

/** the dodge ends: a blast ahead, and Backfire Rush's line of blasts along the path */
function ended(): void {
  const v = skillValues(SKILL);
  if (v.end) round(hero.x + hero.face * DODGE_ROUND.ahead, v.end, hero.face);
  if (!skillEvolved(SKILL)) return;
  const n = Math.floor(Math.abs(hero.x - dash.fromX) / DODGE_ROUND.gap);
  for (let i = 1; i <= n; i++) round(dash.fromX + hero.face * i * DODGE_ROUND.gap, v.trail, hero.face);
}

/** the dodge's hooks for the kit */
export const RECOIL_DODGE = { started, passed, ended };

/** Recoil Dash's sixth level: the dodge works in the air */
export const recoilAirDodge = (): boolean => !!skillValues(SKILL).air;
