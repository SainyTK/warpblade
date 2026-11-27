import { feat } from "../../../game/feat";
import { skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { hitStop, shake, struckThisSwing } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { BRYNN_STATS } from "../constants/achievements";
import { CRIMSON } from "../constants/colors";
import { FISSURE } from "../constants/heft";
import { SHOCKWAVE } from "../constants/string";
import { createFloorWave } from "./effects/floorWave";
import { brynnFx, CRESCENT, CREST, layered, PLANTED } from "./fx";
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
    const reach = withBuild("area", FISSURE.reach * (1 + (v.fissureReach ?? 0)));
    const damage = progress.stats.ad * (FISSURE.power + (v.fissure ?? 0));
    const fissure = { x: gx, y: hero.y, face: hero.face, reach: 30 };
    brynnFx("br_slam", "spikes", fissure, { damage, signature: layered(CREST, PLANTED) });
    brynnFx(
      "br_bellows",
      "slash",
      { x: gx - hero.face * 8, y: hero.y - 16, face: hero.face, reach: 20 },
      {
        damage,
        signature: CRESCENT,
      },
    );
    brynnFx("br_bellows", "wave", { ...fissure, reach }, { damage, quiet: true, delay: 0.06 });
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
  const reach = withBuild("area", SHOCKWAVE.reach * (1 + (v.reach ?? 0)));
  const damage = progress.stats.ad * (SHOCKWAVE.power + (v.wave ?? 0));
  const struck = slammed();
  brynnFx("br_slam", "spikes", { x: gx, y: hero.y, face: hero.face, reach: 22 }, { damage, signature: CREST });
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
