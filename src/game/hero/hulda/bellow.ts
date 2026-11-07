import { BELLOW } from "../../../constants/hulda/bellow";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createBellowRing } from "../../effects/bellowRing";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { game, hero, lights, progress } from "../../state";
import { shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { deny } from "../deny";
import { skin } from "../skin";
import { gainGrit } from "./grit";
import { hulda } from "./memory";
import { rankOf } from "./rank";

/** I: a roar that drags foes in, paid with MP; on the floor, learned from the start */
export function pressBellow(): boolean {
  const h = hero;
  if (!rankOf("t_bellow") || !isFree() || !h.ground) return false;
  if (hulda.bellowCd > 0) {
    deny("cast");
    return true;
  }
  if (h.mp < BELLOW.mp) {
    deny("mp");
    return true;
  }
  h.mp -= BELLOW.mp;
  hulda.bellowCd = BELLOW.cooldown;
  h.vx = 0;
  setState("bellow");
  sfx.tone(90, 70, 0.12, "sawtooth", 0.04);
  return true;
}

/** every foe in reach takes ability power damage, minions reel, and all of them are dragged toward her, fliers down */
function roar(): void {
  const h = hero;
  const caught: Enemy[] = [];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - h.x, cy - (h.y - 18)) > BELLOW.reach) continue;
    const stun = kindOf(e.type).flies ? BELLOW.flierStun : BELLOW.stun;
    dealDamage(e, progress.stats.ap * BELLOW.power, { fromX: h.x, kx: 0, stun });
    caught.push(e);
  }
  gainGrit(GRIT.bellow);
  game.fx.push(createBellowRing(h.x + h.face * 4, h.y - 22, caught, [h.x, h.y], skin.ramp));
  lights.add(h.x, h.y - 20, 50, skin.ramp[4], 0.7, 0.3);
  shake(0.15, 1.5);
  sfx.tone(140, 55, 0.35, "sawtooth", 0.08);
  sfx.noise(0.3, 400, 120, 0.12, "lowpass");
}

/** she draws breath, roars on its frame and holds it */
export function runBellow(): void {
  const h = hero;
  if (!h.hitDone && h.st >= BELLOW.roar) {
    h.hitDone = true;
    roar();
  }
  if (h.st >= BELLOW.dur) settle();
}
