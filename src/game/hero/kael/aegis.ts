import { AEGIS_LOOK, AEGIS_SPLASH, KAEL_BLOCK } from "../../../constants/kael/guard";
import { PAL, SPARKS } from "../../../constants/palette";
import { place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createCrystalWave } from "../../effects/crystalWave";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, progress, rng } from "../../state";
import { hitStop, shake } from "../../world";
import { drawCrystal } from "./art/crystal";
import { kael } from "./state";

const SKILL = "k_aegis";
const C = PAL.crystal;

/** stamina a blocked blow costs: Kael's own, halved from Crystal Aegis's second level */
export const aegisBlockCost = (): number => KAEL_BLOCK.cost * (skillValues(SKILL).half ?? 1);

/** share of a blocked blow that gets through: none from Crystal Aegis's sixth level */
export const aegisChip = (): number => (skillValues(SKILL).sealed ? 0 : KAEL_BLOCK.chip);

/** a blow blocked: Crystal Aegis sets a crystal in the guard, and as Diamond Aegis sends a crystal lance back */
export function aegisBlocked(foe: Enemy | null): void {
  if (!skillLevel(SKILL)) return;
  const v = skillValues(SKILL);
  kael.plates = Math.min(v.plates, kael.plates + 1);
  sfx.chime(kael.plates);
  if (!skillEvolved(SKILL) || !foe) return;
  const dir = Math.sign(enemyCenter(foe)[0] - hero.x) || hero.face;
  game.fx.push(createCrystalWave(hero.x + dir * 8, hero.y - 20, dir, progress.stats.ad * v.reflect, SKILL));
}

/** the shatter: the crystals burst at the attacker, which takes all of it, and foes beside it take a share */
function shatter(foe: Enemy, plates: number): void {
  const v = skillValues(SKILL);
  const [x, y] = enemyCenter(foe);
  const reach = withCharms("area", v.reach);
  const blow = progress.stats.ad * v.shard * plates;
  game.fx.push(createFloorRing(x, foe.y, reach, C, 0.35));
  lights.add(x, y, reach + 10, C[4], 0.9, 0.3);
  for (let i = 0; i < plates * AEGIS_LOOK.shards; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(90, 200);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp * 0.7, rng.range(0.3, 0.6), {
      col: rng.pick(C.slice(3)),
      size: rng.range(1.2, 2.6),
    });
  }
  const launch = skillEvolved(SKILL) ? v.launch : undefined;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (e !== foe && Math.hypot(ex - x, ey - y) > reach) continue;
    const dir = Math.sign(ex - hero.x) || hero.face;
    const damage = e === foe ? blow : blow * AEGIS_SPLASH;
    dealDamage(e, damage, { fromX: hero.x, kx: dir * 90, ky: -60, launch, heavy: true });
    if (v.freeze) e.frozen = Math.max(e.frozen, withCharms("duration", v.freeze));
    game.fx.push(createImpact(ex, ey, dir, true, SPARKS.crystal));
  }
  hitStop(0.08);
  shake(0.2, 2.5);
  sfx.shatter();
}

/** a parry: from Crystal Aegis's fourth level it sets one more crystal, then every crystal in the guard shatters at the
 *  attacker */
export function aegisParried(foe: Enemy | null): void {
  if (!skillLevel(SKILL)) return;
  const v = skillValues(SKILL);
  if (v.parryPlate) kael.plates = Math.min(v.plates, kael.plates + 1);
  const plates = kael.plates;
  kael.plates = 0;
  if (foe && plates > 0) shatter(foe, plates);
}

/** the crystals set in the guard, circling Kael's sword hand */
export function drawAegis(): void {
  const n = kael.plates;
  if (!n || hero.state === "dead") return;
  place();
  const hx = hero.x + hero.face * hero.hand[0];
  const hy = hero.y + hero.hand[1];
  const turn = game.t * AEGIS_LOOK.spin;
  for (let i = 0; i < n; i++) {
    const a = turn + (i / n) * TAU;
    const x = hx + Math.cos(a) * AEGIS_LOOK.orbit;
    const y = hy + Math.sin(a) * AEGIS_LOOK.orbit * 0.6;
    drawCrystal(x, y + AEGIS_LOOK.size, AEGIS_LOOK.size * 2, AEGIS_LOOK.size, 0, C, 1);
  }
}
