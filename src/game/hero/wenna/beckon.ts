import { PAL } from "../../../constants/palette";
import { BECKON } from "../../../constants/wenna/abilities";
import { sfx } from "../../../services/audio";
import { createFloorRing } from "../../effects/floorRing";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, lights } from "../../state";
import { surfaceBelow } from "../../world";
import { setState } from "../actions";
import { canCast } from "./castCheck";
import { wenna } from "./memory";
import { leapTo, ringSpot } from "./wickAi";
import { wicksNear } from "./wicks";

/** I with Beckon: every Wick near her hops to stand in a ring round her, taking half damage while it holds */
export function pressBeckon(): boolean {
  if (!canCast(wenna.beckonCd, BECKON.mp)) return true;
  hero.mp -= BECKON.mp;
  wenna.beckonCd = BECKON.cooldown;
  wenna.casting = "beckon";
  if (hero.ground) hero.vx = 0;
  setState("beckonCast");
  const called = wicksNear(hero.x, hero.y, BECKON.reach);
  const floor = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y - 1);
  called.forEach((w, i) => {
    w.ring = BECKON.hold;
    w.slot = i;
    w.target = null;
    leapTo(w, ringSpot(i), floor, BECKON.leap);
  });
  game.fx.push(createFloorRing(hero.x, hero.y, BECKON.radius + 14, PAL.wick, 0.4));
  lights.add(hero.x, hero.y - 16, 40, PAL.wick[3], 0.6, 0.3);
  sfx.cast();
  sfx.chime(1);
  emitSkillEvent({ type: "cast", ability: "beckon" });
  return true;
}
