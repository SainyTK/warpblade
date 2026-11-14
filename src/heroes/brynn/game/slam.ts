import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { hitStop, shake, struckThisSwing } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { CRIMSON } from "../constants/colors";
import { FISSURE } from "../constants/heft";
import { SHOCKWAVE } from "../constants/string";
import { createFloorWave } from "./effects/floorWave";
import { heftFull } from "./heft";
import { brynn } from "./state";

/** the slam starts: with full Heft it will be a fissure */
export function slamStarts(): void {
  brynn.fissure = heftFull();
}

/** the foes the slam itself struck, which its shockwave passes by */
const slammed = () => new Set(game.enemies.filter((e) => struckThisSwing(e)));

/** the slam's blade met the floor at `gx`: a fissure that spends the whole Heft bar, or the plain shockwave */
export function slamLanded(gx: number): void {
  const v = skillValues("br_slam");
  if (brynn.fissure) {
    brynn.fissure = false;
    brynn.heft = 0;
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
    emitSkillEvent({ type: "fissure", x: gx });
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
  emitSkillEvent({ type: "shockwave", x: gx });
}
