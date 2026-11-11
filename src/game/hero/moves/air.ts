import { ENEMY_AIR } from "../../../constants/combat";
import { FEEL, onFrame, PHANTOM_RAMP } from "../../../constants/combo";
import { frame } from "../../../constants/hero";
import { METEOR_POWER, WHIRL_FEEL } from "../../../constants/kael/skillBlows";
import { AIR_CANCEL } from "../../../constants/kael/string";
import { PAL, WORLD_COLORS } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { PK } from "../../../types/particle";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { meleeHit } from "../../meleeHit";
import { skillEvolved, skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, rng } from "../../state";
import { boxAhead, dust, newSwing, shake } from "../../world";
import { gravityPull } from "../gravityWell";
import { skin } from "../skin";

const WHIRL = { cx: 0, cy: -18, R: 25, sy: 0.85, rot: 0, a0: -1.6, a1: 1.5, W: 7 };
/** each of the whirlwind's cuts strikes both sides and throws foes up */
const WHIRL_HIT = { box: [-4, -42, 28, 6], power: 0.92, kx: 30, ky: 0, launch: -150, around: true } as const;
/** the meteor lands this far to each side and drifts forward this fast */
const METEOR = { reach: 46, drift: 30 } as const;
const SKILL = "k_skydance";
/** the stomp's power and reach on each side, from Sky Dance */
const stompPower = (): number => skillValues(SKILL).stomp ?? 2.2;
const stompReach = (base: number): number => Math.max(base, withCharms("area", skillValues(SKILL).stompReach ?? base));

/** Comet Dance: the landing is a comet, a wide crystal ring that strikes hard and draws foes in to its middle */
function cometLanding(): boolean {
  if (!skillEvolved(SKILL)) return false;
  const v = skillValues(SKILL);
  const reach = withCharms("area", v.cometReach);
  game.fx.push(createFloorRing(hero.x, hero.y, reach, PAL.crystal, 0.55));
  game.fx.push(createFloorRing(hero.x, hero.y, reach * 0.6, skin.ramp, 0.4));
  lights.add(hero.x, hero.y - 10, reach, PAL.crystal[4], 0.9, 0.4);
  for (let i = 0; i < 20; i++) {
    const side = i % 2 ? 1 : -1;
    particles.spawn(
      PK.SHARD,
      hero.x,
      hero.y - 2,
      side * rng.range(40, 200),
      rng.range(-220, -80),
      rng.range(0.4, 0.9),
      {
        col: rng.pick(PAL.crystal.slice(3)),
        size: rng.range(1.5, 3),
      },
    );
  }
  shake(0.32, 4);
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - hero.x) > reach || Math.abs(e.y - hero.y) > 40) continue;
    e.vx -= Math.sign(e.x - hero.x) * 160;
  }
  meleeHit([boxAhead(-reach, -30, reach, 4)], {
    power: v.comet,
    kx: 0,
    ky: -60,
    stun: 0.8,
    big: true,
    feel: FEEL.crush,
  });
  return true;
}

/** the plunge lands: a ring of crystal, dust, and everything near the floor bounced up */
function meteorLanding(): void {
  newSwing();
  gravityPull();
  if (cometLanding()) return;
  const reach = stompReach(METEOR.reach);
  game.fx.push(createFloorRing(hero.x, hero.y, reach, skin.ramp, 0.45));
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, { cx: 0, cy: -4, R: 30, sy: 0.25, rot: 0, a0: 3.1, a1: 0, W: 7 }),
  );
  dust(hero.x - 8, hero.y, 6, -1);
  dust(hero.x + 8, hero.y, 6, 1);
  shake(0.25, 3);
  meleeHit([boxAhead(-reach, -26, reach, 4)], {
    power: stompPower() * METEOR_POWER,
    kx: 60,
    ky: 0,
    launch: -240,
    big: true,
    feel: FEEL.crush,
  });
}

/** the stomp drops at this speed once its tuck is over, and its landing hits this far to each side */
const STOMP = { tuck: frame(5), dive: 520, reach: 40 } as const;

