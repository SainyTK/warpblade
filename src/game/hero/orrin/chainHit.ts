import { COMBO, MP_PER_HIT } from "../../../constants/combat";
import { ENEMIES } from "../../../constants/enemies";
import type { ChainBlowSpec } from "../../../constants/orrin/string";
import { SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { ChainBlow } from "../../../types/orrin";
import { dealDamage, type HitResult } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { feat } from "../../feat";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { hitStop, markStruck, shake, struckThisSwing } from "../../world";
import { afterChainHit, chainPower, hangingSpikes } from "./blowSkills";
import { tipMomentum } from "./momentum";
import { bearing, blowReach, inSpan, shoulder, tipBand } from "./reach";

/** what one chain blow is: its shape, which blow it is, and anything the caller adds */
export interface ChainStrike {
  spec: ChainBlowSpec;
  blow: ChainBlow | "hanging";
  /** a multiplier on top of the blow's own power (a fast Hanging Arc, a shade's spin) */
  scale?: number;
  /** a sure crit on a tip hit (Sweet Spot's Full Circle) */
  tipCrit?: boolean;
}

/** Iron Weight launches higher off Rising Arc */
const liftScale = (s: ChainStrike): number => (s.blow === "rising" ? 1 + (skillValues("o_ironweight").lift ?? 0) : 1);

/** one foe struck by the chain, at the tip or closer in */
export function strikeFoe(e: Enemy, tip: boolean, s: ChainStrike): HitResult {
  const { spec } = s;
  const dir = Math.sign(e.x - hero.x) || hero.face;
  const launchable = ENEMIES[e.type].launchable;
  const power = (tip ? spec.tipPower : spec.innerPower) * chainPower(e, tip, s);
  const result = dealDamage(e, progress.stats.ad * power, {
    fromX: hero.x,
    kx: spec.kx * dir,
    ky: spec.ky,
    launch: tip && spec.lift && launchable ? spec.lift * liftScale(s) : undefined,
    spike: s.blow === "hanging" && hangingSpikes(),
    stun: spec.stun,
    heavy: tip && !!spec.breaks,
    melee: true,
    sureCrit: tip && !!s.tipCrit,
    stagger: spec.stagger ?? COMBO.stagger,
  });
  hero.lastHit = e;
  if (result === "blocked") return result;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx - dir * 3, cy, dir, tip, tip ? SPARKS.brass : undefined));
  hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
  if (tip) {
    tipMomentum();
    emitSkillEvent({ type: "tip", foe: e, blow: s.blow });
  }
  afterChainHit(e, tip, s);
  return result;
}

/**
 * The chain sweeps the span `s0` to `s1` (radians from facing ahead, up negative) round his shoulder: every foe in the
 * span between the blow's inner edge and its reach is struck once this swing, at the tip in the last band. Returns how
 * many foes it struck.
 */
export function sweepChain(s: ChainStrike, s0: number, s1: number): number {
  const reach = blowReach(s.spec, s.blow);
  const band = tipBand();
  let hits = 0;
  let tips = 0;
  let blocked = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || struckThisSwing(e)) continue;
    const b = bearing(e);
    if (b.near > reach || b.far < s.spec.inner || !inSpan(b.angle, s0, s1)) continue;
    markStruck(e);
    const tip = b.near >= reach - band && s.blow !== "knee";
    hits++;
    if (strikeFoe(e, tip, s) === "blocked") blocked++;
    else if (tip) tips++;
  }
  hero.moveHits += hits;
  if (hits > blocked) {
    hitStop(tips && s.spec.stop ? s.spec.stop : 0.05);
    shake(0.1, tips ? 2 : 1.2);
    sfx.hit(tips > 0, tips ? 1.25 : 1);
    if (!hero.ground) hero.vy = Math.min(hero.vy, -30);
    feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return hits;
}

/** the chain's tip right now for a blow swept to `angle`, world pixels, for the brass flash and effects */
export function tipPoint(s: ChainStrike, angle: number): [number, number] {
  const [ox, oy] = shoulder();
  const r = blowReach(s.spec, s.blow);
  return [ox + Math.cos(angle) * r * hero.face, oy + Math.sin(angle) * r];
}
