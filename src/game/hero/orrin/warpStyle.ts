import { KICK_SLASH, WARP_BIND, WARP_KICK } from "../../../constants/orrin/guard";
import { SPARKS } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import type { Box } from "../../../types/world";
import { createImpact } from "../../effects/impact";
import { drawLinks } from "../../effects/orrin/chainLinks";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { staggerFoe } from "../../enemies/stagger";
import { meleeHit } from "../../meleeHit";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero } from "../../state";
import { boxAhead } from "../../world";
import { giveArcBack } from "./airArc";
import { bindFoe } from "./bind";
import { drawHook, linkGlint } from "./draw";
import { hooksPerAir } from "./hook";
import { orrin } from "./memory";
import { gainMomentum } from "./momentum";

const GAFF = "o_gaff";
/** pixels of chain drawn trailing the flying hook */
const TRAIL = 14;

/** the brass hook in flight, its point leading, a short run of chain whipping along behind it */
function drawThrown(x: number, y: number, angle: number): void {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  drawLinks(x - ux * TRAIL, y - uy * TRAIL, x, y, linkGlint());
  drawHook({ x, y }, ux, uy);
}

/** Harpoon: every foe within reach of the hooked one is dragged in against it before the kick lands */
function harpoon(target: Enemy, reach: number): void {
  const [tx, ty] = enemyCenter(target);
  for (const e of game.enemies) {
    if (e === target || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - tx, cy - ty) > reach) continue;
    e.x = tx + (Math.sign(cx - tx) || 1) * 8;
    e.stun = Math.max(e.stun, 0.3);
  }
}

/**
 * The warp kick: he lands beside the foe heel first, at the power given, with a short knockback so the foe stays in
 * reach. Gaff crits and staggers a foe winding up, rings the foes round it in and gives Momentum for a crit.
 */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  const v = skillValues(GAFF);
  if (foe && v.harpoon) harpoon(foe, withCharms("area", v.harpoon));
  const winding = !!foe && foe.state === "wind";
  const crit = sureCrit || v.sure > 0 || (v.windup > 0 && winding);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, KICK_SLASH));
  const boxes: Box[] = [boxAhead(-6, -40, 30, 2)];
  if (foe && v.ring) {
    const [fx, fy] = enemyCenter(foe);
    const r = withCharms("area", v.ring);
    boxes.push([fx - r, fy - r, fx + r, fy + r]);
  }
  const hits = meleeHit(boxes, { power, kx: WARP_KICK.kx, ky: WARP_KICK.ky, big: true, sureCrit: crit });
  if (foe && winding && v.windup) staggerFoe(foe, WARP_KICK.windupStun);
  if (crit && hits && v.momentum) gainMomentum(v.momentum);
  if (foe && hits) game.fx.push(createImpact(...enemyCenter(foe), hero.face, true, SPARKS.brass));
}

/** after the kick: the chain stays wound round the foe a moment, and in the air a hook and a Hanging Arc come back */
function arrived(foe: Enemy | null): void {
  if (foe && foe.hp > 0) bindFoe(foe, foe.rank === "minion" ? WARP_BIND.hold : WARP_BIND.bigHold, null);
  if (hero.ground) return;
  orrin.hooks = Math.max(orrin.hooks, Math.min(1, hooksPerAir()));
  giveArcBack(false);
}

/** Orrin's warp: the hook thrown on its chain, a flying kick on arrival that binds the foe, and Gaff's numbers */
export const ORRIN_WARP: WarpStyle = {
  drawThrown,
  strike,
  arrived,
  tune: () => skillValues(GAFF),
};
