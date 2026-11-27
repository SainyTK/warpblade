import { ENEMY_AIR } from "../../../../constants/combat";
import { onFrame } from "../../../../constants/combo";
import { frame } from "../../../../constants/hero";
import { WORLD_COLORS } from "../../../../constants/palette";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { meleeHit } from "../../../../game/meleeHit";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { fxRng, game, hero, particles, progress } from "../../../../game/state";
import { boxAhead, dust, newSwing, shake } from "../../../../game/world";
import type { MoveDef } from "../../../../types/move";
import { PK } from "../../../../types/particle";
import { CRIMSON } from "../../constants/colors";
import { SLASH } from "../../constants/slashes";
import { AIR_SLAM, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { craterLanding } from "../craterLanding";
import { brynnFx, PLANTED } from "../fx";
import { heftForBlow } from "../heft";

/** the falling slam drops at its dive speed once the tuck is over */
const TUCK = frame(6);
/** how hard Crater Leap drags foes in */
const PULL = 160;

/** Crater Leap: foes on the floor this close are dragged in toward where she lands */
function pullIn(reach: number): void {
  for (const e of game.enemies)
    if (e.hp > 0 && !e.air && Math.abs(e.x - hero.x) < reach && Math.abs(e.y - hero.y) < 20)
      e.vx -= Math.sign(e.x - hero.x) * PULL;
}

/** the falling slam lands: a ring each side knocks foes off their feet, and the landing ends a travel move */
function slamLanding(): void {
  newSwing();
  const v = skillValues("br_crater");
  const reach = withBuild("area", AIR_SLAM.reach + (v.reach ?? 0));
  game.fx.push(createFloorRing(hero.x, hero.y, reach, CRIMSON, 0.4));
  dust(hero.x - 6, hero.y, 7, -1);
  dust(hero.x + 6, hero.y, 7, 1);
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.SHARD,
      hero.x,
      hero.y - 1,
      (i % 2 ? 1 : -1) * fxRng.range(30, 130),
      fxRng.range(-170, -60),
      fxRng.range(0.4, 0.8),
      {
        col: WORLD_COLORS.rubble,
        size: fxRng.range(1.5, 3),
      },
    );
  shake(0.24, 3);
  if (v.pull) pullIn(v.pull);
  const damage = progress.stats.ad * (AIR_SLAM.ring + (v.ring ?? 0));
  brynnFx("br_crater", "burst", { x: hero.x, y: hero.y - 3, face: hero.face, reach: 14 }, { damage });
  brynnFx(
    "br_crater",
    "nova",
    { x: hero.x, y: hero.y, reach: reach * 0.7 },
    { damage, quiet: true, signature: PLANTED },
  );
  const hits = meleeHit([boxAhead(-reach, -22, reach, 4)], {
    power: AIR_SLAM.ring + (v.ring ?? 0),
    kx: 80,
    ky: -60,
    stun: AIR_SLAM.stun,
    launch: v.launch ? AIR_SLAM.launch : undefined,
    big: true,
    feel: STRING_FEEL.slam,
  });
  heftForBlow(hits, false);
  craterLanding(reach);
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
