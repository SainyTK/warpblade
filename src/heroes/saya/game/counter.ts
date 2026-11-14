import { createSlash } from "../../../game/effects/slash";
import { setState, settle } from "../../../game/hero/actions";
import { meleeHit } from "../../../game/meleeHit";
import { game, hero } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import { COUNTER_DRAW } from "../constants/guard";
import { BEATS } from "../constants/timing";
import { sheatheFlash } from "./effects/sheatheFlash";
import { gainBreath } from "./focus";
import { SLASHES } from "./moves/slashes";
import { sayaSound } from "./sound";
import { beginBeat, saya } from "./state";
import { releaseCuts } from "./store";

/** a parry: the counter draw starts out of the guard, and the parry gives a breath */
export function startCounter(): void {
  beginBeat();
  setState("counter");
  gainBreath();
  sayaSound.draw();
}

/** the counter draw: one cut at the attacker, a sure critical hit, then the click releases every stored cut */
export function runCounter(): void {
  const h = hero;
  if (!saya.struck && h.st >= BEATS.counter.hit) {
    saya.struck = true;
    newSwing();
    game.fx.push(createSlash(h.x, h.y, h.face, SLASHES.counter));
    meleeHit([boxAhead(-4, -42, 42, 2)], {
      power: COUNTER_DRAW.power,
      kx: COUNTER_DRAW.kx,
      ky: COUNTER_DRAW.ky,
      big: true,
      sureCrit: true,
    });
  }
  if (!saya.clicked && h.st >= BEATS.counter.click) {
    saya.clicked = true;
    sayaSound.click();
    sheatheFlash();
    releaseCuts(true);
  }
  if (h.st >= BEATS.counter.end) settle();
}
