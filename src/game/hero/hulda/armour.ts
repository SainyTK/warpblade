import { FISTS, HAYMAKER_ARMOUR } from "../../../constants/hulda/fists";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import type { ArmourKind } from "../../../types/hulda";
import { createPlateShards } from "../../effects/plateShards";
import { emitSkillEvent } from "../../skills/events";
import { skillLevel, skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { hitStop } from "../../world";
import { inHaymaker } from "./fists";
import { inIron } from "./fury";
import { gainGrit, plates, rushing } from "./grit";
import { braceTime, braceTook } from "./ironWall";
import { hulda } from "./memory";

/** the haymaker is winding up: armoured from its second frame until the blow lands */
const windingUp = (): boolean => inHaymaker() && hero.st >= HAYMAKER_ARMOUR && hero.st < FISTS.haymaker.hit;

/** what takes a blow she meant to take, or null: the rush, the haymaker's wind-up, Iron Wall's brace */
function counterArmour(): ArmourKind | null {
  if (hero.state === "brace" && hero.st < braceTime()) return "brace";
  if (rushing()) return "rush";
  if (windingUp()) return "windup";
  return null;
}

/** Iron Hide: a broken plate heals a share of max HP, at most once in a while */
function plateHeal(): void {
  const heal = skillLevel("h_ironHide") ? skillValues("h_ironHide").heal : 0;
  if (heal <= 0 || hulda.healWait > 0) return;
  hulda.healWait = GRIT.healEvery;
  hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * heal);
}

/** a plate takes the blow: it breaks with shards from her shoulder */
function breakPlate(): void {
  hulda.grit = Math.max(0, hulda.grit - GRIT.plate);
  hulda.quiet = 0;
  hulda.safe = GRIT.safe;
  hulda.flinch = GRIT.flinch;
  hero.inv = Math.max(hero.inv, GRIT.safe);
  game.fx.push(createPlateShards(hero.x - hero.face * 2, hero.y - 22, hero.face));
  hitStop(GRIT.stop);
  sfx.block();
  plateHeal();
  emitSkillEvent({ type: "armour", kind: "plate", fromX: hulda.hitFrom, counter: false });
}

/** armour took a blow without spending a plate: Unbroken's iron, or a blow she meant to take */
function shrug(kind: ArmourKind | null): void {
  gainGrit(GRIT.hurt);
  hero.inv = Math.max(hero.inv, GRIT.safe);
  hitStop(GRIT.stop);
  sfx.block();
  if (kind === "brace") braceTook();
  if (kind) emitSkillEvent({ type: "armour", kind, fromX: hulda.hitFrom, counter: true });
}

/**
 * A blow has taken its HP and she still stands. Unbroken's iron, the rush, the haymaker's wind-up and Iron Wall's brace
 * take it without spending a plate; otherwise a full plate breaks and she keeps her action. With neither, the blow hurts
 * her as any hero, and earns Grit.
 */
export function steadfast(): boolean {
  const kind = counterArmour();
  if (kind || inIron() || hulda.unbreakT > 0) {
    shrug(kind);
    return true;
  }
  if (plates() > 0) {
    breakPlate();
    return true;
  }
  gainGrit(GRIT.hurt);
  return false;
}
