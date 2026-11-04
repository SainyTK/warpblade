import { WARPATH } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { dealDamage } from "../../../damage";
import { createImpact } from "../../../effects/impact";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { hasPerk } from "../../../progress";
import { game, hero, progress } from "../../../state";
import { boxAhead, boxHit, shake } from "../../../world";
import { isFree } from "../../actions";
import { emitYsra } from "../events";
import { stance } from "./memory";

/** a double tap toward a side: with Warpath, a charge that runs until that side is let go */
export function startCharge(dir: number): void {
  if (!hasPerk("warpath") || !isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}

/** a small foe in the way is shouldered aside; a big one stops the charge dead and throws her back off it */
function shoulder(): void {
  const h = hero;
  const box = boxAhead(...WARPATH.box);
  for (const e of game.enemies) {
    if (e.hp <= 0 || stance.shouldered.has(e) || !boxHit(box, enemyBox(e))) continue;
    stance.shouldered.set(e, WARPATH.again);
    const [ex, ey] = enemyCenter(e);
    game.fx.push(createImpact(h.x + h.face * 6, ey, h.face, false));
    if (e.rank !== "minion") {
      h.running = false;
      h.vx = -h.face * 80;
      shake(0.12, 1.6);
      sfx.block();
      return;
    }
    dealDamage(e, progress.stats.ad * WARPATH.power, {
      fromX: h.x,
      kx: Math.sign(ex - h.x || h.face) * WARPATH.kx,
      launch: WARPATH.launch,
      stagger: WARPATH.stagger,
      heavy: true,
      melee: true,
    });
    shake(0.08, 1.2);
    sfx.hit(false, 0.8);
  }
}

/** the charge: foes in the way shouldered, her path reported each frame */
export function tickWarpath(dt: number): void {
  for (const [e, left] of stance.shouldered) {
    if (left <= dt) stance.shouldered.delete(e);
    else stance.shouldered.set(e, left - dt);
  }
  if (hero.state !== "run") return;
  emitYsra("travel", { x: hero.x, y: hero.y, from: "charge" });
  shoulder();
}
