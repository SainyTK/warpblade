import { SMOKE_KNOT } from "../../../constants/tallis/abilities";
import { sfx } from "../../../services/audio";
import { emitSkillEvent } from "../../skills/events";
import { withCharms } from "../../skills/query";
import { hero } from "../../state";
import { setState, settle } from "../actions";
import { startAbility } from "./castCheck";
import { raiseCloud } from "./clouds";
import { tallis } from "./memory";

/** MP Smoke Knot costs, more for the big knot of a long press */
export const knotMp = (wide: boolean): number => (wide ? SMOKE_KNOT.wideMp : SMOKE_KNOT.mp);

/** I on Smoke Knot: paid in MP, its recharge started, the knot dropped at his feet on its frame; held, a bigger knot */
export function pressSmokeKnot(wide: boolean): boolean {
  if (!startAbility()) return false;
  const big = wide && hero.mp >= knotMp(true);
  hero.mp -= knotMp(big);
  tallis.knotCd = SMOKE_KNOT.cooldown;
  tallis.casting = "smokeKnot";
  tallis.castWide = big;
  if (hero.ground) hero.vx = 0;
  setState("knotCast");
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: "smokeKnot" });
  return true;
}

/** the knot drops and the cloud rolls out where he stands */
export function runKnotCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SMOKE_KNOT.hit) {
    h.hitDone = true;
    const area = withCharms("area", tallis.castWide ? SMOKE_KNOT.wideGrow : 1);
    raiseCloud(h.x, h.y, SMOKE_KNOT.width * area, SMOKE_KNOT.height * area, withCharms("duration", SMOKE_KNOT.life));
    sfx.evade();
  }
  if (h.st >= SMOKE_KNOT.dur) settle();
}
