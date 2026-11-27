import { FEEL } from "../../../constants/combo";
import { createFloorRing } from "../../../game/effects/floorRing";
import { skin } from "../../../game/hero/skin";
import { meleeHit } from "../../../game/meleeHit";
import { skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import { ROSE_LINE } from "../constants/abilities";
import { createRoseLine } from "./effects/roseLine";
import { atFloor, ceriseFx } from "./fx";

/** Swallow Dive's landing cut reaches this far on each side */
const LAND_REACH = 30;

/** the dive touches down: with Swallow Dive a cut on both sides where she lands, and evolved a Rose Line each way */
export function diveLanded(): void {
  const v = skillValues("ce_dive");
  if (!v.land) return;
  const reach = withBuild("area", LAND_REACH + (v.ring ?? 0));
  newSwing();
  const damage = progress.stats.ad * v.land * 2;
  ceriseFx("ce_dive", "pillar", atFloor(hero.x, hero.y, 30), { damage, sigil: "needle", lift: 30 });
  ceriseFx("ce_dive", "nova", atFloor(hero.x, hero.y, reach * 0.6), { damage, quiet: true });
  game.fx.push(createFloorRing(hero.x, hero.y, reach, skin.ramp, 0.35));
  meleeHit([boxAhead(-reach, -22, reach, 4)], {
    power: v.land,
    kx: 90,
    ky: -60,
    stun: 0.5,
    big: true,
    feel: FEEL.firm,
  });
  if (!v.lines) return;
  const lineDamage = progress.stats.ap * ROSE_LINE.power * v.linePower;
  for (const dir of [1, -1]) game.fx.push(createRoseLine(hero.x, hero.y - 6, dir, lineDamage, "attacks"));
}
