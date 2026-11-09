import { W } from "../../../constants/stage";
import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import type { Wick } from "../../../types/wenna";
import { clamp } from "../../../utils/math";
import { enemyBox } from "../../enemies/enemy";
import { addFoeHold } from "../../enemies/holds";
import { kindOf } from "../../enemies/kinds";
import { game } from "../../state";
import { hurtWick, isUp } from "./wicks";
import { allWicks } from "./wickWorld";

/** a Wick its owner still tends, risen and on its feet */
const holding = (w: Wick): boolean => isUp(w) && w.ground && game.t - w.tended <= WICK.untended;

/** foes that go under or over a Wick: fliers, foes in the air, a Void Stalker sunk in the floor */
function passes(e: Enemy): boolean {
  if (e.hp <= 0 || e.air || kindOf(e.type).flies) return true;
  return e.state === "burrow" || (e.type === "stalker" && e.state === "charge");
}

/** a held foe burns the Wick it presses against for its contact damage once a second; a heavy foe burns it double */
function burn(w: Wick, e: Enemy, heavy: boolean, dt: number): void {
  w.held += dt;
  if (w.held < WICK.holdEvery) return;
  w.held -= WICK.holdEvery;
  hurtWick(w, WICK.holdBurn * e.power * (heavy ? 2 : 1));
}

/**
 * A ground minion that walks into a Wick stops at the Wick's front edge, and a charge into it ends there. Elites, mini
 * bosses and the Warden push through: the Wick is shoved back and burned twice as hard. Fliers pass over.
 */
function holdFoe(e: Enemy, before: number, dt: number): void {
  if (passes(e)) return;
  const box = enemyBox(e);
  const off = (box[0] + box[2]) / 2 - e.x;
  const half = (box[2] - box[0]) / 2;
  const heavy = e.rank !== "minion" || e.elite;
  for (const w of allWicks()) {
    if (!holding(w) || Math.abs(e.y - w.y) > 4) continue;
    const gap = half + WICK.half;
    const d = e.x + off - w.x;
    if (Math.abs(d) > gap + 1) continue;
    const side = Math.sign(before + off - w.x) || Math.sign(d) || 1;
    burn(w, e, heavy, dt);
    if (heavy) {
      if (w.shoved > 0) continue;
      w.shoved = 0.5;
      w.x = clamp(w.x - side * WICK.pushBack, 6, W - 6);
      hurtWick(w, WICK.holdBurn * e.power * 2);
      continue;
    }
    if (side * d >= gap) continue;
    e.x = w.x + side * gap - off;
    // a charge spends itself on the Wick, as on a pin
    if (e.state === "lunge" && Math.abs(e.vx) > 60) Object.assign(e, { state: "recover", st: 0 });
    if (Math.sign(e.vx) === -side) e.vx = 0;
  }
}

addFoeHold(holdFoe);
