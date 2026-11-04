import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, SKYHOOK_RISE, WARPATH_RUN } from "../../../../../constants/ysra/glaive";
import type { MoveDef } from "../../../../../types/move";
import { hero } from "../../../../state";
import { dust } from "../../../../world";
import { lift } from "../../../lift";
import { emitYsra } from "../../events";
import { spendCounter } from "../../stance/stance";
import { glaiveHit } from "../reach";
import { G_COUNTER, G_LASH, G_RUN, G_SKYHOOK, G_WINDMILL_BACK, G_WINDMILL_FRONT } from "../slashes";

/** one pass of the windmill: front passes on the first and third, back on the second and fourth */
const windmillPass = (n: number) =>
  glaiveHit({
    at: frame(4 + n * 4),
    box: [-4, -46, 38, -10],
    power: 0.7,
    kx: -70,
    ky: -10,
    around: true,
    slash: n % 2 ? G_WINDMILL_BACK : G_WINDMILL_FRONT,
    feel: GLAIVE_FEEL.twirl,
  });

/** the glaive's held-key, counter and running blows */
export const VARIANT_BLOWS = {
  skyhook: {
    id: "skyhook",
    name: "Skyhook",
    clip: "ySkyhook",
    pitch: 0.78,
    hits: [
      glaiveHit({
        at: frame(5),
        box: [-2, -56, 34, 2],
        power: 1.3,
        kx: -30,
        ky: 0,
        launch: -330,
        big: true,
        slash: G_SKYHOOK,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    // a Skyhook that took over a jump just begun is not an air blow: the air sweep is still hers
    enter: () => {
      if (!hero.ground) hero.airHits = Math.max(0, hero.airHits - 1);
    },
    // she rises with the hook, after the foe
    afterHit: () => lift(SKYHOOK_RISE, false),
  },
  groundLash: {
    id: "groundLash",
    name: "Ground lash",
    clip: "yLash",
    pitch: 0.9,
    hits: [
      glaiveHit({
        at: frame(6),
        box: [-2, -16, 44, 2],
        power: 1,
        kx: -190,
        ky: 0,
        stun: 0.7,
        slash: G_LASH,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    afterHit: () => dust(hero.x + hero.face * 24, hero.y, 6, -hero.face),
  },
  windmill: {
    id: "windmill",
    name: "Windmill",
    clip: "yWindmill",
    pitch: 1.05,
    hits: [windmillPass(0), windmillPass(1), windmillPass(2), windmillPass(3)],
  },
  counterThrust: {
    id: "counterThrust",
    name: "Counter thrust",
    clip: "yCounter",
    pitch: 0.5,
    guard: 0.25,
    hits: [
      glaiveHit({
        at: frame(2),
        box: [0, -30, 46, -4],
        power: 3.75,
        kx: 300,
        ky: -70,
        stun: 1.1,
        big: true,
        wall: true,
        slash: G_COUNTER,
        feel: GLAIVE_FEEL.counter,
      }),
    ],
    enter: spendCounter,
  },
  runningImpale: {
    id: "runningImpale",
    name: "Running impale",
    clip: "yRunImpale",
    pitch: 0.8,
    ghosts: 0.3,
    hits: [
      glaiveHit({
        at: frame(3),
        box: [0, -30, 40, -4],
        power: 1.7,
        kx: 260,
        ky: -40,
        big: true,
        wall: true,
        slash: G_RUN,
        feel: GLAIVE_FEEL.lunge,
      }),
      glaiveHit({
        at: frame(7),
        box: [0, -30, 40, -4],
        power: 0.9,
        kx: 200,
        ky: -30,
        slash: G_RUN,
        feel: GLAIVE_FEEL.thrust,
      }),
    ],
    // she keeps the charge's speed through both blows, then digs in
    step: (t) => {
      const h = hero;
      if (t < WARPATH_RUN.time) {
        h.vx = h.face * WARPATH_RUN.speed;
        emitYsra("travel", { x: h.x, y: h.y, from: "charge" });
      } else h.vx *= WARPATH_RUN.brake;
    },
  },
} satisfies Record<string, MoveDef>;
