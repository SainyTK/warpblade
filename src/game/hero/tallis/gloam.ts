import { GLOAM } from "../../../constants/tallis/gloam";
import { sfx } from "../../../services/audio";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { inCloud } from "./clouds";
import { tallis } from "./memory";

/** the most Gloam the bar holds: Shroud raises it */
export const gloamMax = (): number => GLOAM.max + (skillValues("t_shroud").max ?? 0);

/** how full the GL bar is, 0 to 1 */
export const gloamShare = (): number => Math.min(1, tallis.gloam / gloamMax());

export function addGloam(amount: number): void {
  tallis.gloam = Math.min(gloamMax(), tallis.gloam + amount);
}

/** a press Gloam could not pay for: the bar blinks and the shared deny tick plays */
export function denyGloam(): void {
  if (tallis.gloamFlash <= 0) sfx.denied();
  tallis.gloamFlash = GLOAM.flash;
}

/** a minion or mini boss near him really faces him (whatever it can see) */
function faced(): boolean {
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.rank === "boss" || Math.abs(e.x - hero.x) > GLOAM.seenReach) continue;
    if (Math.sign(hero.x - e.x) === e.face) return true;
  }
  return false;
}

/**
 * Gloam refills while he is Unseen: out of the Veil, and in his own smoke or with no foe near facing him. Shroud
 * quickens it and adds a trickle even while he is seen.
 */
export function refillGloam(dt: number): void {
  tallis.gloamFlash = Math.max(0, tallis.gloamFlash - dt);
  const v = skillValues("t_shroud");
  tallis.unseen = !tallis.veil && hero.state !== "dead" && (inCloud() || !faced());
  const rate = (tallis.unseen ? GLOAM.refill * (1 + (v.refill ?? 0)) : 0) + (v.trickle ?? 0);
  if (rate > 0) addGloam(rate * dt);
}
