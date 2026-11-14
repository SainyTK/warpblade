import { fleck, place } from "../../../engine/frame";
import { dealDamage } from "../../../game/damage";
import { skillEvolved, skillValues, withCharms } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { game, hero, progress } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { TAU } from "../../../utils/math";
import { GRAIN } from "../constants/palette";
import { leaveMirage } from "./mirage";
import { openWounds } from "./wounds";

const ID = "za_slip";
/** the sand cloud a dodge leaves: how wide it hangs and how long */
const CLOUD = { reach: 22, life: 0.7 } as const;

/** a cloud of sand hanging where the dodge started: minions in it are blinded */
function createCloud(x: number, y: number, blind: number): Effect {
  let t = 0;
  const reach = withCharms("area", CLOUD.reach);
  for (const e of foesOnScreen())
    if (e.rank === "minion" && Math.abs(e.x - x) <= reach) e.blind = Math.max(e.blind, withCharms("duration", blind));
  return {
    update(dt) {
      t += dt;
      return t < CLOUD.life;
    },
    drawBack() {
      place();
      const k = 1 - t / CLOUD.life;
      for (let i = 0; i < 30; i++) {
        const a = (i / 30) * TAU + t * 2;
        const r = reach * (0.3 + 0.7 * ((i * 7) % 10) * 0.1) * (0.6 + 0.4 * (1 - k));
        fleck(x + Math.cos(a) * r, y - 12 + Math.sin(a) * r * 0.5 - t * 8, GRAIN[i % GRAIN.length], k);
      }
    },
    draw() {},
  };
}

/** the dodge starts: Sand Slip's cloud where he stood, and evolved, a mirage */
export function slipStarted(): void {
  const v = skillValues(ID);
  if (v.cloud) game.fx.push(createCloud(hero.x, hero.y, v.cloud));
  if (skillEvolved(ID)) leaveMirage(hero.x, hero.y);
}

/** the dodge passes through a foe: Sand Slip cuts it and opens wounds */
export function slipPassed(e: Enemy): void {
  const v = skillValues(ID);
  if (!v.passCut) return;
  dealDamage(e, progress.stats.ad * v.passCut, { fromX: hero.x - hero.face * 6, kx: hero.face * 30, melee: true });
  openWounds(e, v.passWounds ?? 0);
}

/** Sand Slip from level 7: the dodge works in the air */
export const slipInAir = (): boolean => !!skillValues(ID).air;
