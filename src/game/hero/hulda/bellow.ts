import { BELLOW } from "../../../constants/hulda/bellow";
import { GRIT } from "../../../constants/hulda/grit";
import { WIDE_BELLOW } from "../../../constants/hulda/moveset";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createBellowRing } from "../../effects/bellowRing";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, progress } from "../../state";
import { shake } from "../../world";
import { setState, settle } from "../actions";
import { skin } from "../skin";
import { castGate } from "./castGate";
import { thudLight } from "./effects/thud";
import { gainGrit } from "./grit";
import { hulda } from "./memory";

/** MP a Bellow costs: more for the wide one */
export const bellowMp = (wide: boolean): number => BELLOW.mp * (wide ? WIDE_BELLOW.mp : 1);

/** I: a roar that drags foes in, paid with MP; on the floor, from the start. Held, a wider roar that pulls harder */
export function pressBellow(wide: boolean): boolean {
  const h = hero;
  if (!castGate()) return false;
  const big = wide && h.mp >= bellowMp(true);
  h.mp -= bellowMp(big);
  hulda.bellowCd = BELLOW.cooldown;
  hulda.wideBellow = big;
  h.vx = 0;
  setState("bellow");
  sfx.tone(90, 70, 0.12, "sawtooth", 0.04);
  emitSkillEvent({ type: "cast", ability: "bellow" });
  return true;
}

/** every foe in reach takes ability power damage, minions reel, and all of them are dragged toward her, fliers down */
function roar(): void {
  const h = hero;
  const caught: Enemy[] = [];
  const reach = BELLOW.reach * (hulda.wideBellow ? WIDE_BELLOW.reach : 1);
  const pull = BELLOW.pull * (hulda.wideBellow ? WIDE_BELLOW.pull : 1);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - h.x, cy - (h.y - 18)) > reach) continue;
    const stun = kindOf(e.type).flies ? BELLOW.flierStun : BELLOW.stun;
    dealDamage(e, progress.stats.ap * BELLOW.power, { fromX: h.x, kx: 0, stun, source: "abilities" });
    caught.push(e);
  }
  gainGrit(GRIT.bellow);
  game.fx.push(createBellowRing(h.x + h.face * 4, h.y - 22, caught, [h.x, h.y], skin.ramp, reach, pull));
  thudLight(h.x + h.face * 4, h.y - 22, "big");
  shake(hulda.wideBellow ? 0.25 : 0.15, hulda.wideBellow ? 2.5 : 1.5);
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
