import { MP_PER_HIT } from "../../../constants/combat";
import { SPARKS } from "../../../constants/palette";
import type { LampBlowSpec } from "../../../constants/wenna/lamp";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { LampBlow } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { ignite } from "../../enemies/burn";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { feat } from "../../feat";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { type StrikePlace, shapeReaches } from "./shape";

/** one blow of her lamp, or a Wick's repeat of the Flare, struck at a place */
export interface LampStrike {
  blow: LampBlow;
  spec: LampBlowSpec;
  at: StrikePlace;
  /** pixels the shape grows (Open Shutter) */
  grow: number;
  /** a multiple on the blow's power: a skill's bonus, a Wick's share of a repeated Flare */
  scale: number;
  /** a Wick repeats the Flare: it counts as her blow but marks no Quarry and gives no MP */
  repeat: boolean;
}

/** a Wick's repeat of the Flare: a short hit-stop and a higher sound, with no shake of its own */
const REPEAT_STOP = 0.02;
const REPEAT_PITCH = 1.3;

/** one foe struck by a lamp blow; false when a guard stopped it */
function strikeFoe(e: Enemy, s: LampStrike): boolean {
  const { spec } = s;
  const dir = Math.sign(e.x - s.at.x) || s.at.face;
  const base = (progress.stats.ad * spec.power + progress.stats.ap * spec.spell) * s.scale;
  const flame = s.blow === "flare";
  const result = dealDamage(e, base, {
    fromX: s.at.x,
    kx: spec.kx * dir,
    ky: spec.ky,
    melee: !flame,
    stagger: spec.stagger,
    launch: s.repeat ? undefined : spec.launch,
  });
  if (result === "blocked") return false;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx - dir * 3, cy, dir, flame && !s.repeat, flame ? SPARKS.wick : undefined));
  if (flame && skillValues("w_flare").ignite) ignite(e, 2);
  if (!s.repeat) {
    hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
    hero.lastHit = e;
  }
  return true;
}

/** squared distance from the strike to a foe, so the nearest foe struck is the one a blow marks */
const near = (s: LampStrike, e: Enemy): number => (enemyCenter(e)[0] - s.at.x) ** 2 + (enemyCenter(e)[1] - s.at.y) ** 2;

/**
 * The blow strikes every foe its shape reaches that `struck` has not marked yet, marking each. Returns the foes it landed
 * on, nearest first.
 */
export function strikeShape(s: LampStrike, struck: (e: Enemy) => boolean, mark: (e: Enemy) => void): Enemy[] {
  const landed: Enemy[] = [];
  let blocked = 0;
  const foes = game.enemies.filter(
    (e) => e.hp > 0 && !struck(e) && shapeReaches(s.spec.shape, s.at, enemyBox(e), s.grow),
  );
  foes.sort((a, b) => near(s, a) - near(s, b));
  for (const e of foes) {
    mark(e);
    if (strikeFoe(e, s)) landed.push(e);
    else blocked++;
  }
  if (!s.repeat) hero.moveHits += landed.length + blocked;
  if (landed.length) {
    const feel = s.spec.feel;
    hitStop(s.repeat ? REPEAT_STOP : feel.stop);
    shake(feel.shake[0], s.repeat ? 1 : feel.shake[1]);
    sfx.hit(s.blow === "flare", s.repeat ? REPEAT_PITCH : feel.pitch);
    if (!s.repeat) feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return landed;
}
