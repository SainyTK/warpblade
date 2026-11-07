import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, WARPATH_RUN } from "../../../../../constants/ysra/glaive";
import type { MoveDef } from "../../../../../types/move";
import { skillValues } from "../../../../skills/query";
import { hero } from "../../../../state";
import { dust } from "../../../../world";
import { emitYsra } from "../../events";
import { spendCounter } from "../../stance/stance";
import { bowlOver } from "../bowl";
import { counterLanded, counterTune } from "../counter";
import { hookStruck } from "../hook";
import { setLungeCharge, startLunge } from "../lunge";
import { glaiveHit } from "../reach";
import { G_COUNTER, G_LASH, G_RUN, G_SKYHOOK, G_WINDMILL_BACK, G_WINDMILL_FRONT } from "../slashes";
import { windmillPassed } from "../windmill";
import { HELD_BLOWS } from "./held";

const windmill = () => skillValues("y_windmill");
const warpath = () => skillValues("y_warpath");
const hook = () => skillValues("y_skyhook");

/** one pass of the windmill: front passes on the first and third, back on the second and fourth */
const windmillPass = (n: number) =>
  glaiveHit(
    {
      at: frame(4 + n * 4),
      box: [-4, -46, 38, -10],
      power: 0.2,
      kx: -70,
      ky: -10,
      around: true,
      slash: n % 2 ? G_WINDMILL_BACK : G_WINDMILL_FRONT,
      feel: GLAIVE_FEEL.twirl,
    },
    { power: () => windmill().power ?? 0.2 },
  );

/** the windmill with this many passes; the last one closes it with Windmill's ring of fire */
const windmillMove = (id: "windmill" | "windmillFull", passes: number): MoveDef => ({
  id,
  name: "Windmill",
  clip: "yWindmill",
  pitch: 1.05,
  hits: Array.from({ length: passes }, (_, n) => windmillPass(n)),
  afterHit: () => windmillPassed(hero.hitIndex === passes),
});

/** the running impale's two blows, from Warpath */
const runHit = (at: number, second: boolean) =>
  glaiveHit(
    {
      at,
      box: [0, -30, 40, -4],
      power: second ? 0.9 : 1.7,
      kx: second ? 200 : 260,
      ky: second ? -30 : -40,
      big: !second,
      wall: !second,
      slash: G_RUN,
      feel: second ? GLAIVE_FEEL.thrust : GLAIVE_FEEL.lunge,
    },
    { power: () => (second ? warpath().impale2 : warpath().impale) ?? 1 },
  );

/** she keeps the charge's speed through the running blows, then digs in */
function runOn(t: number): void {
  const h = hero;
  if (t < WARPATH_RUN.time) {
    h.vx = h.face * WARPATH_RUN.speed;
    emitYsra("travel", { x: h.x, y: h.y, from: "charge" });
  } else h.vx *= WARPATH_RUN.brake;
}

/** the glaive's situational, counter and running blows */
export const VARIANT_BLOWS = {
  skyhook: {
    id: "skyhook",
    name: "Skyhook",
    clip: "ySkyhook",
    pitch: 0.78,
    hits: [
      glaiveHit(
        {
          at: frame(5),
          box: [-2, -56, 34, 2],
          power: 2,
          kx: -30,
          ky: 0,
          big: true,
          slash: G_SKYHOOK,
          feel: GLAIVE_FEEL.sweep,
        },
        { power: () => hook().power ?? 2 },
      ),
    ],
    afterHit: hookStruck,
  },
  groundLash: {
    id: "groundLash",
    name: "Ground lash",
    clip: "yLash",
    pitch: 0.9,
    hits: [
      glaiveHit({
        at: frame(6),
        box: [-2, -16, 62, 2],
        power: 1,
        kx: -190,
        ky: 0,
        stun: 0.7,
        slash: { ...G_LASH, R: 52 },
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    afterHit: () => dust(hero.x + hero.face * 30, hero.y, 6, -hero.face),
  },
  windmill: windmillMove("windmill", 4),
  windmillFull: windmillMove("windmillFull", 5),
  counterThrust: {
    id: "counterThrust",
    name: "Counter thrust",
    clip: "yCounter",
    pitch: 0.5,
    guard: 0.25,
    hits: [
      glaiveHit(
        {
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
        },
        counterTune,
      ),
    ],
    enter: spendCounter,
    afterHit: counterLanded,
  },
  runningImpale: {
    id: "runningImpale",
    name: "Running impale",
    clip: "yRunImpale",
    pitch: 0.8,
    ghosts: 0.3,
    hits: [runHit(frame(3), false), runHit(frame(7), true)],
    step: runOn,
    afterHit: () => {
      if (hero.hitIndex === 1) bowlOver();
    },
  },
  /** Rail Lance: J while charging lets a full lunge go at once */
  railLunge: {
    ...HELD_BLOWS.heftLunge,
    id: "railLunge",
    enter: () => {
      setLungeCharge(1);
      startLunge();
    },
  },
} satisfies Record<string, MoveDef>;
