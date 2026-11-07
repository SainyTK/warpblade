import { ENEMIES } from "../../../constants/enemies";
import { HAYMAKER_SKILL } from "../../../constants/hulda/haymaker";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorCrack } from "../../effects/floorCrack";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, shake } from "../../world";
import { skin } from "../skin";

const ID = "h_haymaker";

/** what Wrecking Haymaker adds to the haymaker's blow: power, a longer stun, minions thrown up, and the evolved spike */
export interface HaymakerBoost {
  power: number;
  stun: number;
  launch?: number;
  spike: boolean;
}

/** the haymaker's boost from the skill, or null when it is not held */
export function haymakerBoost(): HaymakerBoost | null {
  if (!skillLevel(ID)) return null;
  const v = skillValues(ID);
  return { power: v.power, stun: v.stun, launch: v.launch ? HAYMAKER_SKILL.launch : undefined, spike: v.spike > 0 };
}

/** foes standing on the floor between two x positions */
function onFloorBetween(a: number, b: number): Enemy[] {
  const [x0, x1] = a < b ? [a, b] : [b, a];
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    return cx >= x0 && cx <= x1 && cy > hero.y - HAYMAKER_SKILL.crackHeight;
  });
}

/** the crack runs out along the floor one way and strikes each foe standing on it */
function crack(dir: number, length: number, power: number): void {
  const x0 = hero.x + dir * 4;
  const x1 = clamp(x0 + dir * length, 2, W - 2);
  game.fx.push(createFloorCrack(x0, x1, hero.y, HAYMAKER_SKILL.crackSpeed, skin.ramp));
  for (const e of onFloorBetween(x0, x1)) {
    const minion = ENEMIES[e.type].launchable;
    dealDamage(e, progress.stats.ad * power, {
      fromX: hero.x,
      kx: dir * 30,
      launch: minion && skillValues(ID).launch ? HAYMAKER_SKILL.launch * 0.6 : undefined,
      heavy: true,
    });
  }
  dust(x1, hero.y, 4);
}

/** foes beside the struck one are knocked down */
function knockDown(struck: Enemy, power: number): void {
  const [sx, sy] = enemyCenter(struck);
  for (const e of game.enemies) {
    if (e === struck || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - sx, cy - sy) > HAYMAKER_SKILL.knockReach) continue;
    dealDamage(e, progress.stats.ad * power, {
      fromX: sx,
      kx: Math.sign(cx - sx) * 80,
      stun: HAYMAKER_SKILL.knockStun,
      heavy: true,
    });
    game.fx.push(createImpact(cx, cy, Math.sign(cx - sx) || 1, false));
  }
}

/** Meteor Haymaker: the spiked foe hits the floor a moment later for a second impact */
function spike(e: Enemy, power: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      if (t < HAYMAKER_SKILL.spikeDelay) return true;
      if (e.hp > 0) {
        const [cx, cy] = enemyCenter(e);
        dealDamage(e, progress.stats.ad * power, { fromX: cx, kx: 0, stun: 0.6, heavy: true });
        game.fx.push(createImpact(cx, cy + 4, hero.face, true));
        dust(cx, e.y, 8);
        shake(0.2, 3);
        sfx.boom();
      }
      return false;
    },
    draw() {},
  });
}

/** after the haymaker landed: the crack ahead (and behind), the knock-down beside the struck foe, the spike's impact */
export function afterHaymaker(struck: Enemy | null): void {
  if (!skillLevel(ID)) return;
  const v = skillValues(ID);
  if (v.crack) {
    const length = withCharms("area", v.crack);
    crack(hero.face, length, v.crackPower);
    if (v.behind) crack(-hero.face, length, v.crackPower);
  }
  if (!struck) return;
  if (v.knock) knockDown(struck, v.knock);
  if (v.spike) spike(struck, v.spike);
}
