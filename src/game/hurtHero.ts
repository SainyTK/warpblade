import { HURT_INVULN } from "../constants/combat";
import { SPARKS } from "../constants/palette";
import { dodgeWithDrill, hurtDrill, usesDrill } from "../drill";
import { sfx } from "../services/audio";
import { hurtFlow } from "./build/flow";
import { coop, heroSlot } from "./coopHooks";
import { createImpact } from "./effects/impact";
import { noteHurt } from "./heavyShake";
import { heroGuarded } from "./hero/guard";
import { guardTakes } from "./hero/heroGuard";
import { kit } from "./hero/kits";
import { perfectDodge } from "./hero/perfectDodge";
import { loseHitCount } from "./hitCount";
import { lastLight } from "./lastLight";
import { emitSkillEvent } from "./skills/events";
import { character, game, hero, progress, showBanner } from "./state";
import { hitStop, shake } from "./world";

export function hurtHero(dmg: number, fromX: number): void {
  if (guardTakes(dmg, fromX)) return;
  if (kit().absorbHurt(dmg, fromX)) return;
  if (heroGuarded()) {
    if (!usesDrill() || !dodgeWithDrill()) {
      perfectDodge();
    }
    return;
  }
  const taken = Math.round(dmg * kit().hurtScale());
  hero.hp = Math.max(0, hero.hp - taken);
  noteHurt(taken, progress.stats.hp);
  if (taken > 0) {
    hurtFlow();
    loseHitCount();
    emitSkillEvent({ type: "hurt", damage: taken, fromX });
  }
  hero.inv = HURT_INVULN;
  lastLight();
  // armour the kit wears takes the blow: the HP is gone, but no knockback, no hurt state and no lost combo
  if (hero.hp > 0 && kit().steadfast?.()) return;
  const dir = Math.sign(hero.x - fromX) || -hero.face;
  Object.assign(hero, { vx: dir * 150, vy: -160, ground: false, hasSword: true, sword: null });
  Object.assign(hero, { move: null, queued: null, chain: 0, link: 0, charge: 0, chargeLevel: 0 });
  hero.state = hero.hp > 0 ? "hurt" : "dead";
  hero.st = 0;
  if (usesDrill()) {
    hurtDrill(fromX);
  }
  game.fx.push(createImpact(hero.x, hero.y - 18, dir, false, SPARKS.blood));
  hitStop(0.08);
  shake(0.25, 2.5);
  sfx.hurt();
  if (hero.hp <= 0) sfx.defeat();
  // in a room two players can play the same hero, so the banner names the player
  if (hero.hp <= 0) showBanner(`${coop() ? `P${heroSlot() + 1}` : character.name} has fallen`, 2);
}
