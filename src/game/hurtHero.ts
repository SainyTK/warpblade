import { DAMAGE, HURT_INVULN } from "../constants/combat";
import { SPARKS } from "../constants/palette";
import { sfx } from "../services/audio";
import { createImpact } from "./effects/impact";
import { heroGuarded } from "./hero/guard";
import { perfectDodge } from "./hero/perfectDodge";
import { lastLight } from "./lastLight";
import { hasPerk } from "./progress";
import { character, game, hero, showBanner } from "./state";
import { hitStop, shake } from "./world";

export function hurtHero(dmg: number, fromX: number): void {
  if (heroGuarded()) {
    perfectDodge();
    return;
  }
  const taken = Math.round(dmg * (hasPerk("ironWill") ? DAMAGE.ironWill : 1));
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
  if (hero.hp <= 0) showBanner(`${character.name} has fallen`, 2);
}
