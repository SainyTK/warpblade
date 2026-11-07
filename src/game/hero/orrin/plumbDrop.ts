import { ENEMIES } from "../../../constants/enemies";
import { sfx } from "../../../services/audio";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, hitStop, shake } from "../../world";
import { skin } from "../skin";
import { orrin } from "./memory";
import { momentumShare } from "./momentum";
import { letGo } from "./swing";

const PLUMB = "o_plumbdrop";
const DROP_SPEED = 330;

/** Down in a swing with Plumb Drop: let go and drop straight down */
export function pressPlumb(): boolean {
  if (hero.state !== "swing" || !skillLevel(PLUMB) || orrin.yankTo) return false;
  letGo(false);
  hero.vx = 0;
  hero.vy = DROP_SPEED;
  orrin.plumb = true;
  sfx.lunge();
  return true;
}

/** a drop that meets a foe's head on the way down crits it and, with the hook back, bounces him off it */
export function plumbHead(): boolean {
  if (!orrin.plumb || hero.vy <= 0) return false;
  const v = skillValues(PLUMB);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [x0, y0, x1] = enemyBox(e);
    if (hero.x < x0 - 2 || hero.x > x1 + 2 || hero.y < y0 - 2 || hero.y > y0 + 6) continue;
    if (!v.head) return false;
    plumbLand(true);
    if (v.hook) {
      hero.vy = -200;
      orrin.hooks++;
    }
    return true;
  }
  return false;
}

/** the drop meets the floor or a head: a ring of damage round him, launching with level 3, rooting once evolved */
export function plumbLand(head: boolean): void {
  orrin.plumb = false;
  const v = skillValues(PLUMB);
  const ring = withCharms("area", v.quake || v.ring);
  const power = v.power * (v.momentum ? 1 + 0.5 * momentumShare() : 1);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - hero.x) > ring || Math.abs(cy - (hero.y - 8)) > ring * 0.6 + 10) continue;
    dealDamage(e, progress.stats.ad * power, {
      fromX: hero.x,
      kx: Math.sign(cx - hero.x) * 90,
      launch: v.launch && ENEMIES[e.type].launchable ? -160 : undefined,
      heavy: true,
      melee: true,
      sureCrit: head,
      source: PLUMB,
    });
    if (v.root) e.pinned = Math.max(e.pinned, withCharms("duration", v.root));
  }
  game.fx.push(createFloorRing(hero.x, hero.y, ring, skin.ramp, 0.35));
  dust(hero.x, hero.y, 8);
  hitStop(0.06);
  shake(0.2, v.quake ? 3.5 : 2.5);
  sfx.boom();
}
