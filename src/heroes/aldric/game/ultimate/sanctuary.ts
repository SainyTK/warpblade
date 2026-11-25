import { ULT_LEVELS } from "../../../../constants/ultimate";
import { ellipseRing, fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { lowerWard, raiseWard, type ShotWard } from "../../../../game/shotWards";
import { withBuild } from "../../../../game/skills/query";
import { game, hero, lights, progress } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { SANCTUARY } from "../../constants/abilities";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";
import { DOME_PILLAR } from "../../constants/skillNumbers";
import { createSunPillar } from "../abilities/pillar";
import { aldric } from "../state";

/** the dome's centre stands this high above the floor, as a share of its radius */
const SQUASH = 0.8;

/**
 * Sanctuary, Aldric's ultimate: he plants the shield and a dome of light stands over the spot. Every foe inside it burns
 * at each beat, foe shots break on its skin, and he takes half the damage while he stands in it. Its skill (`al_sanctuary`)
 * makes it larger, longer, harder, pulls foes in, heals him and, as Dawn Citadel, lets it walk with him.
 */
export function castSanctuary(level: number): void {
  const v = ultimateValues();
  const x = hero.x;
  const y = hero.y;
  const r = withBuild("area", SANCTUARY.radius[level - 1] * (v.size ?? 1));
  const time = withBuild("duration", SANCTUARY.time + (v.time ?? 0));
  const burns = Math.round(SANCTUARY.burns * (time / SANCTUARY.time));
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * SANCTUARY.share * (v.power ?? 1);
  aldric.domeX = x;
  aldric.domeR = r;
  aldric.domeLeft = time;
  const at = { x, t: 0, next: 0 };
  const ward: ShotWard = {
    at: () => ({ x: at.x, y: y - r * 0.5 }),
    radius: r,
    broke: (bx, by) => game.fx.push(createImpact(bx, by, 1, false, DAWN_SPARKS)),
  };
  raiseWard(ward);
  game.fx.push(createFloorRing(x, y, r, DAWN_RAMP, 0.5));
  lights.add(x, y - r * 0.5, r + 20, DAWN_RAMP[5], 0.6, 0.3);
  shake(0.25, 3);
  sfx.ultimate(level);
  const effect: Effect = {
    update(dt) {
      at.t += dt;
      if (v.follow) at.x = hero.x;
      aldric.domeX = at.x;
      if (at.t >= at.next && at.t < time) {
        at.next += time / burns;
        for (const e of game.enemies) {
          if (e.hp <= 0) continue;
          const [ex, ey] = enemyCenter(e);
          if (Math.hypot(ex - at.x, (ey - y) / SQUASH) > r) continue;
          const pull = v.pull ? -Math.sign(ex - at.x) * 60 : 30 * Math.sign(ex - at.x);
          dealDamage(e, blow, { source: "ultimate", fromX: at.x, kx: pull, ky: -20, stagger: 0.3 });
        }
        if (v.pillars) domePillar(at.x, r, blow);
        if (v.heal) hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * v.heal);
      }
      const alive = at.t < time;
      if (!alive) {
        lowerWard(ward);
        aldric.domeLeft = 0;
      }
      return alive;
    },
    draw() {
      place();
      const k = Math.min(1, (time - at.t) / 0.4, at.t / 0.15);
      const pulse = 0.85 + 0.15 * Math.sin(at.t * 9);
      for (let i = 0; i <= 6; i++) {
        const h = i / 6;
        const ry = r * Math.sqrt(1 - h * h);
        ellipseRing(at.x, y - h * r * SQUASH, ry, ry * 0.22, DAWN_RAMP[i < 2 ? 5 : 4], 0.35 * k * pulse, 0);
      }
      for (let a = 0; a < 24; a++) {
        const ang = (a / 24) * Math.PI + at.t * 0.6;
        const px = at.x + Math.cos(ang) * r;
        const py = y - Math.sin(ang) * r * SQUASH;
        fleck(px, py, a % 3 ? DAWN_RAMP[5] : WHITE, k);
      }
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * TAU + at.t * 2;
        fleck(at.x + Math.cos(ang) * r * 0.6, y - ((at.t * 20 + i * 7) % (r * SQUASH)), DAWN_RAMP[5], 0.7 * k);
      }
      glow(at.x, y - r * 0.4, r, DAWN_RAMP[4], 0.16 * k);
    },
  };
  game.fx.push(effect);
}

/** Sanctuary's sixth level: a pillar falls on the first foe inside the dome at each burn */
function domePillar(x: number, r: number, blow: number): void {
  const foe = game.enemies.find((e) => e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) <= r);
  if (!foe) return;
  game.fx.push(
    createSunPillar({
      x: enemyCenter(foe)[0],
      delay: 0.1,
      damage: blow * DOME_PILLAR.share,
      stun: 0,
      half: DOME_PILLAR.half,
      source: "ultimate",
    }),
  );
}

/** he stands inside his dome */
export const inDome = (): boolean => aldric.domeLeft > 0 && Math.abs(hero.x - aldric.domeX) <= aldric.domeR;
