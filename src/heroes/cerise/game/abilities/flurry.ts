import { FEEL } from "../../../../constants/combo";
import { createSlash } from "../../../../game/effects/slash";
import { settle } from "../../../../game/hero/actions";
import { skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { boxAhead, newSwing } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import { FLURRY } from "../../constants/abilities";
import { THRUST } from "../moves/slashes";
import { cerise } from "../state";
import { pointStrike } from "../strike";

/** the heights the Flurry's streaks fan through, in turn */
const STREAK_HEIGHT = [-17, -21, -14, -19, -16] as const;

/** the Flurry starts: seven thrusts, eleven held, two more for each Point it spent */
export function startFlurry(): void {
  cerise.flurryDone = 0;
  cerise.flurryCount = (cerise.castWide ? FLURRY.wideCount : FLURRY.count) + cerise.castSpent * FLURRY.perPoint;
}

/** one thrust of the Flurry; the last one knocks back, or held throws foes up; with Pinning Point each holds feet */
function flurryThrust(i: number, last: boolean): void {
  const wide = cerise.castWide;
  newSwing();
  const cy = STREAK_HEIGHT[i % STREAK_HEIGHT.length] - (wide && i % 2 ? 10 : 0);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...THRUST, cy, R: 26, W: 2, trail: 0.08 }));
  const damage = progress.stats.ap * FLURRY.power * cerise.castPower;
  const struck = pointStrike([boxAhead(...(wide ? FLURRY.wideBox : FLURRY.box))], {
    damage,
    source: "abilities",
    kx: last ? FLURRY.lastKick : 4,
    launch: last && wide ? FLURRY.wideLaunch : undefined,
    stagger: 0.3,
    heavy: last,
    feel: last ? FEEL.firm : { stop: 0.012, shake: [0.03, 0.5], pitch: 1.5 },
  });
  const pin = skillValues("ce_pin");
  if (pin.flurryHalt) for (const e of struck) e.halt = Math.max(e.halt, pin.halt);
  if (i % 2 === 0) sfx.swing(1.6 + (i % 3) * 0.1);
}

/** play the Flurry: a thrust every beat of it, then back to en garde */
export function runFlurry(): void {
  const h = hero;
  while (cerise.flurryDone < cerise.flurryCount && h.st >= FLURRY.start + cerise.flurryDone * FLURRY.gap) {
    flurryThrust(cerise.flurryDone, cerise.flurryDone === cerise.flurryCount - 1);
    cerise.flurryDone++;
  }
  if (h.st >= FLURRY.start + cerise.flurryCount * FLURRY.gap + FLURRY.tail) settle();
}