/** the stomp lands: a wide ring, dust and rubble to both sides, and every foe near the floor knocked off its feet */
function stompLanding(): void {
  newSwing();
  gravityPull();
  if (cometLanding()) return;
  const reach = stompReach(STOMP.reach);
  game.fx.push(createFloorRing(hero.x, hero.y, reach, skin.ramp, 0.4));
  dust(hero.x - 6, hero.y, 7, -1);
  dust(hero.x + 6, hero.y, 7, 1);
  for (let i = 0; i < 8; i++) {
    const side = i % 2 ? 1 : -1;
    particles.spawn(
      PK.SHARD,
      hero.x,
      hero.y - 1,
      side * rng.range(30, 130),
      rng.range(-170, -60),
      rng.range(0.4, 0.8),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  }
  shake(0.24, 3);
  meleeHit([boxAhead(-reach, -22, reach, 4)], {
    power: stompPower(),
    kx: 120,
    ky: -60,
    stun: 0.8,
    big: true,
    feel: FEEL.crush,
  });
}

/** the air string: a wheel, a scissor cut that pops the foe up, then the stomp that takes Kael down to the floor */
export const AIR_MOVES = {
  airWheel: {
    id: "airWheel",
    name: "Wheel slash",
    clip: "airWheel",
    pitch: 1.2,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(5),
        box: [-6, -44, 28, 10],
        power: 1.7,
        kx: 30,
        ky: -40,
        // the blade comes round the whole body: from high behind, over the head, down in front and under the feet
        slash: { cx: 1, cy: -19, R: 19, sy: 1, rot: 0, a0: -2.5, a1: 3.5, W: 6, sweep: 0.12, hold: 0.03, trail: 0.22 },
        feel: FEEL.light,
      },
    ],
  },
  airScissor: {
    id: "airScissor",
    name: "Scissor cut",
    clip: "airScissor",
    pitch: 1.35,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(5),
        box: [-8, -36, 30, 14],
        power: 1.85,
        kx: 40,
        ky: -120,
        // from low behind, under his feet, and up in front
        slash: { cx: 3, cy: -14, R: 21, sy: 0.75, rot: 0, a0: 2.7, a1: -0.9, W: 8, ramp: PHANTOM_RAMP },
        feel: { ...FEEL.firm, pitch: 1.2 },
      },
    ],
  },
  airStomp: {
    id: "airStomp",
    name: "Sky stomp",
    clip: "airStomp",
    pitch: 0.7,
    falls: true,
    untilLanding: true,
    // on the way down the feet spike anything under him into the floor
    hits: [
      {
        at: onFrame(5),
        box: [-12, -24, 16, 14],
        power: 1.2,
        kx: 20,
        ky: ENEMY_AIR.spike,
        spike: true,
        feel: FEEL.firm,
      },
    ],
    afterHit: gravityPull,
    step: (t) => {
      hero.vx = 0;
      hero.vy = t < STOMP.tuck ? Math.min(hero.vy, -30) : STOMP.dive;
    },
    land: stompLanding,
  },
  whirl: {
    id: "whirl",
    name: "Whirlwind",
    clip: "spin",
    pitch: 1.2,
    cancel: AIR_CANCEL,
    hits: [
      { ...WHIRL_HIT, at: onFrame(5), slash: WHIRL, feel: WHIRL_FEEL[0] },
      { ...WHIRL_HIT, at: onFrame(8), slash: { ...WHIRL, a0: 1.5, a1: 4.6 }, feel: WHIRL_FEEL[1] },
      { ...WHIRL_HIT, at: onFrame(11), launch: -170, slash: WHIRL, feel: WHIRL_FEEL[2] },
    ],
    lift: 14,
    enter: () => {
      hero.whirled = true;
    },
  },
  meteor: {
    id: "meteor",
    name: "Meteor drop",
    clip: "plunge",
    hits: [],
    guard: 9,
    untilLanding: true,
    falls: true,
    pitch: 0.6,
    lift: 6,
    enter: () => {
      hero.vx = hero.face * METEOR.drift;
    },
    // the same tuck and dive as the stomp it replaces
    step: (t) => {
      hero.vy = t < STOMP.tuck ? Math.min(hero.vy, -30) : STOMP.dive;
    },
    land: meteorLanding,
  },
} satisfies Record<string, MoveDef>;
