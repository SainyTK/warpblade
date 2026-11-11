import { stringClips } from "../../../constants/clips/sable/shoot";
import { AIM_STANCE } from "../../../constants/clips/sable/stance";
import { BEATS, BOLT, MUZZLE } from "../../../constants/sable/bolt";
import { glow, place } from "../../../engine/frame";
import { blit } from "../../../engine/sprite";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import type { SpriteImage } from "../../../types/sprite";
import { sampleKeys } from "../../../utils/sampleKeys";
import { enemyCenter } from "../../enemies/enemy";
import { ghostCanvas } from "../../hero/afterimages";
import { drawHero } from "../../hero/drawHero";
import { heroLook } from "../../hero/look";
import { looseBolt } from "../../hero/sable/loose";
import { sable } from "../../hero/sable/memory";
import { loadBolts, quiverSize } from "../../hero/sable/quiver";
import { skin } from "../../hero/skin";
import { game, hero, lights } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "s_shade";
/** bolts in a shade's string, seconds between them and the rest after a string; a lone shade fires one string */
const STRING = { bolts: 3, gap: 0.22, rest: 0.35, lone: 1 } as const;
/** a Twin Shadows shade stands this far from the first */
const TWIN = 14;
/** the hop fan a shade copies, in radians between bolts */
const HOP_FAN = 0.18;

interface Shade {
  x: number;
  y: number;
  face: number;
  life: number;
  max: number;
  /** seconds until its next bolt */
  next: number;
  shots: number;
  look: SpriteImage;
}

interface ShadeMemory {
  cd: number;
  shades: Shade[];
}

const memoryOf = (m: SkillMemory): ShadeMemory => m as unknown as ShadeMemory;

/** her shooting pose at the release, drawn once as a shade */
function shadeLook(): SpriteImage {
  drawHero(ghostCanvas, sampleKeys(stringClips(AIM_STANCE.level).beats[0].keys, BEATS[0].fire), heroLook(4));
  return ghostCanvas.snapshot();
}

/** a copy's bolt: the shade's own damage and the base rules only (shared rule G2) */
function shoot(s: Shade, angle: number, power: number, pierce: number): void {
  looseBolt({
    x: s.x + s.face * MUZZLE.level.x,
    y: s.y + MUZZLE.level.y,
    angle,
    share: 1,
    power,
    pierce,
    prime: null,
    plain: true,
    source: ID,
  });
}

/** the shade turns to the nearest foe and looses a bolt at it, in strings of three */
function fire(s: Shade): void {
  const v = skillValues(ID);
  const y = s.y + MUZZLE.level.y;
  let best: [number, number] | null = null;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const c = enemyCenter(e);
    if (!best || Math.abs(c[0] - s.x) < Math.abs(best[0] - s.x)) best = [c[0], c[1]];
  }
  if (!best) return;
  s.face = Math.sign(best[0] - s.x) || s.face;
  shoot(s, Math.atan2(best[1] - y, best[0] - s.x), v.power, v.pierce);
  s.shots++;
  s.next = s.shots % STRING.bolts ? STRING.gap : STRING.rest;
}

/** Shade Archer: a perfect dodge leaves a shade of her that shoots strings at the nearest foe; with level 7 her own bolts
 *  are primed while it stands; Twin Shadows leaves two that copy her hop volley */
export const shadeArcher: SkillBehavior = {
  create: () => ({ cd: 0, shades: [] }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd -= dt;
    for (const s of m.shades) {
      s.life -= dt;
      s.next -= dt;
      if (s.next <= 0 && s.life > 0) fire(s);
    }
    m.shades = m.shades.filter((s) => s.life > 0);
  },
  draw(memory) {
    for (const s of memoryOf(memory).shades) {
      const k = Math.min(1, s.life * 3, (s.max - s.life) * 8 + 0.3);
      blit(s.look, s.x, s.y, s.face < 0, { alpha: 0.55 * k, tint: skin.glow, tintAmount: 0.7, soft: true });
      place();
      glow(s.x, s.y - 18, 14, skin.glow, 0.15 * k);
    }
  },
  on: {
    perfectDodge(memory, event) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (v.refill) loadBolts(quiverSize());
      if (m.cd > 0) return;
      m.cd = withCharms("cooldown", v.cooldown);
      const life = v.stay ? withCharms("duration", v.stay) : STRING.lone;
      const look = shadeLook();
      for (let i = 0; i < v.shades; i++)
        m.shades.push({
          x: event.at - hero.face * i * TWIN,
          y: hero.y,
          face: hero.face,
          life,
          max: life,
          next: 0.1 + i * 0.1,
          shots: 0,
          look,
        });
      if (v.prime) sable.shade = life;
      lights.add(event.at, hero.y - 18, 40, skin.glow, 0.8, 0.3);
    },
    hop(memory, event) {
      const v = skillValues(ID);
      if (!v.copyHop) return;
      const n = skillValues("s_hopVolley").bolts ?? 1;
      for (const s of memoryOf(memory).shades) {
        const base = event.face > 0 ? 0 : Math.PI;
        s.face = event.face;
        for (let i = 0; i < n; i++) shoot(s, base + (i - (n - 1) / 2) * HOP_FAN, BOLT.power * BOLT.hopShare, 0);
      }
    },
  },
};
