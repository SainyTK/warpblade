import { dealDamage } from "../../../game/damage";
import { createFloorRing } from "../../../game/effects/floorRing";
import { launchEnemy } from "../../../game/enemies/airborne";
import { walks } from "../../../game/enemies/enemy";
import { skin } from "../../../game/hero/skin";
import { skillLevel, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { SKILL } from "../constants/skills/ids";
import { sheatheFlash } from "./effects/sheatheFlash";
import { sayaFx } from "./skillFx";
import { sayaSound } from "./sound";
import { releaseCuts } from "./store";

/** Falling Moon's ring: a cut along the floor from where she lands, to the foes standing near, which with its eighth
 *  level throws them up */
function landingRing(): void {
  const v = skillValues(SKILL.falling);
  if (!v.ring) return;
  const reach = withBuild("area", v.ringReach);
  game.fx.push(createFloorRing(hero.x, hero.y, reach, skin.ramp, 0.3));
  for (const e of game.enemies) {
    if (e.hp <= 0 || !walks(e) || e.air || Math.abs(e.x - hero.x) > reach) continue;
    dealDamage(e, progress.stats.ad * v.ring, { fromX: hero.x, kx: Math.sign(e.x - hero.x) * 50 });
    if (v.lift) launchEnemy(e, v.lift);
  }
}

/** the falling draw lands: the blade clicks home and releases every stored cut, with Falling Moon's ring */
export function landDraw(): void {
  sayaSound.click();
  sheatheFlash();
  if (skillLevel(SKILL.falling)) {
    const v = skillValues(SKILL.falling);
    sayaFx(
      SKILL.falling,
      { x: hero.x, y: hero.y, face: hero.face },
      { damage: progress.stats.ad * (1 + (v.ring ?? 0)) * (v.store ?? 1) },
    );
  }
  landingRing();
  releaseCuts(true);
}
