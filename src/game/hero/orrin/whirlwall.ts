import { HERO_MOVE } from "../../../constants/combat";
import { WHIRLWALL } from "../../../constants/orrin/abilities";
import { SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { Point } from "../../../types/world";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { lowerWard, raiseWard, type ShotWard } from "../../shotWards";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, particles, progress, rng } from "../../state";
import { setState, settle } from "../actions";
import { canCast } from "./castCheck";
import { orrin } from "./memory";

/** the ring's centre over his head */
const ringAt = (): Point => ({ x: hero.x, y: hero.y - 22 });

/** the ward of the spin under way, one per co-op seat, kept to the host */
const live: { ward: (ShotWard & { x: number; y: number }) | null } = { ward: null };
rememberPerSeat(objectMemory(live, true));

/** a ward that follows the ring: the kit moves it each step while its hero is the one in play */
function makeWard(): ShotWard & { x: number; y: number } {
  const w = {
    x: hero.x,
    y: hero.y - 22,
    radius: WHIRLWALL.radius,
    at: (): Point => ({ x: w.x, y: w.y }),
    broke(x: number, y: number) {
      for (let i = 0; i < 6; i++)
        particles.spawn(PK.SPARK, x, y, rng.range(-120, 120), rng.range(-120, 60), rng.range(0.1, 0.2), {
          sparks: SPARKS.brass,
        });
      sfx.block();
    },
  };
  return w;
}

/** I: spin the chain over his head */
export function pressWhirl(): boolean {
  if (!canCast(orrin.whirlCd, WHIRLWALL.mp)) return true;
  hero.mp -= WHIRLWALL.mp;
  orrin.whirlCd = WHIRLWALL.cooldown;
  orrin.whirlTicks = 0;
  orrin.casting = "whirlwall";
  setState("whirl");
  const ward = makeWard();
  live.ward = ward;
  raiseWard(ward);
  sfx.rattle();
  emitSkillEvent({ type: "cast", ability: "whirlwall" });
  return true;
}

/** the ring cuts every foe in it each tick and shoves it outward */
function tick(): void {
  const c = ringAt();
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const d = Math.hypot(cx - c.x, cy - c.y);
    if (d > WHIRLWALL.radius) continue;
    const dir = Math.sign(cx - c.x) || hero.face;
    dealDamage(e, progress.stats.ap * WHIRLWALL.power, { fromX: c.x, kx: dir * 60, source: "abilities" });
    e.x += dir * (WHIRLWALL.push / (WHIRLWALL.time / WHIRLWALL.every));
  }
  sfx.swing(1.4);
}

/** let the ward fall, whether the spin ran out or was cut short */
export function endWhirl(): void {
  if (live.ward) lowerWard(live.ward);
  live.ward = null;
}

/** he walks at half speed while the ring spins; it ticks every fifth of a second and breaks every shot it meets */
export function runWhirl(): void {
  const h = hero;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  h.vx = dir * HERO_MOVE.walkSpeed * progress.stats.move * WHIRLWALL.walk;
  if (live.ward) {
    const c = ringAt();
    live.ward.x = c.x;
    live.ward.y = c.y;
  }
  while (orrin.whirlTicks < 6 && h.st >= (orrin.whirlTicks + 1) * WHIRLWALL.every) {
    orrin.whirlTicks++;
    tick();
  }
  if (h.st < WHIRLWALL.time) return;
  endWhirl();
  settle();
}
