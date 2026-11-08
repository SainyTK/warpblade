import { ENEMIES } from "../../../constants/enemies";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { ignite } from "../../enemies/burn";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { refundStamina } from "../stamina";
import type { ChainStrike } from "./chainHit";
import { orrin } from "./memory";

const BARBS = "o_barbs";
const FRICTION = "o_friction";
const BLEED_EVERY = 0.5;

/** the attack skills' share on one chain blow: Iron Weight on the string, Sweet Spot on the tip, Sky Lash on the
 *  Hanging Arc, Barbed Links on a bleeding foe */
export function chainPower(e: Enemy, tip: boolean, s: ChainStrike): number {
  let k = s.scale ?? 1;
  const weight = skillValues("o_ironweight");
  if (weight.power && s.blow !== "hanging") k *= 1 + weight.power;
  const sweet = skillValues("o_sweetspot");
  if (tip && sweet.tip) k *= 1 + sweet.tip;
  if (tip && sweet.perfect && orrin.momentum >= 50) k *= 2;
  if (s.blow === "hanging") {
    const sky = skillValues("o_skylash");
    k *= 1 + (sky.power ?? 0);
    if (sky.fast && Math.hypot(hero.vx, hero.vy) > 160) k *= 1 + sky.fast;
  }
  const barbs = skillValues(BARBS);
  if (barbs.bonus && stacksOf(e, BARBS) > 0) k *= 1 + barbs.bonus;
  return k;
}

/** bleed stacks on a foe the chain cut: one, or more at the tip */
export function bleed(e: Enemy, stacks: number): void {
  const v = skillValues(BARBS);
  if (!skillLevel(BARBS)) return;
  addStacks(e, BARBS, {
    stacks,
    max: withCharms("amount", v.max),
    damage: progress.stats.ad * v.damage * BLEED_EVERY,
    every: BLEED_EVERY,
    duration: withCharms("duration", v.life),
  });
}

/** the chain's own burn on a swept foe, over the shared burning */
export function burnSwept(e: Enemy): void {
  const v = skillValues(FRICTION);
  if (!skillLevel(FRICTION)) return;
  ignite(e, withCharms("duration", v.burn));
  addStacks(e, FRICTION, {
    stacks: 1,
    max: 1,
    damage: progress.stats.ad * v.damage * BLEED_EVERY,
    every: BLEED_EVERY,
    duration: withCharms("duration", v.burn),
  });
}

/** Sweet Spot's evolved shock runs on through the foes behind the struck one */
function perfectShock(e: Enemy, reach: number, power: number): void {
  const [cx, cy] = enemyCenter(e);
  const dir = Math.sign(cx - hero.x) || hero.face;
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.sign(ox - cx) !== dir || Math.abs(ox - cx) > reach + 8 || Math.abs(oy - cy) > 18) continue;
    dealDamage(o, progress.stats.ad * power, { fromX: cx, kx: dir * 80, source: "o_sweetspot" });
  }
}

/** Iron Weight's knock: a struck foe flies into the foes just beyond it and hits them */
function knockInto(e: Enemy, power: number): void {
  const [cx, cy] = enemyCenter(e);
  const dir = Math.sign(cx - hero.x) || hero.face;
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.sign(ox - cx) !== dir || Math.abs(ox - cx) > 16 || Math.abs(oy - cy) > 14) continue;
    dealDamage(o, progress.stats.ad * power, { fromX: cx, kx: dir * 60, source: "o_ironweight" });
  }
}

/** Sky Lash's spike: a foe struck down out of the air lands on those under it */
function splash(e: Enemy, power: number): void {
  const [cx, cy] = enemyCenter(e);
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.abs(ox - cx) > 16 || oy < cy - 4 || oy > cy + 40) continue;
    dealDamage(o, progress.stats.ad * power, { fromX: cx, ky: -40, source: "o_skylash" });
  }
}

/** what the skills do once a chain blow has landed on a foe */
export function afterChainHit(e: Enemy, tip: boolean, s: ChainStrike): void {
  const sweet = skillValues("o_sweetspot");
  if (tip && sweet.mark) markFoe(e, "o_sweetspot", withCharms("duration", sweet.markTime), sweet.mark);
  if (tip && sweet.refund) refundStamina(sweet.refund);
  if (tip && sweet.perfect && orrin.momentum >= 50) perfectShock(e, sweet.shock, sweet.shockPower);
  const barbs = skillValues(BARBS);
  if (skillLevel(BARBS)) {
    if (tip && s.blow === "circle" && barbs.flay) {
      const n = consumeStacks(e, BARBS);
      if (n) dealDamage(e, progress.stats.ad * barbs.flay * n, { fromX: hero.x, source: BARBS });
    } else bleed(e, tip ? barbs.tipStacks : barbs.stacks);
  }
  if (s.blow === "circle") burnSwept(e);
  const weight = skillValues("o_ironweight");
  if (weight.knock && s.blow !== "hanging") knockInto(e, weight.knock);
  const sky = skillValues("o_skylash");
  if (s.blow === "hanging" && sky.splash && ENEMIES[e.type].launchable) splash(e, sky.splash);
}

/** Sky Lash spikes minions out of the air with the Hanging Arc */
export const hangingSpikes = (): boolean => (skillValues("o_skylash").spike ?? 0) > 0;
