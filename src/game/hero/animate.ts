import { HERO_MOVE as M } from "../../constants/combat";
import { WORLD_COLORS } from "../../constants/palette";
import { PK } from "../../types/particle";
import { alongSpine, drawnPoint, headCenter } from "../../utils/poseFrame";
import { game, hero, particles, ponytail, scarf } from "../state";
import { isFree, setState } from "./actions";
import { heroPose } from "./pose";

/** pick the free state from the motion, step the stride, pose the body and swing the scarf and ponytail */
export function animateHero(dt: number): void {
  const h = hero;
  if (isFree()) {
    const moving = Math.abs(h.vx) > 15;
    const want = h.ground ? (moving ? (h.running ? "run" : "walk") : "idle") : h.vy < 0 ? "jump" : "fall";
    if (want !== h.state) setState(want);
  }
  if (h.state === "run" || h.state === "walk") {
    const prev = h.runPhase;
    const pace = h.state === "run" ? 1.9 : 2.4;
    h.runPhase = (h.runPhase + dt * (Math.abs(h.vx) / M.runSpeed) * pace) % 1;
    if (h.state === "run" && ((prev < 0.5 && h.runPhase >= 0.5) || h.runPhase < prev))
      particles.spawn(PK.DUST, h.x - h.face * 3, h.y - 1, -h.face * 15, -6, 0.35, {
        col: WORLD_COLORS.footDust,
        size: 1.6,
      });
  }
  if (h.state === "hang" && h.anchor) {
    h.x = h.anchor.x - h.face * 2;
    h.y = h.anchor.y + 38;
  }
  h.pose = heroPose(h, game.t);
  // the scarf hangs off the neck and the ponytail off the back of the head, blown back by a breeze and by speed
  const p = h.pose;
  const wind = -h.face * (22 + Math.sin(game.t * 3.1) * 18) - h.vx * 1.4;
  const [kx, ky] = drawnPoint(p, ...alongSpine(p, [p.nx, p.ny], -2, 0.5));
  const [hx, hy] = headCenter(p);
  const [tx, ty] = drawnPoint(p, hx - 4.5, hy - 1);
  scarf.step(h.x + h.face * kx, h.y + ky, dt, wind);
  ponytail.step(h.x + h.face * tx, h.y + ty, dt, wind * 0.6);
}
