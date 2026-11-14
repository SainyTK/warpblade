import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { FISSURE } from "../../constants/heft";
import { createFloorWave } from "../effects/floorWave";
import { createQuake } from "../effects/quake";

const ID = "br_launch";
/** the crash round a foe the slam drives down: how far, how high it reaches, and how long after the slam it lands */
const CRASH = { reach: 30, height: 24, delay: 0.12 } as const;

/** Skyward Heave: a launched foe the slam drives into the floor crashes onto the foes round it; Meteor Heave cracks the
 *  floor both ways where it lands. The heave's power and height are shaped in the kit */
export const skywardHeave: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, e) {
      const v = skillValues(ID);
      if (e.move !== "slam" || !e.airborne || !v.crash) return;
      const x = e.foe.x;
      const y = surfaceBelow(x, e.foe.y);
      game.fx.push(
        createQuake({
          x,
          y,
          reach: withCharms("area", CRASH.reach),
          damage: progress.stats.ad * v.crash,
          delay: CRASH.delay,
          launch: 0,
          height: CRASH.height,
          source: ID,
          skip: e.foe,
        }),
      );
      if (!skillEvolved(ID)) return;
      for (const face of [1, -1])
        game.fx.push(
          createFloorWave({
            x,
            y,
            face,
            reach: FISSURE.reach * 0.6,
            speed: FISSURE.speed,
            damage: progress.stats.ad * v.crashFissure,
            stun: FISSURE.stun,
            source: ID,
            kind: "fissure",
          }),
        );
    },
  },
};
