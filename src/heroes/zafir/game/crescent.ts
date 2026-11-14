import { createSlash } from "../../../game/effects/slash";
import { setState } from "../../../game/hero/actions";
import { cutForSharedAction } from "../../../game/hero/sharedCut";
import { meleeHit } from "../../../game/meleeHit";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { game, hero } from "../../../game/state";
import { boxAhead, boxBehind, newSwing } from "../../../game/world";
import { CRESCENT, CRESCENT_ORBIT } from "../constants/abilities";
import { type CrescentFlight, createCrescent } from "./effects/crescent";
import { RING_CUT } from "./moves/slashes";
import { sandSound } from "./sound";
import { zafir } from "./state";

/** the scimitar in flight, if it is out; it holds an effect, so only the host keeps it */
const flight: { now: CrescentFlight | null } = { now: null };
rememberPerSeat(objectMemory(flight, true));

/** the blade is back in his hand */
function caught(): void {
  flight.now = null;
  zafir.bladeOut = false;
  hero.hasSword = true;
}

/** the crescent throw leaves his hand; wide, it circles him */
export function throwCrescent(wide: boolean, power: number): void {
  zafir.bladeOut = true;
  hero.hasSword = false;
  const fx = createCrescent(hero.face, wide, power * (wide ? CRESCENT_ORBIT.power : CRESCENT.power), caught);
  flight.now = fx;
  game.fx.push(fx);
  sandSound.whir();
}

/** J while the blade flies: it snaps back to his hand and he catches it in a cut round him; true when it was out */
export function recallBlade(): boolean {
  if (!zafir.bladeOut || !flight.now || hero.state === "hurt" || hero.state === "dead") return false;
  flight.now.recall();
  cutForSharedAction();
  setState("warpStrike");
  newSwing();
  const r = CRESCENT.catchReach;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, RING_CUT));
  meleeHit([boxAhead(-4, -36, r, -2), boxBehind(-4, -36, r, -2)], { power: CRESCENT.catchPower, kx: 40, ky: -30 });
  return true;
}

/** a fresh run, a fall: the blade is back in his hand and nothing flies */
export function resetCrescent(): void {
  flight.now?.recall();
  caught();
}
