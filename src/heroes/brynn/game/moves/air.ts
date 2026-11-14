import { ENEMY_AIR } from "../../../../constants/combat";
import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { WORLD_COLORS } from "../../../../constants/palette";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { meleeHit } from "../../../../game/meleeHit";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, particles, rng } from "../../../../game/state";
import { boxAhead, dust, newSwing, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { PK } from "../../../../types/particle";
import { CRIMSON } from "../../constants/colors";
import { AIR_SLAM, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { heftForBlow } from "../heft";
import { SLASH } from "./slashes";

/** the falling slam drops at its dive speed once the tuck is over */
const TUCK = frame(6);

/** the falling slam lands: a ring each side knocks foes off their feet, and the landing ends a travel move */
function slamLanding(): void {
  newSwing();
  const v = skillValues("br_crater");
  const reach = withCharms("area", AIR_SLAM.reach + (v.reach ?? 0));
  game.fx.push(createFloorRing(hero.x, hero.y, reach, CRIMSON, 0.4));
  dust(hero.x - 6, hero.y, 7, -1);
  dust(hero.x + 6, hero.y, 7, 1);
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.SHARD,
      hero.x,
      hero.y - 1,
      (i % 2 ? 1 : -1) * rng.range(30, 130),
      rng.range(-170, -60),
      rng.range(0.4, 0.8),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  shake(0.24, 3);
  const hits = meleeHit([boxAhead(-reach, -22, reach, 4)], {
    power: AIR_SLAM.ring + (v.ring ?? 0),
    kx: 80,
    ky: -60,
    stun: AIR_SLAM.stun,
    big: true,
    feel: STRING_FEEL.slam,
  });
  heftForBlow(hits, false);
  travelEnded();
}

/** the one air blow: a falling slam that spikes what it meets on the way down and lands in a ring */
export const AIR_MOVES = {
  airSlam: {
    id: "airSlam",
    name: "Falling Slam",
    clip: "airSlam",
    pitch: 0.65,
    falls: true,
    untilLanding: true,
    hits: [
      {
        at: onFrame(6),
        box: [-10, -26, 18, 14],
        power: STRING_POWER.airSlam,
        kx: 20,
        ky: ENEMY_AIR.spike,
        spike: true,
        slash: SLASH.airSlam,
        feel: STRING_FEEL.airSlam,
      },
    ],
    step: (t) => {
      hero.vx = 0;
      hero.vy = t < TUCK ? Math.min(hero.vy, -20) : AIR_SLAM.dive;
    },
    land: slamLanding,
  },
} satisfies Record<string, MoveDef>;
