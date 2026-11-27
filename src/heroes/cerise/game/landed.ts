import { usesDrill } from "../../../drill";
import { dealDamage } from "../../../game/damage";
import { addStacks, consumeStacks } from "../../../game/enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { DIVE, LUNGE } from "../constants/string";
import { feint } from "./feint";
import { atFloor, atFoe, ceriseFx } from "./fx";
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
    const blow = progress.stats.ad * v.burst * Math.max(1, n);
    ceriseFx("ce_thorns", "burst", atFoe(e, 16), { damage: blow, sigil: "rose" });
    ceriseFx("ce_thorns", "spikes", atFloor(e.x, e.y, 22), { damage: blow, quiet: true });
    return;
  }
  const stacks = thornStacks();
  ceriseFx("ce_thorns", "slash", atFoe(e, 12), { damage: progress.stats.ad * v.damage * stacks * 6, sigil: "thrust" });
  addStacks(e, "ce_thorns", {
    stacks,
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
  if (v.halt || v.pinAll) {
    const damage = progress.stats.ad * (1 + (v.held ?? 0) * 4);
    ceriseFx("ce_pin", "spikes", atFloor(e.x, e.y, 16), { damage, sigil: "needle", lift: 22 });
    if (v.pinAll) ceriseFx("ce_pin", "pillar", atFloor(e.x, e.y, 30), { damage, quiet: true });
  }
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
  if (skillValues("ce_weep").refresh && isMarked(e)) roseMark(e);
  if (usesDrill()) return;
  pins(e);
  thorns(e);
  pinning(e);
  if (hero.move === "risingThrust") feint(e);
}
