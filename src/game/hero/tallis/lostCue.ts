import { AWARENESS } from "../../../constants/awareness";
import { game, hero } from "../../state";
import { tallisHost } from "./memory";

/**
 * The lost cue: the moment he slips out of sight, every minion near him that was facing him shows a grey question mark
 * for a moment. Runs every step with whether he is hidden now.
 */
export function watchLost(hidden: boolean, dt: number): void {
  const host = tallisHost;
  for (const l of host.lost) l.left -= dt;
  host.lost = host.lost.filter((l) => l.left > 0 && l.foe.hp > 0);
  if (hidden && !host.wasHidden)
    for (const e of game.enemies) {
      if (e.hp <= 0 || e.rank !== "minion" || Math.abs(e.x - hero.x) > AWARENESS.lostReach) continue;
      if (Math.sign(hero.x - e.x) !== e.face) continue;
      host.lost = host.lost.filter((l) => l.foe !== e);
      host.lost.push({ foe: e, left: AWARENESS.lostTime });
    }
  host.wasHidden = hidden;
}
