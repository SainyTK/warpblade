import { ENEMIES } from "../../../../constants/enemies";
import { WORLD_COLORS } from "../../../../constants/palette";
import { FLARE } from "../../../../constants/ysra/rites";
import { sfx } from "../../../../services/audio";
import { PK } from "../../../../types/particle";
import type { Box } from "../../../../types/world";
import { createFloorRing } from "../../../effects/floorRing";
import { createShockwave } from "../../../effects/shockwave";
import { type Blow, meleeHit } from "../../../meleeHit";
import { emitSkillEvent } from "../../../skills/events";
import { skillEvolved, skillValues } from "../../../skills/query";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero, particles, progress, rng } from "../../../state";
import { dust, newSwing, shake } from "../../../world";
import { skin } from "../../skin";
import { travelEnded } from "../../travelEnd";
import { emitYsra } from "../events";
import { phoenixCrash } from "./phoenixCrash";

/** where she came down from, for the land event */
type LandFrom = "vault" | "dive";

/** speed foes are drawn toward the impact at */
const PULL_SPEED = 160;
/** Falling Star's ring of fire reaches this far around the impact */
const DIVE_RING = 36;

/** Vault Strike: a landing out of a vault or a dive sends a shockwave along the floor both ways */
function quake(): void {
  const v = skillValues("y_vault");
  if (!v.quake) return;
  game.fx.push(createShockwave(hero.x, hero.y, progress.stats.ad * v.quake, skin.ramp, v.quakeRange, v.quakeStun ?? 0));
  shake(0.3, 3);
}

/** stone chips kicked up to both sides of where she came down */
function chips(n: number): void {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1;
    particles.spawn(
      PK.SHARD,
      hero.x + side * rng.range(2, 8),
      hero.y - 1,
      side * rng.range(30, 90),
      -rng.range(60, 140),
      0.5,
      {
        col: WORLD_COLORS.stoneTop,
        size: rng.range(1.5, 2.5),
      },
    );
  }
}

/** she came down out of a vault or a dive: the land events, the shockwave, and the end of a travel move */
function landed(from: LandFrom): void {
  emitYsra("land", { x: hero.x, y: hero.y, from });
  emitSkillEvent({ type: "land", x: hero.x, y: hero.y, from });
  travelEnded();
  quake();
}

/** a vault comes down on both feet: a thud, dust both ways, a small shake */
export function vaultLanding(): void {
  dust(hero.x - 5, hero.y, 5, -1);
  dust(hero.x + 5, hero.y, 5, 1);
  shake(0.12, 1.4);
  sfx.hit(false, 0.55);
  landed("vault");
}

/** the glaive goes into the floor point first: a ring this wide each way, dust and stone both ways, and a heavy shake */
export function impactBurst(from: LandFrom, reach: number): void {
  game.fx.push(createFloorRing(hero.x + hero.face * 8, hero.y, reach, skin.ramp, 0.4));
  dust(hero.x - 6, hero.y, 7, -1);
  dust(hero.x + 6, hero.y, 7, 1);
  chips(8);
  shake(0.24, 3);
  landed(from);
}

/** the dive's point goes into the floor: the burst, and every foe in the box struck */
export function diveImpact(box: Box, blow: Blow): void {
  newSwing();
  impactBurst("dive", (box[2] - box[0]) / 2);
  const hits = meleeHit([box], blow);
  if (!hits) sfx.hit(true, 0.5);
  emitYsra("strike", { source: "dive", hits });
}

/** Falling Star: the foes near the point are drawn in just before it strikes */
export function pullToImpact(reach: number): void {
  for (const e of game.enemies) {
    const d = e.x - hero.x;
    if (e.hp <= 0 || Math.abs(d) > reach || Math.abs(e.y - hero.y) > 40) continue;
    e.vx = -Math.sign(d) * PULL_SPEED * (1 - ENEMIES[e.type].weight);
  }
}

/** Falling Star's ring of fire around the impact; evolved, the phoenix crashes there and floods the floor */
export function diveRing(v: Readonly<Record<string, number>>): void {
  if (skillEvolved("y_dive")) phoenixCrash(hero.x, hero.y, v.reach, v.flood);
  if (v.ring) game.fx.push(castFlare(hero.x, hero.y, { ...FLARE, radius: DIVE_RING, power: v.ring }, "attacks"));
}
