import { KNOCKDOWN } from "../../../constants/brannoc/axe";
import { BERSERK } from "../../../constants/brannoc/moves";
import { RAGE_RAMP } from "../../../constants/characters/brannoc/look";
import { PAL } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import { ULT_LEVELS } from "../../../constants/ultimate";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createQuakeLine } from "../../effects/quakeLine";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { newSwing, shake } from "../../world";
import { setState, settle } from "../actions";
import { brannoc } from "./memory";
import { smear } from "./smear";

/** a foe pushed out to `to` pixels from him over a moment, side to side only */
function pushOut(e: Enemy, to: number): void {
  const side = Math.sign(e.x - hero.x) || hero.face;
  const from = e.x;
  const goal = clamp(hero.x + side * to, 10, W - 10);
  if (Math.abs(goal - hero.x) <= Math.abs(from - hero.x)) return;
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      const u = Math.min(1, t / 0.12);
      if (e.hp > 0) e.x = from + (goal - from) * (1 - (1 - u) ** 2);
      return u < 1;
    },
    draw() {},
  });
}

function begin(level: number, unending: boolean): void {
  brannoc.berserkLevel = level;
  brannoc.unending = unending;
  brannoc.berserkT = 0;
  hero.vx = 0;
  setState("roar");
  roar();
}

/** U: Berserk at a charge level */
export function castBerserk(level: number): void {
  begin(level, false);
}

/** Unending Rage: Berserk that lasts longer, a wider and harder Last Cleave that strikes more than once */
export function castUnendingRage(level: number): void {
  begin(level, true);
}

/** the roar: a crimson ring that pushes minions out, and with Unending Rage's level a stun on every foe in it */
function roar(): void {
  const r = withCharms("area", BERSERK.ring);
  const stun = brannoc.unending ? (skillValues("b_unending").stun ?? 0) : 0;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - hero.x, (cy - (hero.y - 16)) * 0.8) > r) continue;
    if (e.rank === "minion") pushOut(e, BERSERK.push);
    if (stun) e.stun = Math.max(e.stun, stun);
  }
  game.fx.push(createFloorRing(hero.x, hero.y, r, PAL.rage, 0.45));
  lights.add(hero.x, hero.y - 18, 70, PAL.rage[3], 0.8, 0.5);
  sfx.tone(80, 200, 0.35, "sawtooth", 0.07);
  shake(0.25, 2.5);
}

/** seconds of Berserk for the charge level, longer with Unending Rage */
const lasts = (level: number): number =>
  BERSERK.time[level - 1] + (brannoc.unending ? (skillValues("b_unending").extra ?? 0) : 0);

/** the roar under way; untouchable through it, then Berserk begins */
export function runRoar(): void {
  hero.vx = 0;
  if (hero.st < BERSERK.roar) return;
  brannoc.berserkT = lasts(brannoc.berserkLevel);
  emitSkillEvent({ type: "berserk", on: true, level: brannoc.berserkLevel });
  settle();
}

/** Last Cleave: the ring of the level, wider and harder with Unending Rage */
function lastCleaveRing(): void {
  const level = brannoc.berserkLevel;
  const v = brannoc.unending ? skillValues("b_unending") : {};
  const r = withCharms("area", BERSERK.rings[level - 1] * (1 + (v.wider ?? 0)));
  const power = ULT_LEVELS[level - 1].power * BERSERK.share * (progress.stats.ad + progress.stats.ap) * (v.power ?? 1);
  newSwing();
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - hero.x) > r || Math.abs(cy - (hero.y - 14)) > r * 0.8) continue;
    dealDamage(e, power, {
      fromX: hero.x,
      kx: Math.sign(cx - hero.x) * 50,
      launch: e.rank === "minion" && !e.elite ? KNOCKDOWN : undefined,
      stun: e.elite ? 0.8 : undefined,
      heavy: true,
      source: "ultimate",
    });
  }
  smear("cleave", true);
  game.fx.push(createFloorRing(hero.x, hero.y, r, PAL.rage, 0.5));
  lights.add(hero.x, hero.y - 14, r, PAL.rage[3], 0.9, 0.4);
  shake(0.3, BERSERK.shake);
  sfx.boom();
  if (v.world) worldEnder(power);
}

/** World Ender: the Last Cleave splits the floor across the whole stage, striking every foe standing on it */
function worldEnder(power: number): void {
  game.fx.push(
    createQuakeLine({
      x: hero.x,
      floor: hero.y,
      ends: [8, W - 8],
      ramp: RAGE_RAMP,
      delay: 0.05,
      slam() {},
      strike(e) {
        dealDamage(e, power, {
          fromX: hero.x,
          launch: e.rank === "minion" ? KNOCKDOWN : undefined,
          source: "ultimate",
        });
      },
    }),
  );
}

/** Berserk is over: the automatic Last Cleave, one strike or Unending Rage's several */
function startLastCleave(): void {
  brannoc.cleaves = brannoc.unending ? (skillValues("b_unending").strikes ?? 1) : 1;
  hero.vx = 0;
  setState("lastCleave");
  emitSkillEvent({ type: "berserk", on: false, level: brannoc.berserkLevel });
}

/** the Last Cleave under way: it strikes on the spin's hit frame, spins again while strikes are left, then settles */
export function runLastCleave(): void {
  const h = hero;
  h.vx = 0;
  if (!h.hitDone && h.st >= BERSERK.spinHit) {
    h.hitDone = true;
    brannoc.cleaves--;
    lastCleaveRing();
  }
  if (h.st < BERSERK.spin) return;
  if (brannoc.cleaves > 0) {
    h.st = 0;
    h.hitDone = false;
    return;
  }
  settle();
}

/** Berserk runs down and ends in Last Cleave, whatever he is doing */
export function tickBerserk(dt: number): void {
  if (brannoc.berserkT <= 0 || hero.state === "dead") return;
  brannoc.berserkT -= dt;
  if (brannoc.berserkT > 0) return;
  brannoc.berserkT = 0;
  startLastCleave();
}

/** Unending Rage: each kill in Berserk makes it last longer */
export function extendOnKill(): void {
  if (brannoc.berserkT <= 0 || !brannoc.unending) return;
  brannoc.berserkT += skillValues("b_unending").extend ?? 0;
}

/** nothing touches him through the roar and the Last Cleave's spin */
export const untouchable = (): boolean => hero.state === "roar" || hero.state === "lastCleave";

/** Deathless: through the roar, Berserk and the Last Cleave a blow leaves him at 1 HP at least */
export const deathless = (): boolean => brannoc.berserkT > 0 || untouchable();
