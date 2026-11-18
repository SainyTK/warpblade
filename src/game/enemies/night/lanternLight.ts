import { glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { game } from "../../state";
import { INNER_FIRE, MOON_RIM } from "./colors";
import { crookOf, lanternOf, shepherdPose } from "./shepherdPose";

const LIGHT = { radius: 40, strength: 0.35, enragedRadius: 46 } as const;

export function lanternPoint(e: Enemy, pose = shepherdPose(e, game.t)): [number, number] {
  const { center } = lanternOf(pose, crookOf(pose));
  return [e.x + e.face * center[0], e.y + center[1]];
}

export function createLanternLight(e: Enemy): Effect {
  return {
    update: () => e.hp > 0 && game.enemies.includes(e),
    draw() {
      place();
      const pose = shepherdPose(e, game.t);
      const [x, y] = lanternPoint(e, pose);
      const flicker = 0.85 + 0.15 * Math.sin(game.t * 13 + e.seed) * Math.sin(game.t * 5.3);
      const enraged = e.phase === 2 && e.state !== "burrow";
      const radius = enraged ? LIGHT.enragedRadius : LIGHT.radius;
      glow(x, y, radius, enraged ? INNER_FIRE[3] : MOON_RIM, LIGHT.strength * pose.glow * flicker);
    },
  };
}
