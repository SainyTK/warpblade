import { KICK } from "../../../constants/sable/moves";
import { sfx } from "../../../services/audio";
import { meleeHit } from "../../meleeHit";
import { hasPerk } from "../../progress";
import { hero } from "../../state";
import { boxAhead, newSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { sable } from "./memory";
import { loadBolts } from "./quiver";

/** K: a front kick, on the floor or in the air, out of a free state or a shot's recovery */
export function pressKick(): boolean {
  const h = hero;
  if (!isFree() && !(h.state === "shoot" && sable.fired)) return false;
  sable.kicked = false;
  newSwing();
  setState("kick");
  sfx.swing(0.8);
  return true;
}

/** the boot lands on its frame and throws every foe it reaches away; in the air she springs back off them */
export function runKick(): void {
  const h = hero;
  if (!sable.kicked && h.st >= KICK.hit) {
    sable.kicked = true;
    const heavy = hasPerk("heavyBoot");
    const [x0, y0, x1, y1] = KICK.box;
    const hits = meleeHit([boxAhead(x0, y0, x1, y1)], {
      power: heavy ? KICK.heavyPower : KICK.power,
      kx: KICK.kx,
      ky: KICK.ky,
      stun: heavy ? KICK.heavyStun : KICK.stun,
      big: heavy,
      wall: heavy,
    });
    if (hits && !h.ground) {
      h.vy = Math.min(h.vy, -Math.sqrt(2 * 900 * KICK.airSpring));
      h.vx = -h.face * KICK.airPush;
    }
    if (hits && hasPerk("kickReload")) loadBolts(KICK.reloadBolts);
  }
  if (h.st >= KICK.dur) settle();
}
