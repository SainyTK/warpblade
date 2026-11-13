import { BLINK_COST, WARP } from "../../../constants/combat";
import { PHANTOM_RAMP } from "../../../constants/combo";
import { GROUND, W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createEcho } from "../../effects/echo";
import { createSlash } from "../../effects/slash";
import { enemyBox, enemyCenter, walks } from "../../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { skillEvolved, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { showPhantom } from "../phantom";
import { arrive, spendWarpCharge, strikeOnArrival, warpBeside, warpCost } from "../warp";
import { kael } from "./state";

/** Blink Step's afterimage cut where Kael stood: the warp's slash in phantom colours */
const AFTER_SLASH = {
  cx: 2,
  cy: -20,
  R: 24,
  sy: 0.5,
  rot: -0.5,
  a0: -2.6,
  a1: 0.8,
  W: 10,
  hold: 0.06,
  trail: 0.24,
  ramp: PHANTOM_RAMP,
};
/** Rift Walker: seconds between chained arrivals */
const CHAIN_GAP = 0.14;
/** Blink Step's afterimage cuts foes this close to where Kael stood */
const AFTER_REACH = 26;

/** Rift Walker's chain: the foes still to warp to, and seconds to the next. Holds foes, so only the host keeps it */
const chain: { foes: Enemy[]; next: number } = { foes: [], next: 0 };
rememberPerSeat(objectMemory(chain, true));

/** Rift Walker (Warpcraft evolved): after an arrival the sword leaps on to more foes in reach, Kael after it */
export function startChain(first: Enemy | null): void {
  const v = skillValues("k_warpcraft");
  if (!first || !skillEvolved("k_warpcraft") || kael.chainCd > 0) return;
  kael.chainCd = withCharms("cooldown", v.chainEvery);
  chain.foes = game.enemies
    .filter((e) => e !== first && e.hp > 0 && Math.abs(e.x - hero.x) < WARP.reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, v.chain);
  chain.next = CHAIN_GAP;
}

/** Rift Walker's chain goes on, one arrival every `CHAIN_GAP` */
export function tickChain(dt: number): void {
  if (!chain.foes.length) return;
  chain.next -= dt;
  if (chain.next > 0) return;
  chain.next = CHAIN_GAP;
  const foe = chain.foes.shift();
  if (foe && foe.hp > 0) warpBeside(foe, false);
}

/** the foe a blink lands behind: the last one hit, or the nearest in reach */
function blinkTarget(): Enemy | null {
  if (hero.lastHit && hero.lastHit.hp > 0) return hero.lastHit;
  return (
    game.enemies
      .filter((e) => e.hp > 0 && Math.abs(e.x - hero.x) < 90)
      .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0] ?? null
  );
}

/** Blink Step's afterimage: where Kael stood, a cut at the foes beside it */
function afterimageCut(x: number, y: number, face: number, damage: number): void {
  game.fx.push(createSlash(x, y, face, AFTER_SLASH));
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(enemyCenter(e)[0] - x) > AFTER_REACH || Math.abs(e.y - y) > 40) continue;
    dealDamage(e, damage, { fromX: x, kx: face * 40, ky: -30, melee: true });
  }
}

/** Shadow Step: a phantom of Kael on the near side cuts the foe as he strikes from its back */
function shadowStrike(e: Enemy, side: number, damage: number): void {
  const box = enemyBox(e);
  const x = clamp(side > 0 ? box[0] - 9 : box[2] + 9, 8, W - 8);
  showPhantom(x, walks(e) ? e.y : Math.min(GROUND, e.y + 18), side, 0.35);
  game.fx.push(createEcho(e, damage, side, "k_blink"));
}

/** Blink Step: no sword throw, Kael steps through to the foe's back and strikes; the foe cannot turn for a moment, an
 *  afterimage cuts where he stood, and as Shadow Step a phantom strikes from the near side with him */
export function blink(keen: boolean): boolean {
  const v = skillValues("k_blink");
  const e = blinkTarget();
  if (!e) return false;
  hero.mp -= warpCost() * BLINK_COST;
  if (v.recharge) kael.blinkCd = withCharms("cooldown", v.recharge);
  else spendWarpCharge();
  const box = enemyBox(e);
  const side = Math.sign(e.x - hero.x) || hero.face;
  const nx = clamp(side > 0 ? box[2] + 9 : box[0] - 9, 8, W - 8);
  const ny = walks(e) ? e.y : Math.min(GROUND, e.y + 18);
  if (v.after) afterimageCut(hero.x, hero.y, side, progress.stats.ad * v.after);
  arrive(nx, ny, e);
  hero.face = -side;
  if (v.lock) e.turn = -withCharms("duration", v.lock);
  if (skillEvolved("k_blink")) shadowStrike(e, side, progress.stats.ad * v.power);
  strikeOnArrival(v.power, e, keen && !!v.keen);
  if (e.hp <= 0 && skillEvolved("k_blink")) {
    kael.blinkCd = 0;
    hero.mp += warpCost() * BLINK_COST;
  }
  return true;
}
