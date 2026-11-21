import { dealDamage } from "../../../game/damage";
import { addStacks, consumeStacks } from "../../../game/enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { DIVE, LUNGE } from "../constants/string";
import { feint } from "./feint";
import { isMarked, roseMark } from "./mark";
import { gainPoints } from "./points";

/** Thorn Wounds lays this many stacks on a foe, from a blow of this move or state */
function thornStacks(): number {
  const v = skillValues("ce_thorns");
  if (!v.damage) return 0;
  if (hero.state === "riposte") return v.riposteStacks ?? 1;
  if (hero.move === "longLunge") return v.lungeStacks ?? 1;
  return 1;
}

/** Thorn Wounds: a thrust lays bleeding thorns; evolved, the lunge tears them all out at once */
function thorns(e: Enemy): void {
  const v = skillValues("ce_thorns");
  if (!v.damage) return;
  if (hero.move === "longLunge" && skillEvolved("ce_thorns")) {
    const n = consumeStacks(e, "ce_thorns");
    if (n) dealDamage(e, progress.stats.ad * v.burst * n, { fromX: hero.x, kx: 0, source: "ce_thorns" });
    return;
  }
  addStacks(e, "ce_thorns", {
    stacks: thornStacks(),
    max: v.max,
    damage: progress.stats.ad * v.damage,
    every: 0.5,
    duration: v.duration,
  });
  if (v.halt) e.halt = Math.max(e.halt, v.halt);
}

/** Pinning Point: thrusts hold a walker's feet; evolved, every thrust pins */
function pinning(e: Enemy): void {
  const v = skillValues("ce_pin");
  if (v.halt) e.halt = Math.max(e.halt, v.halt);
  if (v.pinAll) e.pinned = Math.max(e.pinned, v.pinAll);
}

/** the lunge and the dive pin what they strike; Long Lunge and Swallow Dive hold it longer and pay a Point */
function pins(e: Enemy): void {
  if (hero.move === "longLunge") e.pinned = Math.max(e.pinned, skillValues("ce_lunge").pin ?? LUNGE.pin);
  if (hero.move === "dive") {
    e.pinned = Math.max(e.pinned, skillValues("ce_dive").pin ?? DIVE.pin);
    gainPoints(skillValues("ce_dive").points ?? 0);
  }
}

/** one of Cerise's own blows landed on a foe: pins, thorns, holds, the feint and a renewed mark, by what struck it */
export function landed(e: Enemy, _hit: { crit: boolean; kill: boolean }): void {
  if (e.hp <= 0) return;
  const blade = hero.state === "move" || hero.state === "riposte";
  if (!blade) return;
  pins(e);
  thorns(e);
  pinning(e);
  if (hero.move === "risingThrust") feint(e);
  if (skillValues("ce_weep").refresh && isMarked(e)) roseMark(e);
}
