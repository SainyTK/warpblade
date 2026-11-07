import { FISTS, HAYMAKER_ARMOUR } from "../../../constants/hulda/fists";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import { createPlateShards } from "../../effects/plateShards";
import { hasPerk } from "../../progress";
import { game, hero, progress } from "../../state";
import { hitStop } from "../../world";
import { gainGrit, plates, rushing } from "./grit";
import { hulda } from "./memory";

/** the haymaker is winding up: armoured from its second frame until the blow lands */
const windingUp = (): boolean =>
  hero.state === "fist" && hulda.blow === 3 && hero.st >= HAYMAKER_ARMOUR && hero.st < FISTS.haymaker.hit;

/** a plate takes the blow: it breaks with shards from her shoulder, and Second Wind heals a little */
function breakPlate(): void {
  hulda.grit = Math.max(0, hulda.grit - GRIT.plate);
  hulda.quiet = 0;
  hulda.safe = GRIT.safe;
  hulda.flinch = GRIT.flinch;
  hero.inv = GRIT.safe;
  game.fx.push(createPlateShards(hero.x - hero.face * 2, hero.y - 22, hero.face));
  hitStop(GRIT.stop);
  sfx.block();
  if (hasPerk("secondWind")) hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * GRIT.secondWind);
}

/**
 * A blow has taken its HP and she still stands. A full plate breaks and she keeps her action; in a rush or the
 * haymaker's wind-up she keeps it without spending one. Otherwise the blow hurts her as any hero, and earns Grit.
 */
export function steadfast(): boolean {
  if (rushing() || windingUp()) {
    gainGrit(GRIT.hurt);
    hero.inv = GRIT.safe;
    hitStop(GRIT.stop);
    sfx.block();
    return true;
  }
  if (plates() > 0) {
    breakPlate();
    return true;
  }
  gainGrit(GRIT.hurt);
  return false;
}
