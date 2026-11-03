import { ENEMY_AIR } from "../../../constants/combat";
import { FEEL, PHANTOM_RAMP } from "../../../constants/combo";
import { frame } from "../../../constants/hero";
import { PAL, WORLD_COLORS } from "../../../constants/palette";
import type { MoveDef } from "../../../types/move";
import { PK } from "../../../types/particle";
import { createFloorRing } from "../../effects/floorRing";
import { createSlash } from "../../effects/slash";
import { meleeHit } from "../../meleeHit";
import { game, hero, particles, rng } from "../../state";
import { boxAhead, dust, shake } from "../../world";
import { gravityPull } from "../gravityWell";

const WHIRL = { cx: 0, cy: -18, R: 25, sy: 0.85, rot: 0, a0: -1.6, a1: 1.5, W: 7 };
const METEOR_REACH = 46;

/** the plunge lands: a ring of crystal, dust, and everything near the floor bounced up */
function meteorLanding(): void {
  game.swing++;
  game.fx.push(createFloorRing(hero.x, hero.y, METEOR_REACH, PAL.crystal, 0.45));
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, { cx: 0, cy: -4, R: 30, sy: 0.25, rot: 0, a0: 3.1, a1: 0, W: 7 }),
  );
  dust(hero.x - 8, hero.y, 6, -1);
  dust(hero.x + 8, hero.y, 6, 1);
  shake(0.25, 3);
  meleeHit([boxAhead(-METEOR_REACH, -26, METEOR_REACH, 4)], {
    power: 1.8,
    kx: 60,
    ky: 0,
    launch: -240,
    big: true,
    feel: FEEL.crush,
  });
  gravityPull();
}

/** the stomp drops at this speed once its tuck is over, and its landing hits this far to each side */
const STOMP = { tuck: 0.08, dive: 520, reach: 40 } as const;

/** the stomp lands: a wide ring, dust and rubble to both sides, and every foe near the floor knocked off its feet */
function stompLanding(): void {
  game.swing++;
  game.fx.push(createFloorRing(hero.x, hero.y, STOMP.reach, PAL.crystal, 0.4));
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
  meleeHit([boxAhead(-STOMP.reach, -22, STOMP.reach, 4)], {
    power: 2.2,
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
    turns: true,
    name: "Wheel slash",
    clip: "airWheel",
    pitch: 1.2,
    hits: [
      {
        at: frame(2),
        box: [-6, -44, 28, 10],
        power: 1.2,
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
    turns: true,
    name: "Scissor cut",
    clip: "airScissor",
    pitch: 1.35,
    hits: [
      {
        at: frame(2),
        box: [-8, -36, 30, 14],
        power: 1.3,
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
    turns: true,
    name: "Sky stomp",
    clip: "airStomp",
    pitch: 0.7,
    falls: true,
    untilLanding: true,
    // on the way down the feet spike anything under him into the floor
    hits: [
      {
        at: STOMP.tuck,
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
    hits: [
      {
        at: 0.06,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -150,
        around: true,
        slash: WHIRL,
        feel: FEEL.tap,
      },
      {
        at: 0.14,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -150,
        around: true,
        slash: { ...WHIRL, a0: 1.5, a1: 4.6 },
        feel: FEEL.tap,
      },
      {
        at: 0.22,
        box: [-4, -42, 28, 6],
        power: 0.7,
        kx: 30,
        ky: 0,
        launch: -170,
        around: true,
        slash: WHIRL,
        feel: FEEL.light,
      },
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
      hero.vx = hero.face * 30;
    },
    step: (t) => {
      if (t > 0.1) hero.vy = 460;
    },
    land: meteorLanding,
  },
} satisfies Record<string, MoveDef>;
