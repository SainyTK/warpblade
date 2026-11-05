import { HURT_INVULN } from "../constants/combat";
import { SPARKS } from "../constants/palette";
import { sfx } from "../services/audio";
import { coop, heroSlot } from "./coopHooks";
import { createImpact } from "./effects/impact";
import { heroGuarded } from "./hero/guard";
import { kit } from "./hero/kits";
import { perfectDodge } from "./hero/perfectDodge";
import { lastLight } from "./lastLight";
import { character, game, hero, showBanner } from "./state";
import { hitStop, shake } from "./world";

export function hurtHero(dmg: number, fromX: number): void {
  if (kit().absorbHurt(dmg, fromX)) return;
  if (heroGuarded()) {
    perfectDodge();
    return;
  }
  const taken = Math.round(dmg * kit().hurtScale());
  hero.hp = Math.max(0, hero.hp - taken);
  hero.inv = HURT_INVULN;
  lastLight();
  const dir = Math.sign(hero.x - fromX) || -hero.face;
  Object.assign(hero, { vx: dir * 150, vy: -160, ground: false, anchor: null, hasSword: true, sword: null });
  Object.assign(hero, { move: null, queued: null, chain: 0, link: 0, charge: 0, chargeLevel: 0 });
  hero.state = hero.hp > 0 ? "hurt" : "dead";
  hero.st = 0;
  game.fx.push(createImpact(hero.x, hero.y - 18, dir, false, SPARKS.blood));
  hitStop(0.08);
  shake(0.25, 2.5);
  sfx.hurt();
  // in a room two players can play the same hero, so the banner names the player
  if (hero.hp <= 0) showBanner(`${coop() ? `P${heroSlot() + 1}` : character.name} has fallen`, 2);
}
