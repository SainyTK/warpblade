import { MP_PER_HIT } from "../../../constants/combat";
import { ENEMIES } from "../../../constants/enemies";
import { ACCENT, type MalletBox } from "../../../constants/jory/mallets";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { MalletBlow } from "../../../types/jory";
import type { HitFeel } from "../../../types/move";
import type { Box } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { feat } from "../../feat";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, progress } from "../../state";
import { boxHit, hitStop, shake } from "../../world";
import { tier } from "./beat";
import { afterMalletHit, blowScale, firstFoe } from "./blowSkills";

/** one blow of his mallets as it strikes */
export interface MalletStrike {
  blow: MalletBlow;
  box: MalletBox;
  /** damage as a multiple of attack damage, before the Accent */
  power: number;
  kx: number;
  heavy: boolean;
  launch?: number;
  stagger: number;
  feel: HitFeel;
  /** started by a press on the beat, and on a bar's downbeat */
  accent: boolean;
  downbeat: boolean;
  /** the blow strikes again on its second hit frame (Roll) */
  repeat: boolean;
}

/** how much harder an Accent lands: more at Crescendo */
export const accentScale = (): number => (tier() >= 4 ? ACCENT.crescendo : ACCENT.power);

/** the blow's box in the world, ahead of him, grown by a share of its far reach */
export function malletBox(b: MalletBox, grow = 0): Box {
  const far = b.far * (1 + grow);
  const a = hero.x + hero.face * b.near;
  const z = hero.x + hero.face * far;
  return [Math.min(a, z), hero.y - b.high, Math.max(a, z), hero.y - b.low];
}

/** one foe struck by a mallet blow; false when a guard stopped it */
function strikeFoe(e: Enemy, s: MalletStrike, first: boolean): boolean {
  const dir = Math.sign(e.x - hero.x) || hero.face;
  const launchable = ENEMIES[e.type].launchable;
  const payoff = first ? firstFoe(s) : null;
  const power = s.power * blowScale(s) * (payoff?.scale ?? 1) * (s.accent ? accentScale() : 1);
  const hpBefore = e.hp;
  const result = dealDamage(e, progress.stats.ad * power, {
    fromX: hero.x,
    kx: s.kx * dir,
    launch: s.launch && launchable && e.rank !== "boss" ? s.launch : undefined,
    heavy: s.heavy,
    melee: true,
    stagger: s.stagger,
    sureCrit: payoff?.sureCrit,
    stun: payoff?.stun || undefined,
  });
  if (result === "blocked") return false;
  const [cx, cy] = enemyCenter(e);
  // an Accent shows its own thin ring in place of the shared hit spark, so a crowd of Accents never washes the foes out
  if (!s.accent) game.fx.push(createImpact(cx - dir * 3, cy, dir, s.heavy));
  if (s.accent) {
    game.fx.push(createAccentRing(cx - dir * 2, cy));
    emitSkillEvent({ type: "accent", foe: e, blow: s.blow, downbeat: s.downbeat });
  }
  hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
  hero.lastHit = e;
  afterMalletHit(e, s, { first, kill: hpBefore > 0 && e.hp <= 0 });
  return true;
}

/**
 * The blow strikes every foe in its box that `struck` has not marked yet, nearest first, marking each. Returns the foes
 * it landed on.
 */
export function strikeMallets(
  s: MalletStrike,
  box: Box,
  struck: (e: Enemy) => boolean,
  mark: (e: Enemy) => void,
): Enemy[] {
  const foes = game.enemies
    .filter((e) => e.hp > 0 && !struck(e) && boxHit(box, enemyBox(e)))
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  const landed: Enemy[] = [];
  let blocked = 0;
  for (const e of foes) {
    mark(e);
    if (strikeFoe(e, s, !landed.length)) landed.push(e);
    else blocked++;
  }
  hero.moveHits += landed.length + blocked;
  if (landed.length) {
    hitStop(s.feel.stop);
    shake(s.feel.shake[0], s.feel.shake[1]);
    sfx.hit(s.heavy, s.feel.pitch);
    feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return landed;
}
