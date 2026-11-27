import { onFrame } from "../../../../constants/combo";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { meleeHit } from "../../../../game/meleeHit";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import { boxAhead, boxBehind, dust, newSwing } from "../../../../game/world";
import type { MoveDef, MoveHit } from "../../../../types/move";
import { SAND_RAMP } from "../../constants/palette";
import { SPIN_DROP, STRING_FEEL } from "../../constants/string";
import { zafirFx } from "../skillFx";
import { meteorDune } from "../spells/meteor";
import { walkThrough } from "../walkThrough";
import { openWounds } from "../wounds";
import { DROP_CUT } from "./slashes";

/** one half turn of the descent: a light cut on both sides that holds a foe in the air */
const dropCut = (frame: number): MoveHit => ({
  at: onFrame(frame),
  box: [-4, -34, 26, 4],
  power: 0.4,
  kx: 4,
  ky: -10,
  around: true,
  slash: DROP_CUT,
  feel: STRING_FEEL.spinDrop,
});

/** he lands out of the descent: a ring of sand cuts both sides and knocks foes off their feet; Falling Dune widens it,
 *  makes it throw foes up and open wounds, and as Meteor Dune raises a spout each way and a pit of quicksand */
function landRing(): void {
  const v = skillValues("za_falling");
  newSwing();
  const r = withBuild("area", SPIN_DROP.ring * (v.ringReach ?? 1));
  const struck = meleeHit([boxAhead(-4, -20, r, 2), boxBehind(-4, -20, r, 2)], {
    power: SPIN_DROP.ringPower * (v.ringPower ?? 1),
    kx: 60,
    ky: -40,
    stun: 0.5,
    launch: v.ringLaunch,
    big: true,
    feel: STRING_FEEL.spinLanding,
  });
  if (struck && v.ringWounds)
    for (const e of foesOnScreen()) if (Math.abs(e.x - hero.x) <= r) openWounds(e, v.ringWounds);
  game.fx.push(createFloorRing(hero.x, hero.y, r, SAND_RAMP, 0.35));
  if (skillLevel("za_falling")) {
    const ring = { x: hero.x, y: hero.y, face: hero.face, reach: r * 0.7 };
    zafirFx("za_falling", "nova", ring, { damage: progress.stats.ad * SPIN_DROP.ringPower * (v.ringPower ?? 1) });
  }
  dust(hero.x - 8, hero.y, 4, -1);
  dust(hero.x + 8, hero.y, 4, 1);
  if (skillEvolved("za_falling")) meteorDune();
}

/** the air string: one spinning descent per jump, cutting on every half turn until he lands */
export const AIR_MOVES = {
  spinDrop: {
    id: "spinDrop",
    name: "Spinning descent",
    clip: "spinDrop",
    pitch: 1.3,
    falls: true,
    untilLanding: true,
    enter: () => {
      hero.vy = Math.max(hero.vy, SPIN_DROP.fall);
    },
    step: walkThrough,
    land: landRing,
    hits: [dropCut(2), dropCut(6), dropCut(10), dropCut(14), dropCut(18)],
  },
} satisfies Record<string, MoveDef>;
