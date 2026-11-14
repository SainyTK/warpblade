import { hero } from "../../../game/state";
import { FOCUS } from "../constants/focus";
import { bladeOut } from "./blade";
import { sayaSound } from "./sound";
import { saya } from "./state";

/** a breath of Focus fills at once: a parry, a perfect dodge, a clean sheathe */
export function gainBreath(): void {
  if (saya.breaths >= FOCUS.max) return;
  saya.breaths++;
  saya.rest = 0;
  sayaSound.breath();
}

/** a draw starts: it spends a breath when she has one, and then reaches farther and stores more */
export function beginDraw(): void {
  saya.breathDraw = saya.breaths > 0;
  if (!saya.breathDraw) return;
  saya.breaths--;
  saya.spent = FOCUS.flash;
}

/** the factor on what the draw under way stores */
export const drawStore = (): number => (saya.breathDraw ? FOCUS.store : 1);
/** px the draw under way reaches past its blow */
export const drawReach = (): number => (saya.breathDraw ? FOCUS.reach : 0);

/** breaths fill while the blade rests and she is not hurt; a perfect dodge gives one */
export function tickFocus(dt: number): void {
  saya.spent = Math.max(0, saya.spent - dt);
  if (hero.state === "dash" && hero.perfectUsed && !saya.perfectSeen) {
    saya.perfectSeen = true;
    gainBreath();
  }
  if (hero.state !== "dash") saya.perfectSeen = false;
  if (bladeOut() || hero.state === "hurt" || hero.state === "dead" || saya.breaths >= FOCUS.max) {
    saya.rest = 0;
    return;
  }
  saya.rest += dt;
  if (saya.rest >= FOCUS.rest) gainBreath();
}
