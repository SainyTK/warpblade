import { feat } from "../../../game/feat";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { hitStop, shake, struckThisSwing } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { BRYNN_STATS } from "../constants/achievements";
import { CRIMSON } from "../constants/colors";
import { FISSURE } from "../constants/heft";
import { SHOCKWAVE } from "../constants/string";
import { createFloorWave } from "./effects/floorWave";
import { heftFull, heftMost, spendHeft } from "./heft";
import { brynn } from "./state";

/** the slam starts: with full Heft it will be a fissure; with Heavy Hands a heavy slam from half Heft; always once
 *  Anvil Weight has evolved */
export function slamStarts(): void {
  const half = !!skillValues("br_heavy").halfFissure && hero.keen && brynn.heft >= heftMost() / 2;
  brynn.fissure = heftFull() || half || !!skillValues("br_slam").alwaysFissure;
}

/** the foes the slam itself struck, which its shockwave passes by */
const slammed = () => new Set(game.enemies.filter((e) => struckThisSwing(e)));

/** the slam's blade met the floor at `gx`: a fissure that spends the whole Heft bar, or the plain shockwave */
export function slamLanded(gx: number): void {
  const v = skillValues("br_slam");
  if (brynn.fissure) {
    brynn.fissure = false;
    if (!v.alwaysFissure) spendHeft();
    const reach = withCharms("area", FISSURE.reach * (1 + (v.fissureReach ?? 0)));
    const damage = progress.stats.ad * (FISSURE.power + (v.fissure ?? 0));
    for (const face of v.both ? [hero.face, -hero.face] : [hero.face])
      game.fx.push(
        createFloorWave({
          x: gx,
          y: hero.y,
          face,
          reach,
          speed: FISSURE.speed,
          damage,
          stun: FISSURE.stun,
          launch: FISSURE.launch,
          kind: "fissure",
          struck: slammed(),
        }),
      );
    lights.add(gx, hero.y - 6, 50, CRIMSON[4], 0.9, 0.35);
    hitStop(0.06);
    shake(0.35, 4.5);
    sfx.boom();
    feat({ kind: "heroCount", stat: BRYNN_STATS.fissures, add: 1 });
    return;
  }
  const reach = withCharms("area", SHOCKWAVE.reach * (1 + (v.reach ?? 0)));
  const damage = progress.stats.ad * (SHOCKWAVE.power + (v.wave ?? 0));
  const struck = slammed();
  for (const face of v.both ? [hero.face, -hero.face] : [hero.face])
    game.fx.push(
      createFloorWave({
        x: gx,
        y: hero.y,
        face,
        reach,
        speed: SHOCKWAVE.speed,
        damage,
        stun: SHOCKWAVE.stun + (v.stun ?? 0),
        kind: "shock",
        struck,
      }),
    );
}
