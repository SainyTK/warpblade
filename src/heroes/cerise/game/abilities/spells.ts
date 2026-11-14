import { ACTION_CLIPS } from "../../../../constants/clips";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { touches } from "../../../../game/skills/targets";
import { game, hero, lights, progress } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { ABILITY_SKILL } from "../../constants/abilities";
import { ROSE_RAMP } from "../../look/rose";
import type { CeriseAbility } from "../../types/ability";
import { createNeedle } from "../effects/needle";
import { createPetalRing } from "../effects/petals";
import { markedFoes } from "../mark";
import { gainPoints } from "../points";
import { cerise } from "../state";
import { beginCast } from "./cast";

type Spell = Exclude<CeriseAbility, "flurry" | "line">;

const values = (a: Spell): Readonly<Record<string, number>> => skillValues(ABILITY_SKILL[a]);

/** a spell's recharge, from its skill's level */
export const spellRecharge = (a: CeriseAbility): number => values(a as Spell).recharge ?? 5;

/** Rose Bloom: blades of petal burst out round her, pushing foes off (held: twice as wide, pulling them in) */
function bloom(power: number, wide: boolean, scale = 1): void {
  const v = values("bloom");
  const reach = withCharms("area", v.reach) * (wide ? 1.6 : 1) * scale;
  const y = hero.y - 14;
  game.fx.push(createFloorRing(hero.x, hero.y, reach, ROSE_RAMP, 0.45));
  lights.add(hero.x, y, reach, ROSE_RAMP[4], 0.7, 0.3);
  shake(0.14, 1.6);
  let struck = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !touches(e, hero.x, y, reach)) continue;
    struck++;
    const dir = Math.sign(e.x - hero.x) || hero.face;
    dealDamage(e, progress.stats.ap * v.power * power, {
      fromX: hero.x,
      kx: dir * (wide ? -160 : 200),
      ky: -60,
      stagger: 0.4,
      source: "abilities",
    });
  }
  if (v.linger)
    game.fx.push(
      createPetalRing(hero.x, y, reach, withCharms("duration", v.linger), progress.stats.ap * v.tick, "ce_bloom"),
    );
  if (v.heal && struck) hero.hp = Math.min(progress.stats.hp, hero.hp + v.heal * struck);
  if (v.points && struck >= 2) gainPoints(Math.floor(struck / 2));
}

/** what a needle does past its damage: pins, bleeds */
function needleHit(e: Enemy): void {
  const v = values("needle");
  if (v.pin) e.pinned = Math.max(e.pinned, v.pin);
  if (v.bleed)
    addStacks(e, "ce_needle", { stacks: 1, max: 5, damage: progress.stats.ap * v.bleed, every: 0.5, duration: 3 });
}

/** where each needle of a rain falls: in a row along her line, each pulled onto a foe near it with Needle Rain */
function rainPoints(dir: number): number[] {
  const v = values("needle");
  const n = Math.round(withCharms("amount", v.needles));
  return Array.from({ length: n }, (_, i) => {
    const x = hero.x + dir * (24 + i * 18);
    if (!v.home) return x;
    const near = game.enemies.find((e) => e.hp > 0 && Math.abs(e.x - x) < 12);
    return near ? near.x : x;
  });
}

/** Needle Rain: needles of light fall in a row along her line (held: both ways), and again with its seventh level */
function needles(power: number, wide: boolean): void {
  const v = values("needle");
  const damage = progress.stats.ap * v.power * power;
  const dirs = wide ? [hero.face, -hero.face] : [hero.face];
  const rains = v.second ? 2 : 1;
  for (let r = 0; r < rains; r++)
    for (const dir of dirs)
      rainPoints(dir).forEach((x, i) => game.fx.push(createNeedle(x, hero.y, r * 0.4 + i * 0.04, damage, needleHit)));
  if (skillEvolved(ABILITY_SKILL.needle))
    markedFoes().forEach((e, i) => game.fx.push(createNeedle(e.x, e.y, 0.1 + i * 0.05, damage * 2, needleHit)));
  sfx.chime(3);
}

/** Mirror Guard: for a moment every blow from the front (from both sides later) is turned into a riposte */
function mirror(): void {
  const v = values("mirror");
  cerise.stance = withCharms("duration", v.time);
  lights.add(hero.x, hero.y - 18, 30, ROSE_RAMP[5], 0.6, 0.25);
  sfx.chime(5);
}

/** a spell goes off: Bloom and Needle Rain play the shared cast and let loose on its release; Mirror Guard is instant */
export function castSpell(a: CeriseAbility, wide: boolean, recharge: number): boolean {
  if (!beginCast(a, wide, { state: "cast", skipTo: ACTION_CLIPS.cast.hit - 0.02 }, recharge)) return false;
  if (a === "mirror") mirror();
  return true;
}

/** the shared cast reaches its release: the spell under way lets loose */
export function releaseSpell(): void {
  const a = cerise.castAbility;
  if (a === "bloom") {
    bloom(cerise.castPower, cerise.castWide);
    const echoes = values("bloom").echoes ?? 0;
    for (let i = 1; i <= echoes; i++) game.fx.push(bloomEcho(i));
  } else if (a === "needle") needles(cerise.castPower, cerise.castWide);
}

/** Garden of Blades: the bloom blooms again, wider each time */
function bloomEcho(i: number): Effect {
  const o = { t: 0, done: false };
  const power = cerise.castPower;
  const wide = cerise.castWide;
  return {
    update(dt) {
      o.t += dt;
      if (!o.done && o.t >= 0.3 * i) {
        o.done = true;
        bloom(power, wide, 1 + 0.35 * i);
      }
      return !o.done;
    },
    draw() {},
  };
}

/** a foe in the stance's reach: from the front, or either side with Mirror Guard's fourth level */
export function stanceTakes(fromX: number): boolean {
  if (cerise.stance <= 0) return false;
  return values("mirror").around ? true : (fromX - hero.x) * hero.face >= -3;
}

/** the foe nearest where a blow came from, for the stance's answer */
export function foeAt(fromX: number): Enemy | null {
  let best: Enemy | null = null;
  let gap = 44;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const d = Math.abs(enemyCenter(e)[0] - fromX);
    if (d < gap) {
      gap = d;
      best = e;
    }
  }
  return best;
}
