import { HANGING_ARC, SHOULDER_Y } from "../../../constants/orrin/string";
import { sfx } from "../../../services/audio";
import { createBrassCrescent } from "../../effects/orrin/brassCrescent";
import { createSlash } from "../../effects/slash";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { newSwing } from "../../world";
import { skin } from "../skin";
import { type ChainStrike, sweepChain, tipPoint } from "./chainHit";
import { orrin } from "./memory";
import { fullMomentum } from "./momentum";
import { blowReach } from "./reach";

const SKY = "o_skylash";
const STRIKE: ChainStrike = { spec: HANGING_ARC, blow: "hanging" };

/** Hanging Arcs per airtime: one, more with Sky Lash */
export const arcsPerAir = (): number => (skillLevel(SKY) ? skillValues(SKY).arcs : 1);

/** a landing or a latch hands the airtime's arcs back: all of them on the floor, one more on a latch */
export function giveArcBack(all: boolean): void {
  orrin.airArcs = all ? arcsPerAir() : Math.max(orrin.airArcs, 1);
}

/** J in the air: a Hanging Arc, drawn over whatever he is doing, swinging and flying included */
export function pressAirArc(): boolean {
  if (hero.ground || orrin.arc >= 0 || orrin.airArcs <= 0) return false;
  orrin.airArcs--;
  orrin.arc = 0;
  if (hero.state === "swing" || hero.state === "fly") orrin.arcSide = Math.sign(hero.vx) || hero.face;
  else orrin.arcSide = hero.face;
  hero.face = orrin.arcSide;
  newSwing();
  sfx.swing(1.05);
  return true;
}

/** Sky Lash's crescents leave the arc's tip; the evolution's pierce, and a second at full Momentum */
function throwCrescents(): void {
  const v = skillValues(SKY);
  if (!v.crescent) return;
  const [x, y] = tipPoint(STRIKE, HANGING_ARC.a1 * 0.6);
  const spec = { range: withCharms("area", 60), power: v.crescent, pierce: v.pierce > 0 };
  game.fx.push(createBrassCrescent(x, y, hero.face, spec));
  if (v.second && fullMomentum()) game.fx.push(createBrassCrescent(x, y - 8, hero.face, spec));
}

/** the arc's clock runs; it sweeps down across its hit frames and ends on its own or when he lands */
export function tickAirArc(dt: number): void {
  if (orrin.arc < 0) return;
  if (hero.ground) {
    orrin.arc = -1;
    return;
  }
  const b = HANGING_ARC;
  const before = orrin.arc;
  orrin.arc += dt * progress.stats.aspd;
  const t = orrin.arc;
  if (before < b.hit && t >= b.hit) {
    game.fx.push(
      createSlash(hero.x, hero.y, hero.face, {
        cx: 0,
        cy: -SHOULDER_Y,
        R: blowReach(b, "hanging"),
        sy: 1,
        rot: 0,
        a0: b.a0,
        a1: b.a1,
        W: 3,
        sweep: b.hitEnd - b.hit,
        trail: 0.12,
        ramp: skin.ramp,
      }),
    );
    throwCrescents();
  }
  if (t >= b.hit && before <= b.hitEnd) {
    const span = b.hitEnd - b.hit;
    const f0 = Math.max(0, (before - b.hit) / span);
    const f1 = Math.min(1, (t - b.hit) / span);
    if (f1 > f0 || f0 === 0) sweepChain(STRIKE, b.a0 + (b.a1 - b.a0) * f0, b.a0 + (b.a1 - b.a0) * f1);
  }
  if (t >= b.dur) orrin.arc = -1;
}
