import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { createAccentRing } from "../../effects/jory/accentRing";
import { drawThrownMallet } from "../../effects/jory/thrownMallet";
import { enemyCenter } from "../../enemies/enemy";
import { meleeHit } from "../../meleeHit";
import { emitSkillEvent } from "../../skills/events";
import { game, hero } from "../../state";
import { boxAhead, dust } from "../../world";
import { jory } from "./memory";
import { smear } from "./smear";
import { sendCrashWave } from "./string";

/** the arrival crash: the mallet comes down in a Crash smear with its arcs, dealing exactly the shared power */
function strike(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  smear("crash", 0, jory.warpOnBeat);
  if (hero.ground) dust(hero.x + hero.face * 12, hero.y, 6);
  meleeHit([boxAhead(-6, -40, 30, 2)], { power, kx: 160, ky: -80, big: true, sureCrit });
}

/**
 * After the crash: a warp thrown on the beat lands as an Accent, with its ring on the foe and the `accent` event its
 * skills answer; on the floor, Crash Wave sends its wave from the arrival as from a Crash.
 */
function arrived(foe: Enemy | null): void {
  const onBeat = jory.warpOnBeat;
  jory.warpOnBeat = false;
  if (hero.ground) sendCrashWave(false);
  if (!onBeat || !foe) return;
  const [cx, cy] = enemyCenter(foe);
  game.fx.push(createAccentRing(cx, cy));
  if (foe.hp > 0) emitSkillEvent({ type: "accent", foe, blow: "crash", downbeat: jory.warpDownbeat });
}

/** Jory's warp: a mallet spun end over end at the foe, and he arrives with a crash; on the beat it is an Accent */
export const JORY_WARP: WarpStyle = {
  drawThrown: drawThrownMallet,
  strike,
  arrived,
};
