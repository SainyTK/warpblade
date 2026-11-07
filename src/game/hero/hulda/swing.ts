import { HERO_MOVE } from "../../../constants/combat";
import { HOLD, THROWS } from "../../../constants/hulda/grab";
import { HULDA_STRIDE } from "../../../constants/hulda/motion";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { markStruck, newSwing, struckThisSwing } from "../../world";
import { spreadFracture, throwPower } from "./fracture";
import { pin } from "./hold";

const ID = "h_giantSwing";
const G = THROWS.swing;

/** seconds the spin lasts before the release: its turns, or Cyclone's whole spin */
export function swingRelease(): number {
  const v = skillValues(ID);
  return v.cyclone > 0 ? v.cyclone : v.turns * G.turn;
}

/** the whole throw: the spin and the release's settle */
export const swingLength = (): number => swingRelease() + G.settle;

/** where the swing clip is sampled: its first two turns, its spin looped for more, then its own release and settle */
export function swingClipTime(st: number): number {
  const release = swingRelease();
  if (st >= release) return G.release + (st - release);
  if (st < G.release) return st;
  return G.loop + ((st - G.loop) % (G.release - G.loop));
}

/** the turn the spin is on, or Cyclone's beat: each one is a new swing, so a foe near is struck once in it */
const beat = (st: number): number => {
  const v = skillValues(ID);
  return Math.floor(v.cyclone > 0 ? st / G.beat : st / G.turn);
};

/** one struck foe: a heavy blow, knocked out from her, and dragged back in at higher levels */
function strike(o: Enemy, held: Enemy): void {
  const v = skillValues(ID);
  markStruck(o);
  const side = Math.sign(o.x - hero.x) || hero.face;
  dealDamage(o, progress.stats.ad * throwPower(o, v.power), {
    fromX: hero.x,
    kx: v.drag > 0 ? 0 : side * G.kx,
    stun: Math.max(v.stun, 0.3),
    heavy: true,
  });
  if (v.drag > 0) o.x -= side * Math.min(v.drag, Math.abs(o.x - hero.x) - 6);
  spreadFracture(held, o);
  sfx.hit(false, 0.8);
}

/**
 * The spin: the foe whirls round her at arm's length, and every foe near takes a blow each turn; from level 3 the swung
 * foe takes each turn's blow too. Cyclone keeps spinning while she walks.
 */
export function spin(e: Enemy, dt: number): void {
  const v = skillValues(ID);
  const h = hero;
  const st = h.st;
  const a = (st / G.turn) * Math.PI * 2;
  const fresh = beat(st) !== beat(st - dt);
  if (fresh) newSwing();
  if (v.cyclone > 0) {
    const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
    h.vx = h.ground ? dir * HERO_MOVE.walkSpeed * HOLD.walk * progress.stats.move : h.vx;
    h.runPhase = (h.runPhase + (dt * Math.abs(h.vx)) / HULDA_STRIDE) % 1;
  }
  pin(e, Math.cos(a) * 16, 6);
  if (fresh && v.heldHit && st > 0) {
    dealDamage(e, progress.stats.ad * v.power, { fromX: h.x, kx: 0, heavy: true });
  }
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0 || struckThisSwing(o)) continue;
    if (Math.abs(enemyCenter(o)[0] - h.x) > v.reach) continue;
    strike(o, e);
  }
}
