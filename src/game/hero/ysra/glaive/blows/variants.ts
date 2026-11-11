import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, GLAIVE_STRING, WARPATH_RUN } from "../../../../../constants/ysra/glaive";
import type { MoveDef } from "../../../../../types/move";
import { skillLevel, skillValues } from "../../../../skills/query";
import { hero } from "../../../../state";
import { emitYsra } from "../../events";
import { spendCounter } from "../../stance/stance";
import { bowlOver } from "../bowl";
import { counterLanded, counterTune } from "../counter";
import { hookStruck } from "../hook";
import { setLungeCharge, startLunge } from "../lunge";
import { glaiveHit } from "../reach";
import { G_COUNTER, G_RUN, G_SKYHOOK, G_WINDMILL_BACK, G_WINDMILL_FRONT } from "../slashes";
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
      box: [-4, -58, 38, -10],
      power: 0.2,
      kx: -70,
      ky: -10,
      stagger: GLAIVE_STRING.stagger,
      around: true,
      slash: n % 2 ? G_WINDMILL_BACK : G_WINDMILL_FRONT,
      feel: GLAIVE_FEEL.windmill,
    },
    { power: () => windmill().power ?? 0.2 },
  );

/** after a pass: Windmill's pull and embers; the last pass closes it with the ring of fire, and hooks flyers down when
 *  Skyhook is held too */
function windmillStruck(passes: number): void {
  const last = hero.hitIndex === passes;
  windmillPassed(last);
  if (last && skillLevel("y_skyhook")) hookStruck();
}

/** the windmill with this many passes, the string's middle blow while Windmill is held */
const windmillMove = (id: "windmill" | "windmillFull", passes: number): MoveDef => ({
  id,
  name: "Windmill",
  clip: "yWindmill",
  pitch: 1.05,
  cancel: GLAIVE_STRING.cancel.sweep,
  hits: Array.from({ length: passes }, (_, n) => windmillPass(n)),
  afterHit: () => windmillStruck(passes),
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

/** the glaive's skill, counter and running blows */
export const VARIANT_BLOWS = {
  skyhook: {
    id: "skyhook",
    name: "Skyhook",
    clip: "ySkyhook",
    pitch: 0.78,
    cancel: GLAIVE_STRING.cancel.sweep,
    hits: [
      glaiveHit(
        {
          at: frame(5),
          box: [-2, -56, 34, 2],
          power: 2,
          kx: -30,
          ky: 0,
          stagger: GLAIVE_STRING.stagger,
          big: true,
          slash: G_SKYHOOK,
          feel: GLAIVE_FEEL.sweep,
        },
        { power: () => hook().power ?? 2 },
      ),
    ],
    afterHit: hookStruck,
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
