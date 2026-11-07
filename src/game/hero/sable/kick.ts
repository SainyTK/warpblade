import { KICK } from "../../../constants/sable/moves";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { enemyCenter } from "../../enemies/enemy";
import { meleeHit } from "../../meleeHit";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { boxAhead, newSwing, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { burst } from "./bolt/burst";
import { createFlyingFoe } from "./bolt/flyingFoe";
import { sable } from "./memory";
import { chargeBolts, loadBolts, quiverSize } from "./quiver";
import { kickKegs } from "./spells/keg";

/** K: a front kick, on the floor or in the air, out of a free state or a shot's recovery */
export function pressKick(): boolean {
  const h = hero;
  if (!isFree() && !(h.state === "shoot" && sable.fired)) return false;
  sable.kicked = false;
  sable.string = 0;
  newSwing();
  setState("kick");
  sfx.swing(0.8);
  return true;
}

/** Heavy Boot's gains from a kick that landed on these foes */
function heavyBoot(foes: readonly Enemy[]): void {
  const v = skillValues("s_heavyBoot");
  if (v.load) loadBolts(v.load);
  if (v.charged) chargeBolts(v.charged);
  if (v.airRefill && !hero.ground) sable.airShots = 0;
  if (v.bodies) for (const e of foes) game.fx.push(createFlyingFoe(e, hero.face, v.bodies));
  if (v.shock) {
    const [cx, cy] = enemyCenter(foes[0]);
    burst({ x: cx, y: cy, radius: v.radius, power: v.shock });
  }
  if (v.refill && foes.length >= v.refill) loadBolts(quiverSize());
}

/** the foes the boot reached this swing */
const struckFoes = (): Enemy[] => game.enemies.filter((e) => e.hp > 0 && struckThisSwing(e));

/** the boot lands on its frame and throws every foe it reaches away; in the air she springs back off them */
export function runKick(): void {
  const h = hero;
  if (!sable.kicked && h.st >= KICK.hit) {
    sable.kicked = true;
    const v = skillValues("s_heavyBoot");
    const [x0, y0, x1, y1] = KICK.box;
    const wide = v.wide ?? 1;
    const box = boxAhead(x0, y0 * wide, x1 * wide, y1);
    kickKegs(box);
    const hits = meleeHit([box], {
      power: v.power ?? KICK.power,
      kx: KICK.kx,
      ky: KICK.ky,
      stun: v.stun ?? KICK.stun,
      big: !!v.power,
      wall: !!v.wall,
    });
    if (hits) {
      const foes = struckFoes();
      if (!h.ground) {
        h.vy = Math.min(h.vy, -Math.sqrt(2 * 900 * KICK.airSpring));
        h.vx = -h.face * KICK.airPush;
      }
      if (foes.length) {
        heavyBoot(foes);
        emitSkillEvent({ type: "kick", foes });
      }
    }
  }
  if (h.st >= KICK.dur) settle();
}
