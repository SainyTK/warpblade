import { CLIPS } from "../../constants/clips";
import { COST, ELEMENTS } from "../../constants/combat";
import { ELEMENT_COLOR } from "../../constants/palette";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import { TAU } from "../../utils/math";
import { createGlint } from "../effects/flash";
import { hasPerk } from "../progress";
import { castBolt } from "../spells/bolt";
import { castFire } from "../spells/fire";
import { castIce } from "../spells/ice";
import { game, hero, lights, particles, rng } from "../state";
import { leaveHang, setState } from "./actions";
import { endCombo } from "./combo";

/** Spellblade power for J J I */
const SPELLBLADE = 1.5;

export const castCost = (): number => COST.cast * (hasPerk("quickCast") ? 0.75 : 1);
/** how fast the cast clip plays */
export const castSpeed = (): number => (hasPerk("quickCast") ? 1.4 : 1);

/** I: start a cast; with Spellblade in an open combo it leaves the hand at once and hits harder */
export function startCast(spellblade: boolean): void {
  const h = hero;
  if (h.state === "hang") leaveHang();
  h.mp -= castCost();
  h.move = null;
  h.spellPower = spellblade ? SPELLBLADE : 1;
  setState("cast");
  if (spellblade) {
    endCombo(true);
    h.st = CLIPS.cast.hit;
  }
  sfx.cast();
}

/** while casting: streaks gather at the hand, then the spell leaves it */
export function runCast(): void {
  const h = hero;
  const element = ELEMENTS[game.spell];
  const c = ELEMENT_COLOR[element];
  const hx = h.x + h.face * h.hand[0];
  const hy = h.y + h.hand[1];
  if (h.st < CLIPS.cast.hit && rng.chance(0.6)) {
    const a = rng.range(0, TAU);
    const d = rng.range(14, 26);
    particles.spawn(
      PK.STREAK,
      hx + Math.cos(a) * d,
      hy + Math.sin(a) * d,
      -Math.cos(a) * 35,
      -Math.sin(a) * 35,
      rng.range(0.12, 0.18),
      {
        col: c,
      },
    );
  }
  if (h.hitDone || h.st < CLIPS.cast.hit) return;
  h.hitDone = true;
  lights.add(hx, hy, 30, c, 0.8, 0.2);
  game.fx.push(createGlint(hx, hy, c));
  const power = h.spellPower;
  game.fx.push(
    element === "fire"
      ? castFire(hx, hy, h.face, power)
      : element === "ice"
        ? castIce(h.x, h.y, h.face, power)
        : castBolt(h.x, h.y, h.face, power),
  );
}
