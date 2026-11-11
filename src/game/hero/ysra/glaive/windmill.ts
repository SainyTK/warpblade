import { ENEMIES } from "../../../../constants/enemies";
import { FLARE } from "../../../../constants/ysra/rites";
import { enemyCenter } from "../../../enemies/enemy";
import { staggerFoe } from "../../../enemies/stagger";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues } from "../../../skills/query";
import { burstEmbers } from "../../../spells/rites/emberBurst";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero, progress } from "../../../state";
import { struckThisSwing } from "../../../world";

/** pixels around her the closing ring of fire reaches */
const RING = 36;
/** a pass flings its ember at a foe up to this far out */
const EMBER_REACH = 50;
/** speed foes are drawn in at */
const PULL_SPEED = 110;

const windmill = () => skillValues("y_windmill");

/** every foe within the pull is drawn toward her, the light ones fastest */
function pullIn(reach: number): void {
  for (const e of game.enemies) {
    const d = e.x - hero.x;
    if (e.hp <= 0 || Math.abs(d) > reach || Math.abs(e.y - hero.y) > 40) continue;
    e.vx = -Math.sign(d) * PULL_SPEED * (1 - ENEMIES[e.type].weight);
  }
}

/** an ember flung out of the pass at the nearest foe each side past the glaive's reach */
function flingEmbers(power: number): void {
  for (const side of [-1, 1]) {
    let best = null;
    let bestD = EMBER_REACH;
    for (const e of game.enemies) {
      const d = (e.x - hero.x) * side;
      if (e.hp <= 0 || d <= 0 || d >= bestD || struckThisSwing(e)) continue;
      best = e;
      bestD = d;
    }
    if (!best) continue;
    const [x, y] = enemyCenter(best);
    burstEmbers(x, y, progress.stats.ad * power, 10, 1);
  }
}

/** after each pass: foes drawn in and staggered, embers flung; the last pass closes in a ring of fire */
export function windmillPassed(last: boolean): void {
  const v = windmill();
  pullIn(v.pull ?? 0);
  if (v.stagger) for (const e of game.enemies) if (struckThisSwing(e)) staggerFoe(e, v.stagger);
  if (v.embers) flingEmbers(v.embers);
  if (!last) return;
  if (v.ring) game.fx.push(castFlare(hero.x, hero.y, { ...FLARE, radius: RING, power: v.ring }, "attacks"));
  emitSkillEvent({ type: "spin", x: hero.x, y: hero.y });
}
