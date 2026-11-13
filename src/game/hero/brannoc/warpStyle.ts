import { AXE_BLOWS, KNOCKDOWN } from "../../../constants/brannoc/axe";
import { HUNT } from "../../../constants/brannoc/moves";
import { COMBO } from "../../../constants/combat";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { drawThrownAxe } from "../../effects/brannoc/thrownAxe";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { markStruck, struckThisSwing } from "../../world";
import { bloodRing } from "./bloodRing";
import { repay } from "./debt";
import { isBloodied } from "./fury";
import { brannocHost } from "./memory";
import { smear } from "./smear";
import { axeBox, strikeAxe } from "./strike";
import { CHOP_LAUNCH } from "./string";

const LONG_HUNT = "b_hunt";
const HEADLONG = "b_headlong";
/** the chop's reach, the shared arrival blow's box so his warp strikes as far as every hero's */
const CHOP_BOX = { near: -6, far: 30, low: 2, high: 40 } as const;

/** the Hunt chop: he rips the axe out of the foe it bit, at the shared warp's power; heavy on a foe caught winding up */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  const spec = AXE_BLOWS.huntChop;
  const bloodied = isBloodied();
  smear("huntChop", bloodied);
  if (foe) game.fx.push(createImpact(...enemyCenter(foe), hero.face, true));
  const b = CHOP_BOX;
  strikeAxe(
    {
      blow: "huntChop",
      hit: 0,
      power,
      kx: spec.kx[0],
      heavy: foe?.state === "wind",
      launch: skillValues(LONG_HUNT).launch ? CHOP_LAUNCH : undefined,
      stagger: COMBO.stagger,
      feel: spec.feel[0],
      bloodied,
      sure: sureCrit,
    },
    axeBox(b.near, b.far, b.low, b.high),
    struckThisSwing,
    markStruck,
  );
}

/**
 * Headlong: he lands headlong, and every foe round where he lands that the chop did not reach is struck; with its levels
 * minions stagger and are dragged in front of him (elites too), and Juggernaut throws them up
 */
function headlong(): void {
  const v = skillValues(HEADLONG);
  if (!v.power) return;
  const reached = bloodRing(hero.x, hero.y, withCharms("area", v.reach ?? 0), {
    damage: progress.stats.ad * v.power,
    stagger: !!v.stagger,
    launch: v.juggernaut ? KNOCKDOWN : undefined,
    spared: struckThisSwing,
  });
  if (!v.drag) return;
  for (const e of reached) {
    const drags = e.rank === "minion" && (!e.elite || !!v.elites);
    if (drags && e.hp > 0 && !e.air) e.x = hero.x + hero.face * HUNT.drag;
  }
}

/**
 * After the chop: the axe ripped out wins back a little more of the debt, Long Hunt marks the foe, Headlong strikes the
 * foes round where he lands, and the skills hear a Hunt landed
 */
function arrived(foe: Enemy | null): void {
  if (foe) repay(HUNT.repay, foe);
  const mark = skillValues(LONG_HUNT).mark ?? 0;
  if (mark && foe && foe.hp > 0) markFoe(foe, LONG_HUNT, 5, mark);
  headlong();
  emitSkillEvent({ type: "hunt", foe, air: brannocHost.air, from: brannocHost.from });
}

/**
 * Brannoc's warp, the Hunt: he hurls the great axe spinning at the nearest foe ahead (from the air, at a foe below), it
 * bites in, and he leaps after it and rips it out with the Hunt chop. Long Hunt shapes its numbers, Headlong strikes round
 * where he lands and its hurled axe cuts what it passes.
 */
export const BRANNOC_WARP: WarpStyle = {
  drawThrown: drawThrownAxe,
  strike,
  arrived,
  tune: () => ({ ...skillValues(LONG_HUNT), path: skillValues(HEADLONG).path }),
};
