import { HERO_MOVE as M } from "../../constants/combat";
import { GROUND, PLATFORMS, W } from "../../constants/stage";
import { approach, clamp } from "../../utils/math";
import { take } from "../input";
import { hero, progress } from "../state";
import { dust, surfaceBelow } from "../world";
import { isFree, leaveHang, setState } from "./actions";
import { MOVES } from "./moves";
import { strideAt } from "./moves/advance";

/** casting, warping, charging and most air attacks hang in the air for a moment */
function floats(): boolean {
  const st = hero.state;
  if (st === "move") return !!hero.move && !MOVES[hero.move].falls;
  return (
    st === "throwWait" || st === "throw" || st === "warpStrike" || st === "cast" || st === "charge" || st === "ultimate"
  );
}

function land(): void {
  const h = hero;
  if (!h.ground && h.vy > 220) dust(h.x, h.y, 5);
  Object.assign(h, { vy: 0, ground: true, jumps: 0, airHits: 0, airDashed: false, whirled: false });
}

/** walk, or run after a double tap; gravity; floors and ledges */
export function moveHero(dt: number, dir: number): void {
  const h = hero;
  const st = h.state;
  if (st === "hang") {
    h.vx = 0;
    h.vy = 0;
    if (take("down")) {
      leaveHang();
      setState("fall");
    }
    return;
  }
  const speed = (h.running ? M.runSpeed : M.walkSpeed) * progress.stats.move;
  const m = st === "move" && h.move ? MOVES[h.move] : null;
  const moveDriven = !!m && (!!m.step || strideAt(m, h.st) > 0);
  if (isFree()) {
    h.vx = approach(h.vx, dir * speed, (h.ground ? M.groundAccel : M.airAccel) * dt);
    if (dir) h.face = dir;
  } else if (st !== "dash" && !moveDriven) h.vx = approach(h.vx, 0, (h.ground ? 800 : 300) * dt);
  const hang = floats() && !h.ground;
  const g = st === "dash" ? 0 : hang ? 0.3 : 1;
  h.vy = Math.min(M.maxFall, h.vy + M.gravity * g * dt);
  if (hang && h.vy > 60) h.vy = 60;
  if (st === "dash") h.vy = 0;
  h.x = clamp(h.x + h.vx * dt, 8, W - 8);
  const ny = h.y + h.vy * dt;
  let landed = false;
  if (h.vy >= 0) {
    if (ny >= GROUND) {
      h.y = GROUND;
      landed = true;
    } else if (h.drop <= 0)
      for (const p of PLATFORMS)
        if (h.x >= p.x0 - 3 && h.x <= p.x1 + 3 && h.y <= p.y + 0.01 && ny >= p.y) {
          h.y = p.y;
          landed = true;
          break;
        }
  }
  if (landed) return land();
  h.y = ny;
  if (h.ground && (surfaceBelow(h.x, h.y) > h.y + 0.5 || h.drop > 0 || h.vy !== 0)) {
    h.ground = false;
    h.jumps = Math.max(h.jumps, 1);
  }
}
