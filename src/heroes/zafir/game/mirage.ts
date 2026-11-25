import { HERO_CANVAS } from "../../../constants/hero";
import { glow, place } from "../../../engine/frame";
import { detailCanvas } from "../../../engine/sprite";
import { dealDamage } from "../../../game/damage";
import { createFloorRing } from "../../../game/effects/floorRing";
import { createSlash } from "../../../game/effects/slash";
import { enemyCenter } from "../../../game/enemies/enemy";
import { drawHeroSprite } from "../../../game/hero/look";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues, withBuild } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { game, hero, progress } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import { MIRAGE } from "../constants/guard";
import { SAND_RAMP } from "../constants/palette";
import { sandBurst } from "./effects/spout";
import { RING_CUT } from "./moves/slashes";
import { sandSound } from "./sound";
import { openWounds } from "./wounds";

/** the mirage's own canvas, so it does not share the dash's afterimages */
const mirageCanvas = detailCanvas(HERO_CANVAS.w, HERO_CANVAS.h, HERO_CANVAS.ox, HERO_CANVAS.oy);

/** the mirage bursts into sand blades round where it stood */
function burst(x: number, y: number): void {
  const veil = skillValues("za_veil");
  const reach = withBuild("area", MIRAGE.reach * (veil.mirageReach ?? 1));
  const power = MIRAGE.power + (veil.miragePower ?? 0);
  for (const e of foesOnScreen()) {
    const [ex, ey] = enemyCenter(e);
    if (Math.abs(ex - x) > reach || Math.abs(ey - (y - 16)) > 24) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: x, kx: Math.sign(ex - x) * 90, ky: -40, heavy: true });
    openWounds(e, MIRAGE.wounds);
  }
  game.fx.push(createSlash(x, y, 1, { ...RING_CUT, R: reach * 0.8 }));
  game.fx.push(createFloorRing(x, y, reach, SAND_RAMP, 0.4));
  sandBurst(x, y - 16, 18);
  sandSound.hiss(0.14);
  emitSkillEvent({ type: "mirage", x, y });
}

/**
 * A mirage of Zafir where he stood: a shimmering copy in his pose that minions near it strike at, losing sight of him,
 * until it bursts into sand blades.
 */
export function leaveMirage(x: number, y: number): void {
  const veil = skillValues("za_veil");
  const reach = withBuild("area", MIRAGE.reach * (veil.mirageReach ?? 1));
  for (const e of foesOnScreen())
    if (e.rank === "minion" && Math.abs(e.x - x) <= reach) e.blind = Math.max(e.blind, MIRAGE.blind);
  drawHeroSprite(mirageCanvas, hero.pose, 2);
  const snap = mirageCanvas.snapshot();
  const face = hero.face;
  let t = 0;
  const fx: Effect = {
    update(dt) {
      t += dt;
      if (t < MIRAGE.life) return true;
      burst(x, y);
      return false;
    },
    draw() {
      place();
      glow(x, y - 18, 16, SAND_RAMP[4], 0.25 * (1 - t / MIRAGE.life));
    },
  };
  game.fx.push(fx);
  game.ghosts.push({ s: snap, x, y, flip: face < 0, life: MIRAGE.life, max: MIRAGE.life });
}
