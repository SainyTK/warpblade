import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { WENNA_JUMP_RISE } from "../../../constants/wenna/motion";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, particles, progress, rng } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { takeOff } from "../takeoff";
import { wenna } from "./memory";
import { inRecovery } from "./string";
import { loadOf, plan } from "./wickMoves";
import { isUp, liveWicks } from "./wicks";

const HOP = "w_hop";
/** a hop off a Wick's head needs her this near it, side to side, and this far above its feet */
const OVER = { side: 10, above: 8, below: 40 } as const;
/** Wick Hop's flare reach */
const FLARE_REACH = 24;

/** her Wick under her feet in the air, near enough to hop off its head */
function wickBelow(): Wick | null {
  for (const w of liveWicks()) {
    if (!isUp(w)) continue;
    const above = w.y - hero.y;
    if (Math.abs(w.x - hero.x) <= OVER.side && above >= OVER.above && above <= OVER.below) return w;
  }
  return null;
}

/** the hopped Wick flares, and with Candle Stair bites the foe nearest it at once */
function hopFlare(w: Wick): void {
  const v = skillValues(HOP);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, w.x, w.y - 12, rng.range(-60, 60), -rng.range(10, 60), 0.3, { col: PAL.wick[4] });
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - w.x, cy - (w.y - 8)) > FLARE_REACH) continue;
    if (v.flare) dealDamage(e, progress.stats.ap * v.flare, { fromX: w.x, kx: Math.sign(cx - w.x) * 50 });
    if (v.stair) plan(w, { kind: "call", foe: e, left: loadOf("call") });
  }
}

/** Wick Hop: in the air over one of her Wicks, Up jumps again off its head, as often as the skill allows */
function pressHop(): boolean {
  const v = skillValues(HOP);
  if (!v.hops) return false;
  const w = wickBelow();
  if (!w) return false;
  if (!v.stair && wenna.hops >= v.hops) return false;
  if (!isFree() && !inRecovery()) return false;
  wenna.hops++;
  wenna.hopped = true;
  hero.vy = 0;
  lift(v.rise ?? WENNA_JUMP_RISE, true);
  setState("jump");
  w.lunge = 0.15;
  hopFlare(w);
  sfx.doubleJump();
  emitSkillEvent({ type: "jump", air: true });
  return true;
}

/** Up: one jump from the floor; Down held drops through a ledge. In the air, a hop off a Wick's head with Wick Hop. */
export function pressJump(): boolean {
  const h = hero;
  if (!h.ground) return pressHop();
  if (!isFree() && !inRecovery()) return false;
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  takeOff(() => {
    lift(WENNA_JUMP_RISE, true);
    h.jumps = 1;
    setState("jump");
    dust(h.x, h.y, 4);
    emitSkillEvent({ type: "jump", air: false });
  });
  return true;
}
