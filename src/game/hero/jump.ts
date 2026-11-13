import { HERO_MOVE as M } from "../../constants/combat";
import { GROUND } from "../../constants/stage";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import { createFloorRing } from "../effects/floorRing";
import { isHeld } from "../input";
import { emitSkillEvent } from "../skills/events";
import { game, hero, particles, rng } from "../state";
import { dust } from "../world";
import { isFree, setState } from "./actions";
import { blowsDone, endMove } from "./combo";
import { lift } from "./lift";
import { skin } from "./skin";
import { takeOff } from "./takeoff";

function doubleJumpBurst(): void {
  const h = hero;
  game.fx.push(createFloorRing(h.x, h.y, 14, skin.ramp, 0.3, 0.3));
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.FLAKE, h.x + rng.range(-6, 6), h.y, rng.range(-40, 40), rng.range(10, 50), rng.range(0.3, 0.6), {
      col: skin.ramp[rng.int(4, 6)],
    });
  sfx.doubleJump();
}

/** off the floor from a jump: the rise, the dust and the skill event */
function leaveFloor(): void {
  const h = hero;
  lift(M.jumpRise, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 4);
  emitSkillEvent({ type: "jump", air: false });
}

/** Up: jump, loading from a stand or a stride (at once out of an attack's follow-through), drop through a ledge with Down held, or jump again in the air */
export function jump(): boolean {
  const h = hero;
  // a jump cancels a move's follow-through and keeps the combo going in the air, leaving the floor at once
  const fromBlow = blowsDone();
  if (fromBlow) endMove();
  if (!isFree() && h.state !== "dash") return false;
  if (h.ground && isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  if (h.ground) {
    takeOff(leaveFloor, fromBlow);
    return true;
  }
  if (h.jumps >= 2) return false;
  lift(M.doubleJumpRise, true);
  h.jumps = 2;
  setState("jump");
  doubleJumpBurst();
  emitSkillEvent({ type: "jump", air: true });
  return true;
}
