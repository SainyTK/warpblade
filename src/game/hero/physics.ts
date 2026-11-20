import { HERO_MOVE as M } from "../../constants/combat";
import { approach } from "../../utils/math";
import { hero, progress } from "../state";
import { dust } from "../world";
import { inFreeState } from "./actions";
import { kit, moveDef } from "./kits";
import { strideAt } from "./strides";
import { landingAt, moveHeroX, wallSide } from "./terrain";
import { gripWall } from "./traversal";

/** casting, warping, charging and most air attacks hang in the air for a moment once Kael stops rising */
function floats(): boolean {
  const st = hero.state;
  if (st === "move") return !!hero.move && !moveDef(hero.move).falls;
  return (
    st === "throwWait" || st === "throw" || st === "warpStrike" || st === "cast" || st === "charge" || st === "ultimate"
  );
}

function land(): void {
  const h = hero;
  if (!h.ground && h.vy > 220) dust(h.x, h.y, 5);
  Object.assign(h, {
    vy: 0,
    ground: true,
    jumps: 0,
    airHits: 0,
    airDashed: false,
    whirled: false,
    droppedPlatform: null,
    travelMomentum: 0,
  });
}

/** walk, or run after a double tap; gravity; floors and ledges */
export function moveHero(dt: number, dir: number): void {
  const h = hero;
  const st = h.state;
  const shared = (h.running ? M.runSpeed : M.walkSpeed) * progress.stats.move;
  const speed = kit().walkSpeed?.(shared) ?? shared;
  const m = st === "move" && h.move ? moveDef(h.move) : null;
  const moveDriven = (!!m && (!!m.step || !!strideAt(m, h.st))) || kit().drivesMotion();
  if (inFreeState()) {
    if (h.travelMomentum > 0) {
      h.travelMomentum = Math.max(0, h.travelMomentum - dt);
    } else {
      h.vx = approach(h.vx, dir * speed, (h.ground ? M.groundAccel : M.airAccel) * dt);
      if (dir) h.face = dir;
    }
  } else {
    h.travelMomentum = 0;
    if (st !== "dash" && !moveDriven) h.vx = approach(h.vx, 0, (h.ground ? 800 : 300) * dt);
  }
  // a rise keeps full gravity, so nothing done mid-jump carries Kael above the jump's own height
  const hang = floats() && !h.ground && h.vy >= 0;
  const g = (st === "dash" ? 0 : hang ? 0.3 : 1) * kit().gravityScale();
  h.vy = Math.min(M.maxFall, h.vy + M.gravity * g * dt);
  if (hang && h.vy > 60) h.vy = 60;
  if (st === "dash") h.vy = 0;
  const nx = h.x + h.vx * dt;
  h.x = moveHeroX(h.x, h.y, nx);
  if (h.x !== nx && h.vx && wallSide(h.x, h.y) === Math.sign(h.vx)) {
    h.vx = 0;
    h.travelMomentum = 0;
  }
  gripWall(dir);
  const ny = h.y + h.vy * dt;
  const floor = h.vy >= 0 ? landingAt(h.x, h.y, ny, h.drop, h.droppedPlatform) : null;
  if (floor !== null) {
    h.y = floor;
    land();
    return;
  }
  h.y = ny;
  if (h.droppedPlatform && h.y > h.droppedPlatform.y + 1) h.droppedPlatform = null;
  if (h.ground) {
    h.ground = false;
    h.jumps = Math.max(h.jumps, 1);
  }
}
