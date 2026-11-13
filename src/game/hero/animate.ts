import { HERO_MOVE as M } from "../../constants/combat";
import { WORLD_COLORS } from "../../constants/palette";
import { PK } from "../../types/particle";
import { sashAnchor, scarfAnchor, tailAnchor } from "../../utils/poseFrame";
import { game, hero, particles, ponytail, scarf } from "../state";
import { inFreeState, setState } from "./actions";
import { kit } from "./kits";
import { heroPose } from "./pose";
import { skin } from "./skin";

/** pick the free state from the motion, step the stride, pose the body and swing the scarf and ponytail */
export function animateHero(dt: number): void {
  const h = hero;
  if (inFreeState()) {
    const moving = Math.abs(h.vx) > 15;
    const want = h.ground ? (moving ? (h.running ? "run" : "walk") : "idle") : h.vy < 0 ? "jump" : "fall";
    if (want !== h.state) setState(want);
  }
  if (h.state === "run" || h.state === "walk") {
    const prev = h.runPhase;
    const pace = h.state === "run" ? 1.9 : 2.4;
    const cycle = kit().stride?.(h.state === "run");
    const rate = cycle ? Math.abs(h.vx) / cycle : (Math.abs(h.vx) / M.runSpeed) * pace;
    h.runPhase = (h.runPhase + dt * rate) % 1;
    if (h.state === "run" && ((prev < 0.5 && h.runPhase >= 0.5) || h.runPhase < prev))
      particles.spawn(PK.DUST, h.x - h.face * 3, h.y - 1, -h.face * 15, -6, 0.35, {
        col: WORLD_COLORS.footDust,
        size: 1.6,
      });
  }
  h.pose = heroPose(h, game.t);
  // the scarf hangs off the neck (a sash off the belt) and the ponytail off the back of the head, blown back by a breeze
  // and by speed
  const p = h.pose;
  const wind = -h.face * (22 + Math.sin(game.t * 3.1) * 18) - h.vx * 1.4;
  const [kx, ky] = skin.sash ? sashAnchor(p) : scarfAnchor(p);
  const [tx, ty] = tailAnchor(p);
  // a sash at the belt hangs heavier than a scarf at the neck: it takes half the breeze
  scarf.step(h.x + h.face * kx, h.y + ky, dt, skin.sash ? wind * 0.5 : wind);
  ponytail.step(h.x + h.face * tx, h.y + ty, dt, wind * 0.6);
}
