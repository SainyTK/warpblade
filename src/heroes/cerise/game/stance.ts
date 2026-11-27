import { HERO_GUARD } from "../../../constants/combat";
import { ellipseRing, glow, place } from "../../../engine/frame";
import { cue } from "../../../game/cue";
import { createImpact } from "../../../game/effects/impact";
import { staggerFoe } from "../../../game/enemies/stagger";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import { ROSE_RAMP, ROSE_SPARKS } from "../look/rose";
import { releaseRoseLine } from "./abilities/roseLine";
import { foeAt, stanceTakes } from "./abilities/spells";
import { atFloor, atHero, ceriseFx } from "./fx";
import { gainPoints } from "./points";
import { openRiposte } from "./riposte";
import { cerise } from "./state";

/**
 * A blow about to land: Mirror Guard's stance turns it aside like a parry and answers with a riposte, the stance's
 * bonus on that first riposte only; the stance ends with it. True when the stance took it.
 */
export function absorbHurt(_dmg: number, fromX: number): boolean {
  if (!stanceTakes(fromX)) return false;
  const v = skillValues("ce_mirrorguard");
  const foe = foeAt(fromX);
  if (foe?.rank === "minion") staggerFoe(foe, HERO_GUARD.parryStagger);
  hero.face = Math.sign(fromX - hero.x) || hero.face;
  hero.inv = Math.max(hero.inv, HERO_GUARD.parryShield);
  cue(hero.x, hero.y - 38, "parry");
  game.fx.push(createImpact(hero.x + hero.face * 10, hero.y - 20, hero.face, true, ROSE_SPARKS));
  sfx.perfect();
  gainPoints(1 + (v.points ?? 0));
  const damage = progress.stats.ad * (2 + (v.bonus ?? 0) * 4);
  ceriseFx("ce_mirrorguard", "slash", { ...atHero(18, 18), face: -hero.face }, { damage, sigil: "thrust" });
  if (skillEvolved("ce_mirrorguard")) {
    ceriseFx("ce_mirrorguard", "spikes", atFloor(hero.x, hero.y, 22), { damage, quiet: true });
  }
  emitSkillEvent({ type: "parry", fromX });
  if (v.line) releaseRoseLine(1, false);
  openRiposte();
  cerise.stance = 0;
  cerise.stanceRiposte = true;
  return true;
}

/** the stance as a ring of rose glass round her while it holds */
export function drawStance(): void {
  if (cerise.stance <= 0) return;
  place();
  const k = Math.min(1, cerise.stance * 4);
  ellipseRing(hero.x, hero.y - 17, 13, 17, ROSE_RAMP[5], 0.5 * k);
  glow(hero.x, hero.y - 17, 16, ROSE_RAMP[3], 0.25 * k);
}
