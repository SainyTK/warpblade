import { STOPPED_MOMENT } from "../../../constants/mirel/guard";
import type { Point } from "../../../types/world";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { mirel, mirelHost } from "./memory";
import { quicken } from "./quicken";

/** seconds of her past a Stopped Moment looks back over: Long Rewind looks further */
export const momentLook = (): number => skillValues("m_longrewind").back ?? STOPPED_MOMENT.back;

/**
 * After any rewind (a Stopped Moment, or Second Chance as its path ends): the HP given back, Backswing's window with
 * Undone's replay of the blows she landed in the time rewound, Quickened, and the `rewind` event.
 */
export function rewound(healed: number, from: Point, to: Point): void {
  const h = hero;
  const gain = Math.max(0, Math.min(progress.stats.hp - h.hp, healed));
  h.hp += gain;
  const now = game.t;
  const window = momentLook();
  mirelHost.replay = mirelHost.landed.filter((l) => now - l.t <= window).reduce((sum, l) => sum + l.damage, 0);
  mirel.sinceRewind = 0;
  quicken();
  emitSkillEvent({ type: "rewind", healed: gain, from, to });
}
