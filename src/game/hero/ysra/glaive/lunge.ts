import { ENEMIES } from "../../../../constants/enemies";
import { GLAIVE_FEEL, HEFT, LUNGE } from "../../../../constants/ysra/glaive";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import type { Box } from "../../../../types/world";
import { lerp } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { createImpact } from "../../../effects/impact";
import { createSlash } from "../../../effects/slash";
import { enemyCenter } from "../../../enemies/enemy";
import { meleeHit } from "../../../meleeHit";
import { hasPerk } from "../../../progress";
import { game, hero, progress } from "../../../state";
import { boxAhead, dust, hitStop, shake } from "../../../world";
import { emitYsra } from "../events";
import { createLungeTrail } from "./effects/lungeTrail";
import { haftReach } from "./reach";
import { G_COUNTER } from "./slashes";

/** the lunge under way: its charge, where it started, the swing its pierce shares, the foe on the blade */
const lunge = {
  charge: 0,
  dist: 0,
  from: 0,
  swing: 0,
  hits: 0,
  carried: null as Enemy | null,
  ended: false,
  railed: false,
};

const isFull = (): boolean => lunge.charge >= 1;
const power = (): number => lerp(LUNGE.power[0], LUNGE.power[1], lunge.charge);
const travelEnd = LUNGE.start + LUNGE.time;

/** the heft released with this part of a full wind beyond the poke, 0 to 1 */
export function setLungeCharge(charge: number): void {
  lunge.charge = charge;
}

/** the lunge starts: its length from the charge and Deep Heft, one swing for the whole line */
export function startLunge(): void {
  const ranks = progress.ranks[HEFT.skill] ?? 0;
  const reach = LUNGE.least + (1 - LUNGE.least) * lunge.charge;
  Object.assign(lunge, {
    dist: LUNGE.travel * reach + ranks * LUNGE.travelPerRank * lunge.charge,
    from: hero.x,
    swing: ++game.swing,
    hits: 0,
    carried: null,
    ended: false,
    railed: false,
  });
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...G_COUNTER, R: 30 + haftReach(), W: isFull() ? 8 : 5 }));
  sfx.lunge();
}

/** every foe the blade passes through is struck once, all on the lunge's one swing */
function pierce(): void {
  const keep = game.swing;
  game.swing = lunge.swing;
  const [x0, y0, y1] = LUNGE.box;
  const hits = meleeHit([boxAhead(x0, y0, LUNGE.tip + haftReach(), y1)], {
    power: power(),
    kx: 50,
    ky: -10,
    stun: 0.4,
    big: isFull(),
    feel: GLAIVE_FEEL.lunge,
  });
  game.swing = keep;
  lunge.hits += hits;
  const first = hero.lastHit;
  if (hits && isFull() && !lunge.carried && first && hasPerk("skewer") && carriable(first)) lunge.carried = first;
}

const carriable = (e: Enemy): boolean => e.rank === "minion" && ENEMIES[e.type].launchable && e.hp > 0;

/** Skewer: the first foe rides the point along */
function carry(): void {
  const e = lunge.carried;
  if (!e || e.hp <= 0) return;
  e.x = hero.x + hero.face * LUNGE.carry;
  e.vx = 0;
}

/** Skewer's end: the carried foe is slammed down into the floor off the point */
function slam(e: Enemy): void {
  if (e.hp <= 0) return;
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * power() * LUNGE.slam.power, {
    fromX: hero.x,
    kx: hero.face * 20,
    stun: LUNGE.slam.stun,
    spike: true,
    heavy: true,
    melee: true,
  });
  game.fx.push(createImpact(cx, cy, hero.face, true));
  dust(e.x, hero.y, 8);
  hitStop(GLAIVE_FEEL.impale.stop);
  shake(GLAIVE_FEEL.impale.shake[0], GLAIVE_FEEL.impale.shake[1]);
  sfx.hit(true, GLAIVE_FEEL.impale.pitch);
  emitYsra("strike", { source: "skewer", hits: 1 });
}

/** the travel is over where she stands */
function finish(): void {
  const h = hero;
  lunge.ended = true;
  h.vx = 0;
  game.fx.push(createLungeTrail(lunge.from, h.x + h.face * 20, h.y - 15));
  dust(h.x + h.face * 4, h.y, 4, h.face);
  emitYsra("lungeEnd", { x: h.x, y: h.y, full: isFull() });
  emitYsra("strike", { source: "heftLunge", hits: lunge.hits });
  if (lunge.carried) slam(lunge.carried);
  lunge.carried = null;
}

/** Rail Lance: a moment after a full lunge stops, the whole line it ran is struck again */
function rail(): void {
  const h = hero;
  lunge.railed = true;
  const ends = [lunge.from, h.x + h.face * (LUNGE.tip + haftReach())];
  const box: Box = [Math.min(...ends), h.y + LUNGE.box[1], Math.max(...ends), h.y + LUNGE.box[2]];
  game.swing++;
  const hits = meleeHit([box], { power: power() * LUNGE.railPower, kx: 30, ky: -20, feel: GLAIVE_FEEL.lunge });
  game.fx.push(createLungeTrail(lunge.from, ends[1], h.y - 15, true));
  emitYsra("strike", { source: "railLance", hits });
}

/** the lunge's motion: skim forward through the line at a speed that covers its length, then plant */
export function stepLunge(t: number): void {
  const h = hero;
  if (t >= LUNGE.start && t < travelEnd) {
    h.vx = (h.face * lunge.dist * progress.stats.aspd) / LUNGE.time;
    pierce();
    carry();
    emitYsra("travel", { x: h.x, y: h.y, from: "lunge" });
    return;
  }
  h.vx = 0;
  if (t < travelEnd) return;
  if (!lunge.ended) finish();
  if (!lunge.railed && isFull() && hasPerk("railLance") && t >= travelEnd + LUNGE.railDelay) rail();
}

/** the tip burst lands when the travel ends */
export const LUNGE_BURST_AT = travelEnd;
